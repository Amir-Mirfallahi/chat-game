from django.db import models
from django.db.models import JSONField
from core.models import Session
from django.contrib.postgres.indexes import GinIndex # Correct import location

# Speech App Models

class Assessment(models.Model):
    """
    Represents a speech assessment taken during a session.
    """
    id = models.AutoField(primary_key=True)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='assessments', db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    overall_score = models.FloatField(help_text="Overall score from 0 to 100")
    phoneme_scores = JSONField(default=dict, help_text="JSON object with phoneme scores, e.g., {'r': 85, 'l': 60}")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Assessment for Session {self.session.id} at {self.timestamp.strftime('%Y-%m-%d %H:%M')}"

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['session', '-timestamp']),
            GinIndex(fields=['phoneme_scores'], name='assess_phon_scores_gin'),
        ]
