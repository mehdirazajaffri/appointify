from datetime import datetime

from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models

from core.models import BaseModel


class AppointifyUser(AbstractUser):
    user_type = models.CharField(
        max_length=10,
        choices=(
            ('doctor', 'Doctor'),
            ('patient', 'Patient'),
            ('admin', 'Admin')
        ),
        default='patient'
    )
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.get_full_name() or self.username


class Patient(BaseModel):
    user = models.OneToOneField(AppointifyUser, on_delete=models.CASCADE)
    gender = models.CharField(
        max_length=10,
        choices=(
            ('male', "Male"),
            ('female', 'Female'),
            ('other', 'Other')
        )
    )

    def __str__(self):
        return self.user.get_full_name() or self.user.username

    class Meta:
        verbose_name = 'Patient'
        verbose_name_plural = 'Patients'


class TimeSlot(BaseModel):
    TIME_SLOT_CHOICES = (
        ('9AM-10AM', '9AM-10AM'),
        ('10AM-11AM', '10AM-11AM'),
        ('11AM-12PM', '11AM-12PM'),
        ('12PM-1PM', '12PM-1PM'),
        ('1PM-2PM', '1PM-2PM'),
        ('2PM-3PM', '2PM-3PM'),
        ('3PM-4PM', '3PM-4PM'),
        ('4PM-5PM', '4PM-5PM'),
        ('5PM-6PM', '5PM-6PM'),
        ('6PM-7PM', '6PM-7PM'),
        ('7PM-8PM', '7PM-8PM'),
        ('8PM-9PM', '8PM-9PM'),
        ('9PM-10PM', '9PM-10PM')
    )
    slot = models.CharField(max_length=10, choices=TIME_SLOT_CHOICES, primary_key=True)

    def __str__(self):
        return self.slot

    class Meta:
        verbose_name = 'Time Slot'
        verbose_name_plural = 'Time Slots'
        ordering = ('slot',)


class Doctor(BaseModel):
    user = models.OneToOneField(AppointifyUser, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='doctor/images', default='doctor/images/default.png')
    specialization = models.CharField(max_length=255)
    about = models.TextField(null=True, blank=True)
    experience = models.IntegerField(default=0)
    degree = models.CharField(max_length=255)
    time_slots = models.ManyToManyField(TimeSlot, blank=True)

    def __str__(self):
        return self.user.first_name + ' ' + self.user.last_name

    class Meta:
        verbose_name = 'Doctor'
        verbose_name_plural = 'Doctors'
        ordering = ('-created_at',)


class Appointment(BaseModel):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed')
    )
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, null=True, blank=True, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    date = models.DateField()
    time_slot = models.ForeignKey(TimeSlot, on_delete=models.PROTECT)
    email = models.EmailField(max_length=255, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    message = models.TextField(null=True, blank=True)

    def clean(self):
        if self.date < datetime.now().date():
            raise ValidationError('Date cannot be in the past')
        if self.patient.appointments.filter(date=self.date, doctor=self.doctor).exists():
            raise ValidationError('You already have an appointment with this doctor on this date')
        if self.doctor.time_slots.filter(slot=self.time_slot).exists():
            if self.doctor.appointments.filter(date=self.date, time_slot=self.time_slot).exists():
                raise ValidationError('This time slot is not available')
        else:
            raise ValidationError('This time slot is not available')

    class Meta:
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'
