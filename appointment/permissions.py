from rest_framework.permissions import BasePermission


class IsDoctor(BasePermission):
    """
    Permission for doctor
    """

    def has_permission(self, request, view):
        return request.user and request.user.user_type == "doctor"
