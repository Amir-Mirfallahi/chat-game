from rest_framework import serializers
from .models import Lesson, Progress
from core.models import Child # For validating child_id

class LessonSerializer(serializers.ModelSerializer):
    """
    Serializer for the Lesson model.
    """
    # child field will be handled in the view for creation (based on child_id from request)
    # session field is optional for a lesson

    class Meta:
        model = Lesson
        fields = [
            'id',
            'session',
            'child',
            'content',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'child'] # child is set by the view

class NextLessonRequestSerializer(serializers.Serializer):
    """
    Serializer for the request to the /api/curriculum/next-lesson/ endpoint.
    """
    child_id = serializers.UUIDField(help_text="ID of the child for whom to generate the lesson.")
    last_assessment = serializers.JSONField(required=False, help_text="Last assessment data (JSON object) to inform lesson generation.")

    def validate_child_id(self, value):
        if not Child.objects.filter(pk=value).exists():
            raise serializers.ValidationError(f"Child with ID {value} does not exist.")

        # Optional: Check if the child belongs to the authenticated user
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            if not Child.objects.filter(pk=value, user=request.user).exists():
                raise serializers.ValidationError("You can only request lessons for your own child.")
        return value


class ProgressSerializer(serializers.ModelSerializer):
    """
    Serializer for the Progress model.
    """
    child_username = serializers.CharField(source='child.user.username', read_only=True)
    lesson_content_preview = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Progress
        fields = [
            'id',
            'child',
            'child_username',
            'lesson',
            'lesson_content_preview',
            'completed',
            'results',
            'started_at',
            'completed_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'child_username', 'lesson_content_preview', 'started_at', 'updated_at']

    def get_lesson_content_preview(self, obj):
        """
        Returns a small preview of the lesson content, e.g., target phonemes.
        """
        if obj.lesson and obj.lesson.content:
            target_phonemes = obj.lesson.content.get('target_phonemes', [])
            words_sample = obj.lesson.content.get('words', [])[:3] # First 3 words
            return {
                "target_phonemes": target_phonemes,
                "words_sample": words_sample
            }
        return None

    def validate(self, data):
        """
        Check that the child in progress record matches the child of the lesson, if lesson is provided.
        Also, ensure the user creating progress is the parent of the child.
        """
        request = self.context.get('request')
        child = data.get('child') or (self.instance.child if self.instance else None)
        lesson = data.get('lesson') or (self.instance.lesson if self.instance else None)

        if child and lesson:
            if lesson.child != child:
                raise serializers.ValidationError("The lesson's assigned child does not match the progress record's child.")

        if request and hasattr(request, 'user') and request.user.is_authenticated:
            if child and child.user != request.user:
                 raise serializers.ValidationError("You can only create or update progress for your own child.")

        return data
