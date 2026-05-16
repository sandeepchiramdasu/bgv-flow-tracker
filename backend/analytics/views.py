from django.db.models import Count, Q, F, ExpressionWrapper, DurationField, Avg, Case, When
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from candidates.models import Candidate

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_dashboard(request):
    now = timezone.now()
    sla_threshold = timezone.timedelta(hours=48) # Updated to 48

    metrics = Candidate.objects.aggregate(
        total=Count('id'),
        identity_check=Count('id', filter=Q(status='identity_check')),
        employment_check=Count('id', filter=Q(status='employment_check')),
        final_report=Count('id', filter=Q(status='final_report')),

        
        delayed_in_progress=Count(
            'id', 
            filter=~Q(status='final_report') & Q(created_at__lt=now - sla_threshold)
        ),
        
        
        delayed_completed=Count(
            'id',
            filter=Q(status='final_report') & Q(completed_at__gt=F('created_at') + sla_threshold)
        ),

        
        on_time_completed=Count(
            'id',
            filter=Q(status='final_report') & Q(completed_at__lte=F('created_at') + sla_threshold)
        ),
    )

    
    tat_stats = Candidate.objects.annotate(
        actual_duration=ExpressionWrapper(
            Case(
                When(status='final_report', then=F('completed_at') - F('created_at')),
                default=now - F('created_at'),
            ),
            output_field=DurationField()
        )
    ).aggregate(avg_duration=Avg('actual_duration'))

    avg_tat_hours = (
        tat_stats['avg_duration'].total_seconds() / 3600
        if tat_stats['avg_duration']
        else 0
    )

    return Response({
        "total_candidates": metrics['total'],
        "status_distribution": metrics, 
        "delayed_in_progress": metrics['delayed_in_progress'],
        "delayed_completed": metrics['delayed_completed'],
        "on_time_completed": metrics['on_time_completed'],
        "average_tat_hours": round(avg_tat_hours, 2)
    })