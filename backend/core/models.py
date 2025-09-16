from django.db import models
from django.contrib.auth.models import User
import datetime
import uuid

# Core App Models


class Child(models.Model):
    """
    Represents a child user, linked to a standard Django User account which is the parent.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent = models.ForeignKey(User, on_delete=models.CASCADE, related_name="children")
    age = models.PositiveIntegerField()
    native_language = models.CharField(
        max_length=10, help_text="ISO 639-1 language code (e.g., 'en', 'es', 'fa')"
    )
    # Add any other child-specific fields here, e.g., avatar, preferences
    conversation_prompt = models.TextField(max_length=2000, blank=True)
    name = models.CharField(max_length=128, default="KID")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Child: {self.name} (Age: {self.age}, Lang: {self.native_language}), Parent: {self.parent.get_full_name()}"

    class Meta:
        verbose_name_plural = "Children"


class Session(models.Model):
    """
    Represents a learning or interaction session for a child.
    """

    id = models.AutoField(primary_key=True)
    child = models.ForeignKey(
        Child, on_delete=models.CASCADE, related_name="sessions", db_index=True
    )
    livekit_room = models.CharField(
        max_length=100, unique=True, help_text="Unique name for the LiveKit room"
    )
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(
        null=True, blank=True, help_text="Timestamp when the session ended"
    )
    # Add any other session-specific metadata, e.g., session type, goals

    def __str__(self):
        return f"Session {self.id} for {self.child.parent.username} in room {self.livekit_room}"

    def get_session_duration(self):
        if self.ended_at:
            return self.ended_at - self.started_at
        return None

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["child", "-started_at"]),
        ]


class SessionAnalytics(models.Model):
    """
    Stores analytics extracted from a session's conversation for pathologists/therapists/parents.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    session = models.OneToOneField(
        Session,
        on_delete=models.CASCADE,
        related_name="analytics",
        help_text="The session this analytics data belongs to",
    )
    child_vocalizations = models.PositiveIntegerField(default=0)
    assistant_responses = models.PositiveIntegerField(default=0)
    avg_child_utterance_length = models.FloatField(
        null=True, blank=True, help_text="Average words per child utterance"
    )
    unique_child_words = models.PositiveIntegerField(default=0)
    encouragements_given = models.PositiveIntegerField(default=0)
    child_to_ai_ratio = models.FloatField(
        null=True, blank=True, help_text="Ratio of child utterances to AI responses"
    )

    topics_detected = models.JSONField(
        default=list,
        blank=True,
        help_text="List of topics covered (e.g., animals, colors)",
    )
    best_utterance = models.TextField(
        blank=True, help_text="The longest or most accurate phrase by the child"
    )
    conversation_summary = models.TextField(
        blank=True, help_text="Short narrative summary of the session"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Analytics for Session {self.session.id} ({self.session.child.name})"
