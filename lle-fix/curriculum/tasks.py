import json
from celery import shared_task
from django.conf import settings
from django.utils import timezone

from core.models import Child
from .models import Lesson
from .genai_service import generate_lesson_with_genai, GENAI_SDK_AVAILABLE # Import new service

# Removed Vertex AI specific imports and mocks.
# GENAI_SDK_AVAILABLE is imported from genai_service.py
# get_vertex_ai_credentials_for_task removed as GenAI service handles its own auth.


@shared_task(bind=True, max_retries=3, default_retry_delay=60) # bind=True to access self, retry on failure
def pre_generate_lesson_for_child(self, child_id, week_number_override=None):
    """
    Celery task to pre-generate a lesson for a given child using Google GenAI SDK.
    This task can be called periodically or triggered by certain events.
    """
    try:
        child = Child.objects.get(pk=child_id)
    except Child.DoesNotExist:
        print(f"Task pre_generate_lesson: Child with ID {child_id} not found. Task will not run.")
        return f"Child {child_id} not found."

    if not GENAI_SDK_AVAILABLE: # Check availability from the imported service
        print("Task pre_generate_lesson: Google GenAI SDK not available or not configured. Cannot generate lesson.")
        # Depending on retry strategy, you might raise an exception to trigger Celery's retry.
        # For a persistent configuration issue, retrying might not help.
        # Consider logging this as a critical error.
        raise Exception("Google GenAI SDK unavailable or not configured in Celery worker.")


    print(f"Starting pre_generate_lesson_for_child (GenAI) for child ID: {child_id}")

    try:
        # Fetch last assessment or relevant history if needed for a more tailored prompt
        # For simplicity, this example uses a generic prompt for pre-generation.
        last_assessment_data = {} # Placeholder, could query Assessment model

        # The prompt is now fully managed within the genai_service using LangChain's ChatPromptTemplate.
        lesson_content_data = generate_lesson_with_genai(
            child_age=child.age,
            child_native_language=child.native_language,
            last_assessment_data=last_assessment_data
        )

        if lesson_content_data is None:
            # Error messages are printed within the service
            # Retry the task as the LLM call might be transiently failing or returning invalid JSON
            print(f"Task pre_generate_lesson: Failed to generate lesson content from GenAI for child {child_id}. Retrying if possible.")
            raise Exception("Failed to get valid lesson data from GenAI service.") # This will trigger Celery retry

        # Determine week number
        existing_lessons_count = Lesson.objects.filter(child=child).count()
        current_week = week_number_override if week_number_override is not None else (existing_lessons_count + 1)

        # Ensure 'week' from LLM is an int, or override
        # The genai_service might already try to parse/validate, but good to double check here.
        if 'week' not in lesson_content_data or not isinstance(lesson_content_data.get('week'), int):
            print(f"Warning: 'week' from LLM response for child {child_id} is invalid or missing. Overriding with {current_week}.")
            lesson_content_data['week'] = current_week
        # Optionally, you might prefer to always use the calculated current_week:
        # lesson_content_data['week'] = current_week


        # Check if a lesson for this week already exists to avoid duplicates if pre-generating sequentially
        # if Lesson.objects.filter(child=child, content__week=lesson_content_data['week']).exists():
        # print(f"Task pre_generate_lesson: Lesson for week {lesson_content_data['week']} already exists for child {child_id}.")
        # return f"Lesson for week {lesson_content_data['week']} already exists for child {child_id}."

        Lesson.objects.create(
            child=child,
            content=lesson_content_data
        )
        print(f"Successfully pre-generated lesson (GenAI) for child ID: {child_id}, week: {lesson_content_data['week']}")
        return f"Lesson pre-generated (GenAI) for child {child_id}, week {lesson_content_data['week']}."

    except Exception as e:
        # This catches errors from the GenAI call (already retried by service if it's JSON related)
        # or other unexpected errors.
        print(f"ERROR Task pre_generate_lesson (GenAI) for child {child_id}: {str(e)}")
        # Retry the task for transient errors.
        raise self.retry(exc=e) # Celery will use max_retries and default_retry_delay


@shared_task
def schedule_daily_lesson_generation():
    """
    A periodic task (e.g., run daily by Celery Beat) to queue
    lesson pre-generation for active children.
    """
    # Example: Get all children who were active recently or match some criteria
    # For now, let's assume we iterate over all children.
    # In a real scenario, you'd filter for active/subscribed children.
    active_children = Child.objects.all()
    for child in active_children:
        # Check if a lesson for the next logical week needs to be generated
        # This logic can be sophisticated, e.g., checking progress, last lesson date.
        # For a simple example, always try to generate one new lesson.
        print(f"Scheduling lesson generation for child: {child.id}")
        pre_generate_lesson_for_child.delay(child_id=child.id)

    return f"Scheduled lesson generation for {active_children.count()} children."

# To use schedule_daily_lesson_generation with Celery Beat, you'd configure it
# in your Django settings (e.g., settings.CELERY_BEAT_SCHEDULE) or a Celery Beat scheduler.
# Example for settings.py:
# CELERY_BEAT_SCHEDULE = {
#     'schedule-daily-lesson-generation-task': {
#         'task': 'curriculum.tasks.schedule_daily_lesson_generation',
#         'schedule': crontab(hour=3, minute=0),  # Run daily at 3:00 AM
#     },
# }
# Requires: from celery.schedules import crontab
# And Django Celery Beat setup (django-celery-beat package and add to INSTALLED_APPS, run migrations)
# For now, this task is defined but not automatically scheduled by this code alone.
