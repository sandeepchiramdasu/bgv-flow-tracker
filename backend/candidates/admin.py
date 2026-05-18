from django.contrib import admin
from django.utils.html import format_html

from .models import Candidate, ActivityLog


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):

    # -----------------------------
    # TABLE DISPLAY
    # -----------------------------
    list_display = (
        'name',
        'masked_phone',
        'work_email',
        'status',
        'identity_verified',
        'employment_verified',
        'display_tat_status',
        'created_at',
        'completed_at'
    )

    # -----------------------------
    # FILTERS
    # -----------------------------
    list_filter = (
        'status',
        'identity_verified',
        'employment_verified',
        'created_at'
    )

    # -----------------------------
    # SEARCH
    # -----------------------------
    search_fields = (
        'name',
        'work_email',
        'phone_number'
    )

    # -----------------------------
    # READ ONLY
    # -----------------------------
    readonly_fields = (
        'created_at',
        'updated_at',
        'completed_at'
    )

    # -----------------------------
    # FIELD GROUPING
    # -----------------------------
    fieldsets = (
        ("Candidate Info", {
            'fields': (
                'name',
                'phone_number',
                'work_email'
            )
        }),

        ("Verification", {
            'fields': (
                'status',
                'identity_verified',
                'employment_verified'
            )
        }),

        ("Remarks", {
            'fields': (
                'remarks',
                'internal_remarks'
            )
        }),

        ("Timestamps", {
            'fields': (
                'created_at',
                'updated_at',
                'completed_at'
            )
        }),
    )

    # -----------------------------
    # MASK PHONE IN ADMIN TABLE
    # -----------------------------
    def masked_phone(self, obj):
        phone = obj.phone_number

        if len(phone) >= 10:
            return f"{phone[:2]}******{phone[-2:]}"
        return phone

    masked_phone.short_description = "Phone"

    # -----------------------------
    # TAT COLOR DISPLAY
    # -----------------------------
    def display_tat_status(self, obj):
        color = obj.get_tat_status()
        hours = round(obj.get_tat_hours(), 1)

        colors = {
            "green": "#28a745",
            "yellow": "#ffc107",
            "red": "#dc3545"
        }

        return format_html(
            '''
            <span style="
                color: white;
                background-color: {};
                padding: 4px 12px;
                border-radius: 12px;
                font-weight: bold;
            ">
                {} ({}h)
            </span>
            ''',
            colors.get(color, "gray"),
            color.upper(),
            hours
        )

    display_tat_status.short_description = "TAT Status"


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):

    list_display = (
        'candidate',
        'action',
        'from_status',
        'to_status',
        'changed_by',
        'timestamp'
    )

    list_filter = (
        'action',
        'to_status',
        'changed_by'
    )

    search_fields = (
        'candidate__name',
        'changed_by'
    )

    readonly_fields = (
        'timestamp',
    )