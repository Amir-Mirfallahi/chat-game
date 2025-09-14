from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers
from .models import Child, Session, SessionAnalytics


class ChildSerializer(serializers.ModelSerializer):
    """
    Serializer for the Child model.
    """

    class Meta:
        model = Child
        fields = [
            "id",
            "age",
            "native_language",
            "parent",
            "name",
            "conversation_prompt",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "parent", "created_at", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User registration, including creating a Child profile.
    """

    children = ChildSerializer(many=True, required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "children"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        children_data = validated_data.pop("children")
        password = validated_data.pop("password")

        with transaction.atomic():  # Ensure User and Child are created together or not at all
            user = User.objects.create_user(**validated_data)
            user.set_password(password)  # Hash the password
            user.save()

            for child_data in children_data:
                Child.objects.create(parent=user, **child_data)
        return user


class SessionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Session model.
    """

    child_username = serializers.CharField(
        source="child.parent.username", read_only=True
    )

    class Meta:
        model = Session
        fields = [
            "id",
            "child",
            "child_username",
            "livekit_room",
            "started_at",
            "ended_at",
        ]
        read_only_fields = ["id", "started_at", "child_username"]

    def validate_child(self, value):
        """
        Ensure the child belongs to the requesting user when creating a session.
        This assumes the serializer context has the request object.
        """
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            if not Child.objects.filter(parent=request.user, pk=value.pk).exists():
                raise serializers.ValidationError(
                    "You can only create sessions for your own child profile."
                )
        # If no request or user in context (e.g. admin or internal call), allow.
        return value


class SessionCreateResponseSerializer(serializers.Serializer):
    """
    Serializer for the response of the custom POST /api/sessions/ endpoint.
    """

    session_id = serializers.IntegerField()
    livekit_room = serializers.CharField()
    # Add child_id for clarity in response
    child_id = serializers.UUIDField()
    started_at = serializers.DateTimeField()


class SessionAnalyticsSerializer(serializers.ModelSerializer):
    child_id = serializers.UUIDField(write_only=True)
    session = serializers.PrimaryKeyRelatedField(read_only=True)
    child = serializers.CharField(source="session.child.name", read_only=True)

    class Meta:
        model = SessionAnalytics
        fields = [
            "id",
            "session",
            "child",
            "child_id",
            "child_vocalizations",
            "assistant_responses",
            "avg_child_utterance_length",
            "unique_child_words",
            "encouragements_given",
            "child_to_ai_ratio",
            "topics_detected",
            "best_utterance",
            "conversation_summary",
            "created_at",
            "updated_at",
        ]
        read_only_fields = read_only_fields = [
            "id",
            "session",
            "child",
            "created_at",
            "updated_at",
        ]
