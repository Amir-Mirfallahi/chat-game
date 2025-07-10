from rest_framework import serializers
from .models import Assessment
from core.models import Session # For validating session_id

class AssessmentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Assessment model.
    Accepts session_id for creating an assessment.
    """
    session_id = serializers.PrimaryKeyRelatedField(
        queryset=Session.objects.all(),
        source='session', # Map session_id to the session model field
        write_only=True,
        help_text="ID of the session this assessment belongs to."
    )

    class Meta:
        model = Assessment
        fields = [
            'id',
            'session',         # Read-only, populated from session_id on write
            'session_id',      # Write-only field for input
            'timestamp',
            'overall_score',
            'phoneme_scores',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'session', 'timestamp', 'created_at', 'updated_at']

    def validate_session_id(self, value):
        """
        Validate that the session exists and optionally, if the session belongs
        to the user making the request (if user context is available).
        """
        request = self.context.get('request')
        if not value:
            raise serializers.ValidationError("Session ID is required.")

        # Basic existence check
        if not Session.objects.filter(pk=value.pk).exists():
            raise serializers.ValidationError(f"Session with ID {value.pk} does not exist.")

        # Optional: Check if the session's child belongs to the authenticated user
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            # Assuming Child model has a 'user' field linked to auth.User
            # and Session has a 'child' field.
            if not Session.objects.filter(pk=value.pk, child__user=request.user).exists():
                raise serializers.ValidationError("You can only create assessments for sessions belonging to your child.")
        return value

    def create(self, validated_data):
        # 'session' is automatically handled by PrimaryKeyRelatedField's source='session'
        assessment = Assessment.objects.create(**validated_data)
        return assessment
