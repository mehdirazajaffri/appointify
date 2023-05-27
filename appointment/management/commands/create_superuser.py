from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create a superuser automatically'

    def handle(self, *args, **options):
        get_user_model()
        if not get_user_model().objects.filter(username='admin').exists():
            get_user_model().objects.create_superuser('admin', 'admin@example.com', 'Mehdi123')
            self.stdout.write(self.style.SUCCESS('Superuser created successfully'))
        else:
            self.stdout.write(self.style.WARNING('Superuser already exists'))
