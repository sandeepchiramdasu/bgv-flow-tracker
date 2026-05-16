from django.core.management.base import BaseCommand
from django.utils import timezone
from candidates.models import Candidate
from datetime import timedelta

class Command(BaseCommand):
    help = 'Backdates a candidate creation time for TAT testing'

    def add_arguments(self, parser):
        parser.add_argument('candidate_id', type=int)
        parser.add_argument('hours', type=int, help='Hours to push back')

    def handle(self, *args, **options):
        try:
            candidate = Candidate.objects.get(pk=options['candidate_id'])
            # Subtract hours from current time
            new_date = timezone.now() - timedelta(hours=options['hours'])
            
            # Use .update() because it bypasses auto_now_add restrictions
            Candidate.objects.filter(pk=candidate.id).update(created_at=new_date)
            
            self.stdout.write(self.style.SUCCESS(
                f'Successfully backdated {candidate.name} by {options["hours"]} hours.'
            ))
        except Candidate.DoesNotExist:
            self.stdout.write(self.style.ERROR('Candidate not found'))