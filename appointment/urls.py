from django.urls import path, include
from rest_framework.routers import DefaultRouter

from appointment import views

router = DefaultRouter()
router.register(r"doctors", views.DoctorViewSet)
router.register(r"patients", views.PatientViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("auth-token/", views.AuthTokenView.as_view()),
]
