# Create your views here.
from datetime import timedelta, datetime, timezone, date

from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema, OpenApiParameter
from rest_framework import viewsets, filters, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from appointment.models import Doctor, Patient, Appointment
from appointment.serializers import DoctorSerializer, PatientSerializer, AppointmentSerializer


class AuthTokenView(APIView):
    permission_classes = (AllowAny,)
    authentication_classes = ()
    serializer_class = AuthTokenSerializer

    @extend_schema(
        tags=['Auth Token'],
        summary="Get Auth Token",
        request=AuthTokenSerializer,
        responses={
            200: {
                'type': 'object',
                'properties': {
                    'token': {'type': 'string'},
                    'user_id': {'type': 'integer'},
                    'created': {'type': 'string', 'format': 'date-time'},
                    'email': {'type': 'string'},
                    'first_name': {'type': 'string'},
                    'last_name': {'type': 'string'},
                    'last_login': {'type': 'string', 'format': 'date-time'},
                },
            },
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Get or create a token for the user
        token, created = Token.objects.get_or_create(user=user)

        # If token already exists and has expired, delete it and create a new one
        expiration_time = token.created + timedelta(hours=settings.TOKEN_EXPIRE_HOURS)
        if not created and datetime.now(timezone.utc) > expiration_time:
            token.delete()  # Delete old token
            user.save()  # Save user
            token = Token.objects.create(user=user)

        # Return token and user information
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'created': token.created,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
        })


class BaseReadOnlyModelViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]


@extend_schema(
    tags=['Doctors']
)
class DoctorViewSet(BaseReadOnlyModelViewSet):
    authentication_classes = ()
    permission_classes = ()
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['specialization', 'experience']
    search_fields = ['name', 'specialization']

    @extend_schema(
        methods=['GET'],
        operation_id='list_available_appointments',
        description='List all available appointments for a specific doctor on a specific date.',
        responses={
            200: {
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'doctor_id': {'type': 'integer'},
                        'doctor_name': {'type': 'string'},
                        'time_slot': {'type': 'string'},
                        'date': {'type': 'string', 'format': 'date'},
                    },
                },
            },
        },
        parameters=[
            OpenApiParameter(name='date', type=OpenApiTypes.DATE, location=OpenApiParameter.QUERY,
                             description='The specific date for which to list available appointments.')
        ]
    )
    @action(detail=True, methods=['GET'], authentication_classes=(), permission_classes=())
    def list_available_appointments(self, request, pk=None):
        doctor = self.get_object()

        selected_date = request.GET.get('date', date.today())

        # Get all appointments for the doctor on the selected date
        appointments = Appointment.objects.filter(doctor=doctor, date=selected_date)

        # Get all time slots for the doctor
        all_time_slots = set(doctor.time_slots.values_list('slot', flat=True))

        # Get booked time slots for the doctor on the selected date
        booked_time_slots = set(appointments.values_list('time_slot__slot', flat=True))

        # Get available time slots
        available_time_slots = all_time_slots - booked_time_slots

        # Create a list of available appointments
        available_appointments = []
        for time_slot in available_time_slots:
            available_appointments.append({
                'doctor_id': doctor.id,
                'doctor_name': doctor.user.get_full_name(),
                'time_slot': time_slot,
                'date': selected_date,
            })
        return Response(available_appointments)

    @extend_schema(
        methods=['POST'],
        operation_id='update_appointment_status',
        description='Update the status of an appointment for a specific doctor.',
        responses={
            200: AppointmentSerializer,
        },
    )
    @action(detail=True, methods=['POST'], authentication_classes=(TokenAuthentication,),
            permission_classes=(IsAuthenticated,))
    def update_appointment_status(self, request, pk=None):
        try:
            if request.user.user_type != "doctor":
                return Response({'error': 'Forbidden'}, status=401)

            doctor = self.get_object()

            appointment_id = request.data.get('appointment_id')
            status = request.data.get('status')

            try:
                appointment = Appointment.objects.get(id=appointment_id, doctor=doctor)
            except Appointment.DoesNotExist:
                return Response({'error': 'Appointment not found'}, status=404)

            appointment.status = status
            appointment.save()
            appointment_serializer = AppointmentSerializer(appointment)
            return Response(appointment_serializer.data)
        except Exception:
            return Response({'error': 'Forbidden'}, status=401)


@extend_schema(
    tags=['Patient'],
)
class PatientViewSet(BaseReadOnlyModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    @extend_schema(
        summary="Get Appointments",
        responses={
            200: AppointmentSerializer(many=True),
        }
    )
    @action(detail=False, methods=['get'])
    def appointments(self, request, pk=None):
        patient = self.get_object()
        appointments = patient.appointment_set.all()
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)

    @extend_schema(
        summary="Book Appointment",
        request=AppointmentSerializer,
        responses={
            201: AppointmentSerializer,
            400: "Bad Request",
        },
    )
    @action(detail=False, methods=['post'], permission_classes=[], authentication_classes=[])
    def book_appointment(self, request, pk=None):
        serializer = AppointmentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Register Patient",
        description="Register a new patient. Don't forget to send Password",
        request=PatientSerializer,
        responses={
            201: PatientSerializer,
            400: "Bad Request",
        },
    )
    @action(detail=False, methods=['post'], permission_classes=[], authentication_classes=[])
    def register_patient(self, request):
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors)
