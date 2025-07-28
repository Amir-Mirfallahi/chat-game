from django.db import models
from django.contrib.auth.models import User
import uuid

# Core App Models


class Child(models.Model):
    """
    Represents a child user, linked to a standard Django User account.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="child_profile"
    )
    age = models.PositiveIntegerField()
    native_language = models.CharField(
        max_length=10, help_text="ISO 639-1 language code (e.g., 'en', 'es', 'fa')"
    )
    # Add any other child-specific fields here, e.g., avatar, preferences

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Child: {self.user.username} (Age: {self.age}, Lang: {self.native_language})"

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
        return f"Session {self.id} for {self.child.user.username} in room {self.livekit_room}"

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["child", "-started_at"]),
        ]
