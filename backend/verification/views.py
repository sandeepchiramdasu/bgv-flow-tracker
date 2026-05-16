from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdminOrVerifier
from candidates.models import Candidate, ActivityLog


@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdminOrVerifier])
def verify_candidate(request, pk):
    try:
        candidate = Candidate.objects.get(id=pk)
    except Candidate.DoesNotExist:
        return Response({"error": "Candidate not found"}, status=404)

    identity = request.data.get('identity_verified')
    employment = request.data.get('employment_verified')

    if identity is not None and employment is not None:
        return Response(
            {"error": "Update only one verification at a time"},
            status=400
        )

    old_status = candidate.status

    final_identity = identity if identity is not None else candidate.identity_verified
    final_employment = employment if employment is not None else candidate.employment_verified

    if final_employment and not final_identity:
        return Response(
            {"error": "Complete identity verification first"},
            status=400
        )

    try:
        with transaction.atomic():
            candidate.identity_verified = final_identity
            candidate.employment_verified = final_employment
            candidate.save()

            if old_status != candidate.status:
                ActivityLog.objects.create(
                    candidate=candidate,
                    from_status=old_status,
                    to_status=candidate.status,
                    changed_by=request.user.username,
                    action="verification_update"
                )

        return Response({
            "message": "Verification updated",
            "new_status": candidate.status
        })

    except Exception as e:
        return Response(
            {"error": f"Transaction failed: {str(e)}"},
            status=500
        )