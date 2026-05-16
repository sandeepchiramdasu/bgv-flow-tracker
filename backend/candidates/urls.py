from rest_framework.routers import DefaultRouter
from django.urls import path

from .views import CandidateViewSet, ActivityLogListView
from .views_public import create_candidate_public
from verification.views import verify_candidate  

router = DefaultRouter()
router.register(r'candidates', CandidateViewSet)

urlpatterns = router.urls + [
    path('verify/<int:pk>/', verify_candidate),
    path('candidates/<int:candidate_id>/logs/', ActivityLogListView.as_view()),

    path('public/candidates/', create_candidate_public),
]