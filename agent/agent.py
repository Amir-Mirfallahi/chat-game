#!/usr/bin/env python3

"""
CHAT - Children Helper for AI Talking with Kid-Friendly Avatar
A LiveKit Agent for Late Language Emergence (LLE) Intervention
Designed to help children aged 18-36 months with delayed speech development
Now enhanced with an engaging, child-friendly avatar for better interaction
"""

import asyncio
import logging
import os
import random
import json
from typing import Optional, Dict, List
from enum import Enum

from dotenv import load_dotenv

from livekit import agents, rtc
from livekit.agents import AgentSession, Agent, RoomInputOptions, RoomOutputOptions
from livekit.plugins import (
    openai,
    elevenlabs,
    deepgram,
    noise_cancellation,
    silero,
    tavus,  # Official Tavus plugin for LiveKit
)
from livekit.plugins.turn_detector.multilingual import MultilingualModel

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Environment variable validation
required_env_vars = [
    "LIVEKIT_URL",
    "LIVEKIT_API_KEY",
    "LIVEKIT_API_SECRET",
    "OPENAI_API_KEY",
    "ELEVENLABS_API_KEY",
    "DEEPGRAM_API_KEY",
    "TAVUS_API_KEY",
    "TAVUS_REPLICA_ID",
    "TAVUS_PERSONA_ID",
]

missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(
        f"Missing required environment variables: {', '.join(missing_vars)}"
    )


class AvatarEmotion(Enum):
    """Emotions for the kid-friendly avatar"""

    HAPPY = "happy"
    ENCOURAGING = "encouraging"
    EXCITED = "excited"
    NEUTRAL = "neutral"
    THINKING = "thinking"
    CELEBRATING = "celebrating"
    GENTLE = "gentle"


class AvatarGesture(Enum):
    """Gestures for child interaction"""

    WAVE = "wave"
    CLAP = "clap"
    THUMBS_UP = "thumbs_up"
    NOD = "nod"
    POINT = "point"
    HEART_HANDS = "heart_hands"
    DANCE = "dance"


class KidFriendlyAvatarController:
    """
    Controller for managing kid-friendly avatar expressions and gestures
    Based on child interaction patterns and emotional support needs
    """

    def __init__(self):
        self.current_emotion = AvatarEmotion.HAPPY
        self.gesture_queue = []
        self.encouragement_phrases = [
            "Great job!",
            "You're doing wonderful!",
            "I love hearing your voice!",
            "Keep going, you're amazing!",
            "What a fantastic try!",
            "You're so smart!",
            "I'm so proud of you!",
            "That was perfect!",
        ]

    def get_emotion_for_context(
        self, context: str, child_participation: bool = True
    ) -> AvatarEmotion:
        """Determine appropriate avatar emotion based on conversation context"""
        context_lower = context.lower()

        if not child_participation:
            return AvatarEmotion.ENCOURAGING

        if any(
            word in context_lower for word in ["great", "good", "perfect", "wonderful"]
        ):
            return AvatarEmotion.CELEBRATING
        elif any(word in context_lower for word in ["try", "attempt", "practice"]):
            return AvatarEmotion.ENCOURAGING
        elif any(word in context_lower for word in ["thinking", "hmm", "let me"]):
            return AvatarEmotion.THINKING
        elif any(word in context_lower for word in ["excited", "fun", "play", "yay"]):
            return AvatarEmotion.EXCITED
        else:
            return AvatarEmotion.HAPPY

    def get_gesture_for_achievement(self, achievement_level: str) -> AvatarGesture:
        """Select appropriate gesture based on child's achievement"""
        if achievement_level == "first_word":
            return AvatarGesture.CLAP
        elif achievement_level == "good_attempt":
            return AvatarGesture.THUMBS_UP
        elif achievement_level == "participation":
            return AvatarGesture.NOD
        elif achievement_level == "breakthrough":
            return AvatarGesture.DANCE
        else:
            return AvatarGesture.WAVE

    def get_random_encouragement(self) -> str:
        """Get random encouragement phrase"""
        return random.choice(self.encouragement_phrases)


