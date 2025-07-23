from django.urls import path
from .views import (
    LiveKitTokenView,
)

app_name = "speech"

urlpatterns = [
    path("livekit-token/", LiveKitTokenView.as_view(), name="livekit_token"),
]
