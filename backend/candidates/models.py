from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone


class Candidate(models.Model):
    STATUS_CHOICES = [
        ('identity_check', 'Identity Check'),
        ('employment_check', 'Employment Check'),
        ('final_report', 'Final Report'),
    ]

    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    work_email = models.EmailField()

    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default='identity_check'
    )

    identity_verified = models.BooleanField(default=False)
    employment_verified = models.BooleanField(default=False)

    remarks = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    


    def clean(self):
        if self.employment_verified and not self.identity_verified:
            raise ValidationError("Employment cannot be verified before identity")

    


    def save(self, *args, **kwargs):

       
        if not self.identity_verified:
            self.status = 'identity_check'
        elif self.identity_verified and not self.employment_verified:
            self.status = 'employment_check'
        else:
            self.status = 'final_report'

       
        if self.status == 'final_report' and not self.completed_at:
            self.completed_at = timezone.now()
        elif self.status != 'final_report':
            self.completed_at = None

        self.full_clean()
        super().save(*args, **kwargs)

   

   
    def get_tat_hours(self):
        if self.completed_at:
            duration = self.completed_at - self.created_at
        else:
            duration = timezone.now() - self.created_at

        return round(duration.total_seconds() / 3600, 2)

    def get_tat_status(self):
        hours = self.get_tat_hours()

        if hours < 24:
            return "green"
        elif 24 <= hours <= 48:
            return "yellow"
        else:
            return "red"

    def __str__(self):
        return f"{self.name} ({self.status})"


class ActivityLog(models.Model):
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.CASCADE,
        related_name='logs'
    )

    from_status = models.CharField(max_length=50, null=True, blank=True)
    to_status = models.CharField(max_length=50)

    changed_by = models.CharField(max_length=255)
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.candidate.name} | {self.action} | {self.timestamp}"