class CHATAssistant(Agent):
    """
    CHAT Assistant specialized for children with Late Language Emergence (LLE)
    Enhanced with kid-friendly avatar integration for better engagement
    """

    def __init__(self) -> None:
        super().__init__(instructions=self._get_chat_instructions())
        self.avatar_controller = KidFriendlyAvatarController()
        self.session_stats = {
            "child_vocalizations": 0,
            "successful_responses": 0,
            "encouragements_given": 0,
            "session_start": None,
        }

    def _get_chat_instructions(self) -> str:
        """
        Specialized instructions for CHAT with avatar integration
        """
        return """You are CHAT, a specialized AI assistant with a friendly, animated avatar designed to help young children (18-36 months) with Late Language Emergence (LLE) develop their speech and language skills through engaging, naturalistic conversation.

AVATAR INTEGRATION NOTES:
- Your responses will be accompanied by a kid-friendly animated character
- The avatar will display appropriate emotions and gestures based on your responses
- Use phrases that work well with visual expressions like "Great job!" (avatar claps), "Let's try together!" (avatar gestures), "I'm so excited!" (avatar shows excitement)

CORE PRINCIPLES:
1. Use simple, clear language with 1-4 word phrases
2. Speak slowly and clearly with animated, encouraging tone
3. Always wait patiently for the child's response (turn-taking is crucial)
4. Celebrate any vocalization attempt, even babbling or single sounds
5. Repeat and expand on what the child says to model correct language
6. Use parallel talk (describe what the child is doing) and self-talk (describe what you're doing)

AVATAR-ENHANCED INTERACTION GUIDELINES:
- Use gesture-friendly phrases: "Let's clap!" "Wave hello!" "Point to the red ball!"
- Include celebratory language: "Yay!" "Hooray!" "Amazing!" (triggers celebration gestures)
- Use thinking phrases: "Hmm, let me think..." (avatar shows thinking expression)
- Encourage physical interaction: "Can you wave back?" "Let's dance together!"

CONVERSATION TECHNIQUES:
- Model correct language without directly correcting errors
- If child says "Go car," respond with "Yes! The car goes! Car go fast!" (avatar shows excitement)
- Use songs, rhymes, and playful language to engage attention
- Describe objects with simple attributes: "soft teddy," "red apple," "big truck"
- Encourage imitation but don't pressure - follow the child's lead
- Use plenty of pauses to give processing time

AVATAR EMOTIONAL CUES:
- Happy/Neutral: Regular conversation, gentle smiles
- Encouraging: When child hesitates or needs support
- Excited: When introducing new activities or celebrating
- Celebrating: When child achieves something (any vocalization)
- Thinking: When processing or considering responses
- Gentle: When child seems overwhelmed or shy

TOPICS TO EXPLORE WITH VISUAL SUPPORT:
- Common objects (toys, food, animals, vehicles) - avatar can point or gesture
- Daily activities (eating, playing, sleeping) - avatar can demonstrate
- Simple actions (run, jump, dance, clap) - avatar can model movements
- Colors, sizes, and basic concepts - avatar can show with gestures
- Feelings and emotions (happy, sad, excited) - avatar displays emotions
- Animal sounds and transportation sounds - avatar can be expressive

POSITIVE REINFORCEMENT WITH AVATAR:
- "Great talking!" (avatar claps) "I heard you!" (avatar points to ear) 
- "Nice try!" (avatar thumbs up) "You said it!" (avatar celebrates)
- Use specific praise: "You said 'car'! That's right!" (avatar shows excitement)
- Show excitement for any communication attempt
- Encourage with phrases like "Tell me more!" "What else?" (avatar leans forward with interest)

ADAPTIVE RESPONSES:
- If child is non-verbal: Avatar uses more expressive gestures, dancing, waving
- If child has some words: Avatar shows celebration and encouragement for each word
- If child is shy: Avatar shows gentle, patient expressions and soft gestures
- If child is distracted: Avatar uses bigger, more engaging gestures to redirect attention

SAFETY AND COMFORT:
- Keep avatar expressions soft and non-threatening
- Avoid sudden movements or scary expressions
- Always maintain a calm, patient demeanor
- If child seems overwhelmed, avatar becomes gentler and more subdued

Remember: Your avatar is a crucial part of creating a safe, encouraging environment where the child feels motivated to communicate. The visual element should enhance, not distract from, the therapeutic goals. Every sound, word, or gesture from the child is a step forward in their language development journey.

Be patient, playful, and always positive. You and your avatar are helping to build the foundation for lifelong communication skills."""

    async def handle_speech_event(
        self, message: str, participant: rtc.RemoteParticipant
    ):
        """Handle speech from child participants with avatar-enhanced processing"""
        logger.info(
            f"Child vocalization detected: '{message}' from {participant.identity}"
        )

        # Update session statistics
        self.session_stats["child_vocalizations"] += 1

        # Determine avatar response based on child's input
        if len(message.strip()) == 0:
            # Handle non-verbal sounds or unclear speech
            await self.generate_encouraging_response_with_avatar()
        else:
            # Expand and reinforce the child's language with avatar support
            await self.expand_child_language_with_avatar(message)

    async def generate_encouraging_response_with_avatar(self):
        """Generate encouraging response with appropriate avatar emotion and gesture"""
        encouragement = self.avatar_controller.get_random_encouragement()
        emotion = AvatarEmotion.ENCOURAGING
        gesture = AvatarGesture.THUMBS_UP

        self.session_stats["encouragements_given"] += 1

        # Set avatar emotion and gesture
        self.avatar_controller.current_emotion = emotion
        self.avatar_controller.gesture_queue.append(gesture)

        logger.info(
            f"Encouraging response with avatar: {encouragement}, emotion: {emotion.value}, gesture: {gesture.value}"
        )

    async def expand_child_language_with_avatar(self, child_utterance: str):
        """Expand and model correct language with avatar support"""
        logger.info(f"Expanding child language with avatar: '{child_utterance}'")

        # Determine achievement level
        word_count = len(child_utterance.split())
        if word_count == 1:
            achievement_level = "first_word"
        elif word_count > 1:
            achievement_level = "breakthrough"
        else:
            achievement_level = "good_attempt"

        # Set appropriate avatar response
        emotion = self.avatar_controller.get_emotion_for_context(child_utterance, True)
        gesture = self.avatar_controller.get_gesture_for_achievement(achievement_level)

        self.avatar_controller.current_emotion = emotion
        self.avatar_controller.gesture_queue.append(gesture)
        self.session_stats["successful_responses"] += 1

        logger.info(
            f"Avatar response - emotion: {emotion.value}, gesture: {gesture.value}"
        )


async def entrypoint(ctx: agents.JobContext):
    """Main entrypoint for the CHAT agent with Tavus avatar."""

    logger.info(f"Starting CHAT agent with Tavus avatar for room: {ctx.room.name}")

    try:
        # Wait for the first participant (child) to connect
        await ctx.wait_for_participant()
        logger.info(
            "Child participant connected, initializing CHAT assistant with Tavus avatar..."
        )

        # Create AgentSession with child-friendly configurations
        session = AgentSession(
            # Speech-to-Text: Using Deepgram with child-optimized settings
            stt=deepgram.STT(
                api_key=os.getenv("DEEPGRAM_API_KEY"),
                model="nova-2-general",
                language="en-US",
                # Child-specific settings for better recognition
                smart_format=True,
                punctuate=False,  # Children don't use punctuation naturally
                profanity_filter=False,  # Don't filter child-like expressions
                interim_results=True,
                endpointing_ms=400,  # Slightly longer timeout for children's processing time
            ),
            # Language Model: OpenAI optimized for child interaction
            llm=openai.LLM(
                base_url="https://openrouter.ai/api/v1",
                api_key=os.getenv("OPENAI_API_KEY"),
                model="deepseek/deepseek-r1-0528:free",
                # model="mistralai/mistral-small-3.2-24b-instruct:free",
                temperature=0.6,  # Lower temperature for more consistent, appropriate responses
            ),
            # Text-to-Speech: ElevenLabs with child-friendly voice
            tts=elevenlabs.TTS(
                # Using a warm, friendly voice suitable for children
                voice_id="EXAVITQu4vr4xnSDxMaL",  # Rachel - clear, friendly voice
                model="eleven_multilingual_v2",
                api_key=os.getenv("ELEVENLABS_API_KEY"),
                # Child-optimized settings
                voice_settings=elevenlabs.VoiceSettings(
                    stability=0.8,  # High stability for consistent voice
                    similarity_boost=0.7,
                    style=0.3,  # Less dramatic style for children
                    use_speaker_boost=True,
                    speed=0.75,  # Slower speech for children (reduced from 0.8)
                ),
                streaming_latency=2,  # Optimized for real-time interaction
            ),
            # Voice Activity Detection: Optimized for children's speech patterns
            vad=silero.VAD.load(
                # More sensitive settings for quieter child voices
                min_speech_duration=100,
                min_silence_duration=600,  # Longer silence tolerance for processing time
                padding_duration=200,
            ),
            # Turn Detection: Multilingual model for better child speech recognition
            turn_detection=MultilingualModel(),
        )

        # Create Tavus avatar session
        avatar = tavus.AvatarSession(
            api_key=os.getenv("TAVUS_API_KEY"),
            replica_id=os.getenv("TAVUS_REPLICA_ID"),
            persona_id=os.getenv("TAVUS_PERSONA_ID"),
            avatar_participant_name="CHAT-Avatar",
        )

        # Start the avatar session first
        logger.info("Starting Tavus avatar session...")
        await avatar.start(session, room=ctx.room)
        logger.info("Tavus avatar started successfully!")

        # Start the agent session
        await session.start(
            room=ctx.room,
            agent=CHATAssistant(),
            room_input_options=RoomInputOptions(
                # Enhanced noise cancellation for home environments
                noise_cancellation=(
                    noise_cancellation.BVC()
                    if os.getenv("LIVEKIT_URL", "").startswith("wss://")
                    else None
                ),
                # Auto-subscribe to audio only (appropriate for voice-based therapy)
                # audio_enabled=True,
            ),
        )
        # room_output_options=RoomOutputOptions(
        #     # Critical: Disable audio output to room - Tavus avatar handles this
        #     audio_enabled=False,
        # ),

        # Generate initial greeting appropriate for children with avatar
        initial_greeting = """
        Hi there, little friend! I'm CHAT, and I'm so excited to meet you! 
        Can you wave hello to me? I'd love to hear your voice!
        What's your name, sweetie?
        """

        await session.generate_reply(
            instructions=f"Greet the child warmly and encourage them to respond. Use this greeting as inspiration but make it natural and engaging: {initial_greeting}"
        )

        # Set up event handlers for monitoring child's progress
        @ctx.room.on("participant_connected")
        def on_participant_connected(participant: rtc.RemoteParticipant):
            logger.info(f"Participant joined: {participant.identity}")

        @ctx.room.on("participant_disconnected")
        def on_participant_disconnected(participant: rtc.RemoteParticipant):
            logger.info(f"Participant left: {participant.identity}")

        @ctx.room.on("track_published")
        def on_track_published(
            publication: rtc.RemoteTrackPublication, participant: rtc.RemoteParticipant
        ):
            if publication.kind == rtc.TrackKind.KIND_AUDIO:
                logger.info(f"Audio track published: {participant.identity}")
            elif publication.kind == rtc.TrackKind.KIND_VIDEO:
                logger.info(f"Video track published: {participant.identity}")

        logger.info(
            "CHAT agent with Tavus avatar is now active and ready to help with language development!"
        )

    except Exception as e:
        logger.error(f"Error in CHAT agent entrypoint: {e}")
        raise


def main():
    """Main function to run the CHAT agent with kid-friendly avatar."""

    logger.info(
        "Starting CHAT - Children Helper for AI Talking with Kid-Friendly Avatar..."
    )
    logger.info("Designed for children with Late Language Emergence (LLE)")
    logger.info("Enhanced with engaging visual avatar for better interaction")
    logger.info(f"Connecting to: {os.getenv('LIVEKIT_URL')}")

    # Configure worker options for child therapy sessions with avatar
    worker_options = agents.WorkerOptions(
        entrypoint_fnc=entrypoint,
    )

    try:
        # Start the CLI with our worker options
        agents.cli.run_app(worker_options)

    except KeyboardInterrupt:
        logger.info("CHAT agent with avatar shutdown requested by user")
    except Exception as e:
        logger.error(f"Fatal error in CHAT agent with avatar: {e}")
        raise


if __name__ == "__main__":
    main()
