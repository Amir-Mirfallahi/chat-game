import uuid
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.utils import timezone  # For end_session
from django.conf import settings
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from rest_framework import viewsets, status, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import (
    TokenObtainPairView as BaseTokenObtainPairView,
)
from django.db import transaction
import logging
from rest_framework_simplejwt.views import TokenRefreshView as BaseTokenRefreshView

from .models import Child, Session, SessionAnalytics
from .serializers import (
    SessionAnalyticsSerializer,
    UserSerializer,
    ChildSerializer,
    SessionSerializer,
)

logger = logging.getLogger(__name__)
# Import permissions for checking ownership if needed later
# from .permissions import IsOwnerOrReadOnly # Example custom permission

# --- Authentication Views ---


@method_decorator(
    ratelimit(
        key="ip",
        rate=getattr(settings, "RATELIMIT_AUTH_REGISTER_RATE", "10/h"),
        method="POST",
        block=True,
    ),
    name="dispatch",
)
class UserRegistrationView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    Creates a User and an associated Child profile.
    Accessed via POST /api/auth/register/
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Anyone can register


@method_decorator(
    ratelimit(
        key="ip",
        rate=getattr(settings, "RATELIMIT_AUTH_LOGIN_RATE", "10/m"),
        method="POST",
        block=True,
    ),
    name="dispatch",
)
class TokenObtainPairView(BaseTokenObtainPairView):
    """
    Custom TokenObtainPairView if you need to add extra claims or modify behavior.
    For now, using the base view is fine.
    Accessed via POST /api/auth/login/
    """

    # from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
    # serializer_class = TokenObtainPairSerializer # Default
    pass


@method_decorator(
    ratelimit(
        key="ip",
        rate=getattr(settings, "RATELIMIT_TOKEN_REFRESH_RATE", "20/m"),
        method="POST",
        block=True,
    ),
    name="dispatch",
)
class TokenRefreshView(BaseTokenRefreshView):
    """
    Custom TokenRefreshView if needed.
    Accessed via POST /api/auth/token/refresh/
    """

    # from rest_framework_simplejwt.serializers import TokenRefreshSerializer
    # serializer_class = TokenRefreshSerializer # Default
    pass


# --- Core Model ViewSets ---


class ChildViewSet(viewsets.ModelViewSet):  # Changed to ReadOnlyModelViewSet initially
    """
    API endpoint that allows Children to be viewed.
    Retrieves the child profile linked to the authenticated user.
    Child creation happens during UserRegistration.
    Updates can be added if necessary (e.g. changing age, native_language).
    """

    serializer_class = ChildSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should only return the Child object related to the logged-in user.
        """
        user = self.request.user
        if hasattr(user, "children"):
            return Child.objects.filter(parent=user)
        return Child.objects.none()

    def perform_create(self, serializer):
        """Override create to associate the child with the authenticated parent (if needed)."""
        serializer.save(parent=self.request.user)

    @action(
        methods=["GET"],
        url_path="prompt",
        detail=True,
        name="Child's Conversation Prompt",
    )
    def get_conversation_prompt(self, request):
        """Get child's custom conversation props"""
        child = self.get_object()

        if child.conversation_prompt:
            return Response(
                {"conversation_prompt": child.conversation_prompt}, status.HTTP_200_OK
            )
        else:
            return Response(
                {"detail": "No conversation prompt available."},
                status.HTTP_204_NO_CONTENT,
            )


class SessionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Sessions to be viewed or managed.
    - GET /api/sessions/ -> lists sessions for the user's child.
    - POST /api/sessions/start/ -> custom action to start a new session.
    - GET /api/sessions/{id}/ -> retrieves a specific session.
    - POST /api/sessions/{id}/end/ -> custom action to end a session.
    Direct POST to /api/sessions/ for creation is disabled in favor of /start/.
    """

    serializer_class = SessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Users should only see sessions related to their child.
        """
        user = self.request.user
        if hasattr(user, "children"):
            return Session.objects.filter(child__in=user.children.all()).order_by(
                "-started_at"
            )
        return Session.objects.none()

    def get_serializer_context(self):
        """
        Pass request to the serializer context.
        """
        return {"request": self.request}

    @action(detail=False, methods=["post"], url_path="start", name="Start Session")
    def start_session(self, request):
        """
        Custom action to start a new session for the authenticated user's child.
        Input: { "child_id": "<uuid>" }
        Output: { session_id, livekit_room, child_id, started_at }
        """
        user = request.user

        # Check if user has children
        if not hasattr(user, "children") or not user.children.exists():
            return Response(
                {"error": "Authenticated user does not have a child profile."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        child_id = request.data.get("child_id")

        if not child_id:
            return Response(
                {"error": "child_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Validate UUID format
        try:
            child_uuid = uuid.UUID(child_id)
        except ValueError:
            return Response(
                {"error": "Invalid child_id format. Must be a valid UUID."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            child = user.children.get(id=child_uuid)  # Use the UUID object directly
        except Child.DoesNotExist:
            return Response(
                {"error": "Child not found or does not belong to this user."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check for existing active sessions
        active_session = Session.objects.filter(
            child=child, ended_at__isnull=True  # Session hasn't ended yet
        ).first()

        if active_session:
            return Response(
                {
                    "error": "Child already has an active session. Please end the current session first."
                },
                status=status.HTTP_409_CONFLICT,
            )

        # Generate unique room name with timestamp for better uniqueness
        from django.utils import timezone

        timestamp = timezone.now().strftime("%Y%m%d_%H%M%S")
        livekit_room_name = f"child_{child_id}_{timestamp}_{get_random_string(8)}"

        try:
            with transaction.atomic():
                session_instance = Session.objects.create(
                    child=child, livekit_room=livekit_room_name
                )

                logger.info(
                    f"Created session {session_instance.id} for child {child_id}"
                )

            response_data = {
                "session_id": str(session_instance.id),  # Ensure UUID is string
                "livekit_room": session_instance.livekit_room,
                "child_id": str(child_id),  # Ensure UUID is serialized as string
                "started_at": session_instance.started_at,
            }

            # Optional: Use serializer for consistent formatting
            # response_serializer = SessionCreateResponseSerializer(data=response_data)
            # response_serializer.is_valid(raise_exception=True)
            # return Response(response_serializer.data, status=status.HTTP_201_CREATED)

            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error creating session for child {child_id}: {e}")
            return Response(
                {"error": "Failed to create session. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request, *args, **kwargs):
        # Disable direct POST to /api/sessions/
        return Response(
            {
                "detail": 'Method "POST" not allowed. Use POST /api/sessions/start/ to create a session.'
            },
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(detail=True, methods=["post"], url_path="end", name="End Session")
    def end_session(self, request, pk=None):
        """
        Custom action to mark a session as ended.
        """
        session = self.get_object()  # get_object handles permissions and 404
        if session.child.parent != request.user:
            return Response(
                {"error": "You do not have permission to end this session."},
                status=status.HTTP_403_FORBIDDEN,
            )

        if session.ended_at:
            return Response(
                {"message": "Session already ended."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        session.ended_at = timezone.now()
        session.save(update_fields=["ended_at"])

        serializer = self.get_serializer(session)
        return Response(serializer.data)


class SessionAnalyticsViewSet(viewsets.ModelViewSet):
    serializer_class = SessionAnalyticsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Users should only see session analytics related to their child.
        """
        user = self.request.user
        if hasattr(user, "children"):
            return SessionAnalytics.objects.filter(
                session__child__in=user.children.all()
            ).order_by("-session__started_at")
        return SessionAnalytics.objects.none()

    def get_serializer_context(self):
        """
        Pass request to the serializer context.
        """
        return {"request": self.request}

    def perform_create(self, serializer):
        child_id = serializer.validated_data.pop("child_id")
        try:
            child = self.request.user.children.get(id=child_id)
        except Child.DoesNotExist:
            return Response(
                {"error": "You do not have permission for this child."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Use latest session for this child
        session = child.sessions.order_by("-started_at").first()
        if not session:
            return Response(
                {"message": "No session exists for this child."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer.save(session=session)
