from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers
from .models import Child, Session

class ChildSerializer(serializers.ModelSerializer):
    """
    Serializer for the Child model.
    """
    class Meta:
        model = Child
        fields = ['id', 'age', 'native_language', 'user', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User registration, including creating a Child profile.
    """
    child_profile = ChildSerializer(required=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'child_profile']
        read_only_fields = ['id']

    def create(self, validated_data):
        child_data = validated_data.pop('child_profile')
        password = validated_data.pop('password')

        with transaction.atomic(): # Ensure User and Child are created together or not at all
            user = User.objects.create_user(**validated_data)
            user.set_password(password) # Hash the password
            user.save()
            Child.objects.create(user=user, **child_data)
        return user

class SessionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Session model.
    """
    child_username = serializers.CharField(source='child.user.username', read_only=True)

    class Meta:
        model = Session
        fields = ['id', 'child', 'child_username', 'livekit_room', 'started_at', 'ended_at']
        read_only_fields = ['id', 'started_at', 'child_username']

    def validate_child(self, value):
        """
        Ensure the child belongs to the requesting user when creating a session.
        This assumes the serializer context has the request object.
        """
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if not Child.objects.filter(user=request.user, pk=value.pk).exists():
                raise serializers.ValidationError("You can only create sessions for your own child profile.")
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
