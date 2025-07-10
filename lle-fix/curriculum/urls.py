from django.urls import path
from .views import (
    NextLessonAPIView,
    CurriculumHistoryListAPIView
)

app_name = 'curriculum'

urlpatterns = [
    path('next-lesson/', NextLessonAPIView.as_view(), name='next_lesson'),
    path('history/', CurriculumHistoryListAPIView.as_view(), name='curriculum_history'),
]
