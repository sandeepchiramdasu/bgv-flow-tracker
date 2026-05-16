from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from django.core.exceptions import ValidationError

from .models import Candidate


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def create_candidate_public(request):
    name = request.data.get("name", "").strip()
    phone = request.data.get("phone_number", "").strip()
    email = request.data.get("work_email", "").strip()

    # ✅ Basic required validation
    if not name or not phone or not email:
        return Response(
            {"error": "All fields are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ Phone validation (STRICT)
    if not phone.isdigit() or len(phone) != 10:
        return Response(
            {"error": "Phone number must be exactly 10 digits"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ Duplicate email check
    if Candidate.objects.filter(work_email=email).exists():
        return Response(
            {"error": "Email already submitted"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ Duplicate phone check
    if Candidate.objects.filter(phone_number=phone).exists():
        return Response(
            {"error": "Phone number already submitted"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        candidate = Candidate(
            name=name,
            phone_number=phone,
            work_email=email
        )
        candidate.full_clean()
        candidate.save()

    except ValidationError as e:
        return Response(
            {"error": e.message_dict},
            status=status.HTTP_400_BAD_REQUEST
        )

    return Response(
        {"message": "Application submitted successfully"},
        status=status.HTTP_201_CREATED
    )