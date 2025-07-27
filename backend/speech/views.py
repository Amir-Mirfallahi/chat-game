import os
from django.conf import settings
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.core.cache import cache  # For caching tokens

# LiveKit
from livekit import api
from livekit.api import AccessToken, VideoGrants


# Google Cloud AI Platform (Vertex AI)
try:
    # from google.oauth2 import service_account # If using service account file directly
    from google.auth.transport.requests import Request as GoogleAuthRequest
    from google.auth import default as google_auth_default

    GOOGLE_SDK_AVAILABLE = True
except ImportError:
    GOOGLE_SDK_AVAILABLE = False

    # Mock classes
    class GoogleAuthRequest:
        pass

    def google_auth_default(scopes=None):
        return (None, None)


@method_decorator(
    ratelimit(
        key="user_or_ip",
        rate=getattr(settings, "RATELIMIT_MEDIA_TOKEN_RATE", "10/m"),
        method="GET",
        block=True,
    ),
    name="dispatch",
)
class LiveKitTokenView(GenericAPIView):
    """
    GET /api/livekit-token/?room=<room_name>&identity=<user_identity>
    Issues a short-lived LiveKit room access token.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        room_name = request.query_params.get("room")
        identity = request.query_params.get("identity")

        if not room_name or not identity:
            return Response(
                {"error": "Missing 'room' or 'identity' query parameters."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Security: Validate that the identity belongs to the requesting user's child
        # This is crucial to prevent users from generating tokens for arbitrary identities/rooms.
        if not hasattr(request.user, "child_profile") or identity != str(
            request.user.child_profile.id
        ):
            return Response(
                {
                    "error": "Invalid identity. Token can only be generated for the authenticated user's child."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        # Further validation: Check if the room_name corresponds to an active session for this child
        # This adds another layer of security.
        # from core.models import Session # Import Session model
        # if not Session.objects.filter(livekit_room=room_name, child=request.user.child_profile, ended_at__isnull=True).exists():
        #     return Response(
        #         {"error": "Invalid room or session not active for this child."},
        #         status=status.HTTP_403_FORBIDDEN
        #     )

        # LIVEKIT_API_KEY and LIVEKIT_API_SECRET are automatically picked up from env variables by AccessToken()
        # Ensure they are set in your environment.
        # If they are not set, AccessToken() will raise an error.

        cache_key = f"livekit_token_{room_name}_{identity}"
        cached_token = cache.get(cache_key)
        if cached_token:
            return Response({"token": cached_token, "source": "cache"})

        try:
            # api_key and api_secret are no longer passed directly to AccessToken constructor
            # they are expected to be set as environment variables:
            # LIVEKIT_API_KEY and LIVEKIT_API_SECRET
            token = (
                api.AccessToken()
                .with_identity(identity)
                .with_name(request.user.username)
                .with_grants(
                    VideoGrants(
                        room_join=True,
                        room=room_name,
                        can_publish=True,
                        can_subscribe=True,
                    )
                )
                .to_jwt()
            )

            cache.set(
                cache_key,
                token,
                timeout=(
                    settings.RATELIMIT_CACHE_TIMEOUT
                    if hasattr(settings, "RATELIMIT_CACHE_TIMEOUT")
                    else 5 * 60
                ),
            )  # Use a configured timeout or default

            return Response({"token": token, "source": "generated"})
        except Exception as e:
            # It's good practice to log the actual exception for debugging.
            # Consider using Django's logging framework.
            print(f"ERROR: Failed to generate LiveKit token: {str(e)}")
            # Check if the error is due to missing API keys
            if "LIVEKIT_API_KEY" in str(e) or "LIVEKIT_API_SECRET" in str(e):
                return Response(
                    {
                        "error": "LiveKit token service not configured. API key or secret missing."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
            return Response(
                {"error": "Failed to generate LiveKit token."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
