from django.urls import path
from .views import (
    LiveKitTokenView,
    # VertexTokenView, # Removed
    AssessmentCreateAPIView
)

app_name = 'speech'

urlpatterns = [
    path('livekit-token/', LiveKitTokenView.as_view(), name='livekit_token'),
    # path('vertex-token/', VertexTokenView.as_view(), name='vertex_token'), # Removed
    path('assessments/', AssessmentCreateAPIView.as_view(), name='assessment_create'),
]
