from django.contrib import admin
from django.utils.html import format_html
from .models import Candidate, ActivityLog

@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    # Fields to display in the table view
    list_display = (
        'name', 
        'work_email', 
        'status', 
        'identity_verified', 
        'employment_verified', 
        'display_tat_status', 
        'created_at'
    )
    
    # Enable filtering by status and verification flags
    list_filter = ('status', 'identity_verified', 'employment_verified')
    
    # Enable search for candidate details
    search_fields = ('name', 'work_email', 'phone_number')
    
    # Organize detail page layout
    readonly_fields = ('created_at', 'updated_at', 'completed_at')
    
    def display_tat_status(self, obj):
        """Adds a color-coded indicator in the admin list view."""
        color = obj.get_tat_status()
        hours = round(obj.get_tat_hours(), 1)
        
        # Mapping colors to hex for better visibility in Django Admin
        colors = {
            "green": "#28a745",
            "yellow": "#ffc107",
            "red": "#dc3545"
        }
        
        return format_html(
            '<span style="color: white; background-color: {}; padding: 3px 10px; border-radius: 10px; font-weight: bold;">{} ({}h)</span>',
            colors.get(color, "gray"),
            color.upper(),
            hours
        )
    
    display_tat_status.short_description = "TAT Status"


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('candidate', 'from_status', 'to_status', 'changed_by', 'timestamp')
    list_filter = ('to_status', 'changed_by')
    readonly_fields = ('timestamp',)