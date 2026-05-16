from django.urls import path
from .views import verify_candidate

urlpatterns = [
    path('verify/<int:pk>/', verify_candidate),
]