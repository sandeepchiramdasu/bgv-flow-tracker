from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'admin'


class IsVerifier(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'verifier'


class IsViewer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == 'viewer'


class IsAdminOrVerifier(BasePermission):
    def has_permission(self, request, view):
        return request.user.role in ['admin', 'verifier']


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS