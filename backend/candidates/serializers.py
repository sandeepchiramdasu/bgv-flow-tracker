# candidates/serializers.py
from rest_framework import serializers
from .models import Candidate, ActivityLog

class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = '__all__'

class CandidateSerializer(serializers.ModelSerializer):
    tat_hours = serializers.SerializerMethodField()
    tat_status = serializers.SerializerMethodField()
    
    logs = ActivityLogSerializer(many=True, read_only=True)

   
    class Meta:
        model = Candidate
        
        fields = '__all__'
        read_only_fields = ['completed_at']

    def get_tat_hours(self, obj):
        return round(obj.get_tat_hours(), 2)

    def get_tat_status(self, obj):
        return obj.get_tat_status()