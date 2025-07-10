import os
import json
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Lesson, Progress
from .serializers import (
    LessonSerializer,
    ProgressSerializer,
    NextLessonRequestSerializer
)
from core.models import Child

from .genai_service import generate_lesson_with_genai, GENAI_SDK_AVAILABLE # Import new service

# Removed Vertex AI SDK specific mocks and imports.
# GENAI_SDK_AVAILABLE is now imported from genai_service

class NextLessonAPIView(views.APIView):
    """
    POST /api/curriculum/next-lesson/
    Input: { child_id, last_assessment (JSON) }
    Generates a new lesson using Google GenAI SDK (Gemini), saves it, and returns the lesson.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = NextLessonRequestSerializer # For request validation

    # _get_vertex_ai_credentials method removed as it's no longer needed.
    # GenAI SDK configuration is handled in genai_service.py

    def post(self, request, *args, **kwargs):
        serializer = NextLessonRequestSerializer(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data
        child_id = validated_data.get('child_id')
        last_assessment_data = validated_data.get('last_assessment', {}) # Optional

        child = get_object_or_404(Child, pk=child_id)

        # Ensure the requesting user is the parent of the child
        if child.user != request.user:
            return Response(
                {"error": "You can only generate lessons for your own child."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not GENAI_SDK_AVAILABLE: # Check availability from the imported service
            return Response(
                {"error": "Google GenAI SDK not available or not configured on the server."},
                status=status.HTTP_501_NOT_IMPLEMENTED
            )

        try:
            # --- Google GenAI SDK (Gemini) Call via Service ---

            # The prompt is now fully managed within the genai_service using LangChain's ChatPromptTemplate.
            lesson_content_data = generate_lesson_with_genai(
                child_age=child.age,
                child_native_language=child.native_language,
                last_assessment_data=last_assessment_data
            )

            if lesson_content_data is None:
                # Error messages are printed within the service
                return Response({"error": "Failed to generate lesson content using GenAI. Please check server logs."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Use a simple counter for 'week' or let the LLM determine it (current genai_service prompt asks LLM for it)
            # If 'week' needs to be overridden or ensured:
            existing_lessons_count = Lesson.objects.filter(child=child).count()
            current_week = existing_lessons_count + 1
            if 'week' not in lesson_content_data or not isinstance(lesson_content_data.get('week'), int):
                print(f"Warning: 'week' not found in LLM response or invalid. Setting to {current_week}.")
                lesson_content_data['week'] = current_week

            # Save the lesson
            lesson = Lesson.objects.create(
                child=child,
                content=lesson_content_data
                # session can be linked later if this lesson is used in a specific session
            )

            lesson_serializer = LessonSerializer(lesson)
            return Response(lesson_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Log the exception (e.g., using Sentry)
            print(f"ERROR in NextLessonAPIView (GenAI): {str(e)}")
            # import traceback; traceback.print_exc(); # For detailed stack trace during dev
            return Response(
                {"error": f"An unexpected error occurred while generating the next lesson: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CurriculumHistoryListAPIView(generics.ListAPIView):
    """
    GET /api/curriculum/history/?child_id=<uuid>
    Lists all lessons and their progress for a given child.
    """
    serializer_class = ProgressSerializer # Each item will be a Progress record, which links to a Lesson
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        child_id = self.request.query_params.get('child_id')
        if not child_id:
            # Consider returning empty list or specific error if child_id is mandatory
            return Progress.objects.none()

        try:
            # Ensure the child_id is for a child belonging to the authenticated user
            child = get_object_or_404(Child, pk=child_id, user=self.request.user)
        except Child.DoesNotExist: # Or Http404 if get_object_or_404 raises it directly
             return Progress.objects.none() # Or raise PermissionDenied

        # Fetch all progress records for this child, ordered by lesson creation time (desc)
        # This will include lessons that are in progress or completed.
        return Progress.objects.filter(child=child).select_related('lesson').order_by('-lesson__created_at')

    def list(self, request, *args, **kwargs):
        child_id = request.query_params.get('child_id')
        if not child_id:
            return Response({"error": "child_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # The get_queryset method already filters by child and user
        queryset = self.get_queryset()

        if not queryset.exists() and not Child.objects.filter(pk=child_id, user=request.user).exists():
            # If queryset is empty because child doesn't exist or doesn't belong to user
             return Response({"error": "Child not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# Example of how a Celery task might be called (implementation in tasks.py)
# from .tasks import pre_generate_future_lesson
# pre_generate_future_lesson.delay(child_id=child.id, number_of_lessons=5)
