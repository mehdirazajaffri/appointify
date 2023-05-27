from django.contrib.auth import get_user_model
from django.test import TestCase

from .models import Patient


class ModelTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpass',
            first_name='Test',
            last_name='User',
            email="test@gmail.com"
        )
        self.patient = Patient.objects.create(
            user=self.user,
            gender="male")

    def test_patient_str(self):
        self.assertEqual(str(self.patient), 'Test User')
