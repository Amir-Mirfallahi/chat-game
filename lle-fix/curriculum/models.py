from django.db import models
from django.db.models import JSONField
from core.models import Child, Session
from django.contrib.postgres.indexes import GinIndex # Correct import location

# Curriculum App Models

class Lesson(models.Model):
    """
    Represents an AI-generated lesson, typically associated with a session.
    """
    id = models.AutoField(primary_key=True)
    session = models.ForeignKey(Session, on_delete=models.SET_NULL, null=True, blank=True, related_name='lessons', db_index=True, help_text="Session this lesson is part of, if applicable.")
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='lessons', db_index=True, help_text="The child this lesson is intended for (used for pre-generation or direct assignment).")

    content = JSONField(default=dict, help_text="AI-generated lesson schema: {week, target_phonemes, words[], story, activity}")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lesson {self.id} for Child {self.child.id} (Session: {self.session.id if self.session else 'N/A'})"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['child', '-created_at']),
            models.Index(fields=['session', '-created_at']),
            GinIndex(fields=['content'], name='lesson_content_gin'),
        ]


class Progress(models.Model):
    """
    Tracks a child's progress on a specific lesson.
    """
    id = models.AutoField(primary_key=True)
    child = models.ForeignKey(Child, on_delete=models.CASCADE, related_name='progress_records', db_index=True)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='progress_records', db_index=True)
    completed = models.BooleanField(default=False)
    results = JSONField(default=dict, blank=True, help_text="Summary or full assessment data related to this lesson's completion.")

    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        status = "Completed" if self.completed else "In Progress"
        return f"Progress for Child {self.child.id} on Lesson {self.lesson.id} - {status}"

    class Meta:
        verbose_name_plural = "Progress Records"
        unique_together = [['child', 'lesson']]
        ordering = ['child', 'lesson', '-updated_at']
        indexes = [
            models.Index(fields=['child', 'lesson']),
            GinIndex(fields=['results'], name='prog_results_gin'),
        ]
