from rest_framework import serializers
from .models import Candidate, ActivityLog


class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'


class CandidateSerializer(serializers.ModelSerializer):
    tat_hours = serializers.SerializerMethodField()
    tat_status = serializers.SerializerMethodField()

    phone_number = serializers.SerializerMethodField()
    work_email = serializers.SerializerMethodField()

    logs = ActivityLogSerializer(many=True, read_only=True)

    class Meta:
        model = Candidate
        fields = '__all__'

        read_only_fields = [
            'completed_at'
        ]

    # -----------------------------
    # TAT
    # -----------------------------
    def get_tat_hours(self, obj):
        return round(obj.get_tat_hours(), 2)

    def get_tat_status(self, obj):
        return obj.get_tat_status()

    # -----------------------------
    # PHONE MASKING
    # -----------------------------
def get_phone_number(self, obj):
    request = self.context.get('request', None)

    phone = obj.phone_number or ""

    user = getattr(request, "user", None)

    if (
        user
        and getattr(user, "is_authenticated", False)
        and getattr(user, "role", None) == "viewer"
    ):
        if len(phone) >= 10:
            return f"{phone[:2]}******{phone[-2:]}"

        return "********"

    return phone


def get_work_email(self, obj):
    request = self.context.get('request', None)

    email = obj.work_email or ""

    user = getattr(request, "user", None)

    if (
        user
        and getattr(user, "is_authenticated", False)
        and getattr(user, "role", None) == "viewer"
    ):
        try:
            username, domain = email.split('@')

            if len(username) > 1:
                masked_username = (
                    username[0] + '*' * (len(username) - 1)
                )
            else:
                masked_username = '*'

            return f"{masked_username}@{domain}"

        except Exception:
            return "********"

    return email
