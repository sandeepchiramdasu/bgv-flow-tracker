from rest_framework import viewsets, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from users.permissions import IsAdminOrVerifier, ReadOnly
from .models import Candidate, ActivityLog
from .serializers import CandidateSerializer, ActivityLogSerializer


class CandidateViewSet(viewsets.ModelViewSet):
    queryset = Candidate.objects.all().order_by('-created_at')

    serializer_class = CandidateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def get_permissions(self):
        if self.request.method in ['GET']:
            return [IsAuthenticated(), ReadOnly()]

        return [IsAuthenticated(), IsAdminOrVerifier()]

    # 🚫 Block internal creation
    def create(self, request, *args, **kwargs):
        return Response(
            {"error": "Use public endpoint to create candidates"},
            status=403
        )


class ActivityLogListView(generics.ListAPIView):
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        candidate_id = self.kwargs['candidate_id']
        return ActivityLog.objects.filter(candidate_id=candidate_id)