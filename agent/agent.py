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
    cartesia,
    noise_cancellation,
    silero,
    tavus,
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
    "OPENROUTER_API_KEY",
    "ELEVENLABS_API_KEY",
    "CARTESIA_API_KEY",
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

    # ✅ MODIFICATION: Added this new method to process speech and control the avatar
    async def process_and_speak(
        self, session: AgentSession, text: str, child_participation: bool
    ):
        """
        Generates a response using the LLM and sends it to TTS with avatar metadata.
        """
        # 1. Determine the appropriate emotion and gesture
        emotion = self.avatar_controller.get_emotion_for_context(
            text, child_participation
        )

        achievement_level = "good_attempt"
        if child_participation:
            word_count = len(text.split())
            if word_count == 1:
                achievement_level = "first_word"
            elif word_count > 1:
                achievement_level = "breakthrough"

        gesture = self.avatar_controller.get_gesture_for_achievement(achievement_level)

        logger.info(
            f"Avatar response determined - Emotion: {emotion.value}, Gesture: {gesture.value}"
        )

        # 2. Use the session's LLM to generate a text reply
        llm_stream = session.llm.chat(
            history=[
                openai.LLMMessage(
                    role=openai.LLMRole.USER,
                    content=f"""The child said: '{text}'. 
                    Your goal is to expand on this and encourage them.
                    Keep your response very simple (1-5 words).
                    Your current emotion should be {emotion.value}.""",
                )
            ]
        )

        # 3. Speak the response with Tavus metadata for the avatar
        await session.say(
            llm_stream,
            metadata={
                "tavus_emotion": emotion.value,
                "tavus_gesture": gesture.value,
            },
        )

        self.session_stats["successful_responses"] += 1

    # ✅ MODIFICATION: Rewritten to create a complete conversational loop
    async def handle_speech_event(
        self,
        message: str,
        participant: rtc.RemoteParticipant,
        session: AgentSession,
    ):
        """Handle speech from child participants with avatar-enhanced processing"""
        logger.info(
            f"Child vocalization detected: '{message}' from {participant.identity}"
        )
        self.session_stats["child_vocalizations"] += 1

        # If the message is empty (non-verbal sound), generate simple encouragement
        if not message.strip():
            encouragement = self.avatar_controller.get_random_encouragement()
            self.session_stats["encouragements_given"] += 1
            logger.info(f"Generating non-verbal encouragement: '{encouragement}'")
            await session.say(
                encouragement,
                metadata={
                    "tavus_emotion": AvatarEmotion.ENCOURAGING.value,
                    "tavus_gesture": AvatarGesture.THUMBS_UP.value,
                },
            )
        # If there is speech, process it for an expanded response
        else:
            await self.process_and_speak(
                session, text=message, child_participation=True
            )


async def entrypoint(ctx: agents.JobContext):
    """Main entrypoint for the CHAT agent with Tavus avatar."""

    logger.info(f"Starting CHAT agent with Tavus avatar for room: {ctx.room.name}")

    try:
        # Connect to the room first
        logger.info("Connecting to LiveKit room...")
        await ctx.connect(auto_subscribe=agents.AutoSubscribe.AUDIO_ONLY)
        logger.info("Successfully connected to room!")

        # Now we can safely wait for participants
        logger.info("Waiting for first participant to join...")
        participant = await ctx.wait_for_participant()
        logger.info(f"Child participant connected: {participant.identity}")

        # Create AgentSession with child-friendly configurations
        session = AgentSession(
            stt=cartesia.STT(
                api_key=os.getenv("CARTESIA_API_KEY"),
                model="ink-whisper",
            ),
            llm=openai.LLM(
                base_url="https://openrouter.ai/api/v1",
                api_key=os.getenv("OPENROUTER_API_KEY"),
                model="openai/gpt-oss-20b:free",
                temperature=0.3,
            ),
            tts=elevenlabs.TTS(
                voice_id="EXAVITQu4vr4xnSDxMaL",
                model="eleven_multilingual_v2",
                api_key=os.getenv("ELEVENLABS_API_KEY"),
                voice_settings=elevenlabs.VoiceSettings(
                    stability=0.8,
                    similarity_boost=0.7,
                    style=0.3,
                    use_speaker_boost=True,
                    speed=0.75,
                ),
                streaming_latency=2,
            ),
            vad=silero.VAD.load(
                min_speech_duration=100,
                min_silence_duration=600,
                padding_duration=200,
            ),
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
            # participant_kind="agent",
            room_input_options=RoomInputOptions(
                noise_cancellation=(
                    noise_cancellation.BVC()
                    if os.getenv("LIVEKIT_URL", "").startswith("wss://")
                    else None
                ),
            ),
            # ✅ MODIFICATION: UNCOMMENTED this block to prevent audio conflicts
            room_output_options=RoomOutputOptions(
                # Critical: Disable agent's audio output - Tavus avatar handles this
                audio_enabled=False,
            ),
        )

        # Generate initial greeting appropriate for children with avatar
        initial_greeting = """
        Hi there, little friend! I'm CHAT, and I'm so excited to meet you! 
        Can you wave hello to me?
        """

        # Use session.say with metadata for the initial greeting
        await session.say(
            initial_greeting,
            metadata={
                "tavus_emotion": AvatarEmotion.HAPPY.value,
                "tavus_gesture": AvatarGesture.WAVE.value,
            },
        )

        # Set up event handlers for monitoring
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
