from datetime import datetime

from rest_framework import serializers

from appointment.models import Doctor, AppointifyUser, Patient, Appointment


class AppointifyUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = AppointifyUser.objects.create_user(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = AppointifyUser
        fields = ('username', 'email', 'phone_number', 'first_name', 'last_name', 'password',)


class DoctorSerializer(serializers.ModelSerializer):
    user = AppointifyUserSerializer(read_only=True)

    class Meta:
        model = Doctor
        fields = ('id', 'user', 'specialization', 'about', 'time_slots', 'image', 'degree', 'experience',)


class PatientSerializer(serializers.ModelSerializer):
    user = AppointifyUserSerializer()

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = AppointifyUser.objects.create_user(**user_data)
        patient = Patient.objects.create(user=user, **validated_data)
        return patient

    class Meta:
        model = Patient
        fields = ('user', 'gender')


class AppointmentDetailSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)

    class Meta:
        model = Appointment
        fields = "__all__"


class AppointmentSerializer(serializers.ModelSerializer):

    def create(self, validated_data):
        date = validated_data['date']
        patient = validated_data.get('patient', None)
        doctor = validated_data['doctor']
        time_slot = validated_data['time_slot']
        email = validated_data.get('email', None)

        if date < datetime.now().date():
            raise serializers.ValidationError('Date cannot be in the past')

        if patient and patient.appointments.filter(date=date, doctor=doctor).exists():
            raise serializers.ValidationError('You already have an appointment with this doctor on this date')

        if doctor.time_slots.filter(slot=time_slot).exists():
            if doctor.appointments.filter(date=date, time_slot=time_slot).exists():
                raise serializers.ValidationError('This time slot is not available')
        else:
            raise serializers.ValidationError('This time slot is not available')

        if not patient and email:
            if Appointment.objects.filter(date=date, doctor=doctor, email=validated_data['email']).exists():
                raise serializers.ValidationError('This email is already used for this doctor on this date')

        appointment = Appointment.objects.create(**validated_data)
        return appointment

    class Meta:
        model = Appointment
        fields = "__all__"
