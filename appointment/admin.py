from django import forms
from django.contrib import admin

from appointment.models import Patient, Doctor, Appointment, AppointifyUser, TimeSlot

admin.site.site_header = "Appointify Admin"
admin.site.site_title = "Appointify Admin Portal"
admin.site.index_title = "Welcome to Appointify Portal"


class BaseAdmin(admin.ModelAdmin):
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(AppointifyUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'user_type', 'email', 'phone_number')
    list_filter = ('user_type', 'is_active')
    search_fields = ('username', 'email', 'phone_number')

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('user_type', 'phone_number', 'first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff')}),
    )


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'get_full_name')
    list_filter = ('user',)
    search_fields = ('user', 'user__email', 'user__phone_number', 'user__address', 'user__city')
    autocomplete_fields = ["user"]

    @admin.display(description='Name')
    def get_full_name(self, obj):
        return obj.user.get_full_name()


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'about', 'experience', 'degree')
    list_filter = ('specialization', 'experience', 'degree')
    search_fields = ('user', 'user__email', 'user__phone_number', 'user__address', 'user__city')

    def get_form(self, request, obj=None, **kwargs):
        # Define a custom form for the DoctorAdmin
        class DoctorForm(forms.ModelForm):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, **kwargs)
                # Filter the queryset of the 'user' field to show only users with user_type='doctor'
                self.fields['user'].queryset = AppointifyUser.objects.filter(user_type='doctor')

        # Set the form attribute of the DoctorAdmin to the custom DoctorForm
        self.form = DoctorForm
        return super().get_form(request, obj, **kwargs)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('patient', 'email', 'doctor', 'status', 'date', 'time_slot',)
    list_filter = ('doctor', 'status', 'date', 'time_slot',)
    search_fields = ('patient', 'doctor', 'status', 'date', 'time_slot')
    ordering = ('-date', '-time_slot')
    autocomplete_fields = ["patient", "doctor"]


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ('slot',)
