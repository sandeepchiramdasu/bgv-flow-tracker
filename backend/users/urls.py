# urls.py
from django.urls import path
from .views import UserListCreateView, UserDetailView, current_user, logout_view

urlpatterns = [
    # Get all users or create a new one
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    
    # Get, update, or delete a specific user by ID
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('logout/', logout_view),
    path('users/me/', current_user),
]