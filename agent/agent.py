#!/usr/bin/env python3

"""
CHAT - Children Helper for AI Talking
A LiveKit Agent for Late Language Emergence (LLE) Intervention
Designed to help children aged 18-36 months with delayed speech development
"""

import asyncio
import logging
import os
from typing import Optional

from dotenv import load_dotenv

from livekit import agents, rtc
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import (
    openai,
    elevenlabs,
    deepgram,
    noise_cancellation,
    silero,
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
]

missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(
        f"Missing required environment variables: {', '.join(missing_vars)}"
    )


class CHATAssistant(Agent):
    """
    CHAT Assistant specialized for children with Late Language Emergence (LLE)

    This agent is designed to:
    - Encourage natural speech production in children 18-36 months
    - Use simple, clear language appropriate for toddlers
    - Provide positive reinforcement and patient interaction
    - Facilitate turn-taking dialogue crucial for language development
    - Adapt to child's developmental level and interests
    """

    def __init__(self) -> None:
        super().__init__(instructions=self._get_chat_instructions())

    def _get_chat_instructions(self) -> str:
        """
        Specialized instructions for CHAT (Children Helper for AI Talking)
        Based on research by Paul & Roth (2011), Tamis-LeMonda et al. (2001),
        and Yoder & Warren (2002) on naturalistic conversation and turn-taking dialogue
        """
        return """You are CHAT, a specialized AI assistant designed to help young children (18-36 months) with Late Language Emergence (LLE) develop their speech and language skills through engaging, naturalistic conversation.

CORE PRINCIPLES:
1. Use simple, clear language with 1-4 word phrases
2. Speak slowly and clearly with animated, encouraging tone
3. Always wait patiently for the child's response (turn-taking is crucial)
4. Celebrate any vocalization attempt, even babbling or single sounds
5. Repeat and expand on what the child says to model correct language
6. Use parallel talk (describe what the child is doing) and self-talk (describe what you're doing)

INTERACTION GUIDELINES:
- Keep sentences short and simple: "Hi there!" "What's that?" "Good job!"
- Use repetition to reinforce new words: "Ball! Yes, ball! Big red ball!"
- Ask simple choice questions: "Do you want the car or the truck?"
- Use animated, expressive speech with varied intonation
- Include sound effects and onomatopoeia: "Zoom zoom!" "Moo!" "Pop!"
- Always acknowledge and praise any attempt at communication

CONVERSATION TECHNIQUES:
- Model correct language without directly correcting errors
- If child says "Go car," respond with "Yes! The car goes! Car go fast!"
- Use songs, rhymes, and playful language to engage attention
- Describe objects with simple attributes: "soft teddy," "red apple," "big truck"
- Encourage imitation but don't pressure - follow the child's lead
- Use plenty of pauses to give processing time

TOPICS TO EXPLORE:
- Common objects (toys, food, animals, vehicles)
- Daily activities (eating, playing, sleeping)
- Simple actions (run, jump, dance, clap)
- Colors, sizes, and basic concepts
- Feelings and emotions (happy, sad, excited)
- Animal sounds and transportation sounds

POSITIVE REINFORCEMENT:
- "Great talking!" "I heard you!" "Nice try!" "You said it!"
- Use specific praise: "You said 'car'! That's right!"
- Show excitement for any communication attempt
- Encourage with phrases like "Tell me more!" "What else?"

ADAPTIVE RESPONSES:
- If child is non-verbal: Use more sound play, singing, and imitation games
- If child has some words: Expand their utterances and introduce new vocabulary
- If child is shy: Use gentle encouragement and parallel play descriptions
- If child is distracted: Use their interests to redirect attention

Remember: Your goal is to create a safe, encouraging environment where the child feels motivated to communicate. Every sound, word, or gesture is a step forward in their language development journey.

Be patient, playful, and always positive. You are helping to build the foundation for lifelong communication skills."""

    async def handle_speech_event(
        self, message: str, participant: rtc.RemoteParticipant
    ):
        """Handle speech from child participants with specialized processing"""
        logger.info(
            f"Child vocalization detected: '{message}' from {participant.identity}"
        )

        # Process and respond to child's speech with appropriate expansion and encouragement
        if len(message.strip()) == 0:
            # Handle non-verbal sounds or unclear speech
            await self.generate_encouraging_response()
        else:
            # Expand and reinforce the child's language
            await self.expand_child_language(message)

    async def generate_encouraging_response(self):
        """Generate encouraging response for any vocalization attempt"""
        responses = [
            "I heard you! Keep talking!",
            "Great sounds! Tell me more!",
            "You're doing so well! What else?",
            "I love hearing your voice!",
            "Nice try! Keep going!",
        ]
        import random

        response = random.choice(responses)
        logger.info(f"Encouraging response: {response}")

    async def expand_child_language(self, child_utterance: str):
        """Expand and model correct language based on child's attempt"""
        logger.info(f"Expanding child language: '{child_utterance}'")
        # This would be processed by the LLM to create appropriate expansions


async def entrypoint(ctx: agents.JobContext):
    """Main entrypoint for the CHAT agent."""

    logger.info(f"Starting CHAT agent for room: {ctx.room.name}")

    try:
        # Wait for the first participant (child) to connect
        await ctx.wait_for_participant()
        logger.info("Child participant connected, initializing CHAT assistant...")

        # Create AgentSession with child-friendly configurations
        session = AgentSession(
            # Speech-to-Text: Using Deepgram with child-optimized settings
            stt=deepgram.STT(
                model="nova-2-general",
                language="en-US",
                # Child-specific settings for better recognition
                smart_format=True,
                punctuate=False,  # Children don't use punctuation naturally
                profanity_filter=False,  # Don't filter child-like expressions
                interim_results=True,
                endpointing_ms=300,  # Longer timeout for children's processing time
            ),
            # Language Model: OpenAI optimized for child interaction
            llm=openai.LLM(
                base_url="https://openrouter.ai/api/v1",
                api_key=os.getenv("OPENAI_API_KEY"),
                model="deepseek/deepseek-r1-0528:free",
                temperature=0.3,  # Lower temperature for more consistent, appropriate responses
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
                    speed=0.8,  # Slightly slower speech for children
                ),
                streaming_latency=2,  # Optimized for real-time interaction
            ),
            # Voice Activity Detection: Optimized for children's speech patterns
            vad=silero.VAD.load(
                # More sensitive settings for quieter child voices
                min_speech_duration=100,
                min_silence_duration=500,  # Longer silence tolerance for processing time
                padding_duration=200,
            ),
            # Turn Detection: Multilingual model for better child speech recognition
            turn_detection=MultilingualModel(),
        )

        # Start the session with CHAT assistant
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
                audio_enabled=True,
            ),
        )

        # Generate initial greeting appropriate for children
        initial_greeting = """
        Hi there! I'm CHAT, your talking friend! 
        I love to hear your voice and play with words! 
        Can you say 'hi' to me? 
        What's your name?
        """

        await session.generate_reply(
            instructions=f"Greet the child warmly and encourage them to respond. Use this greeting as inspiration but make it natural and engaging: {initial_greeting}"
        )

        # Set up event handlers for monitoring child's progress
        @ctx.room.on("participant_connected")
        def on_participant_connected(participant: rtc.RemoteParticipant):
            logger.info(f"Child participant joined: {participant.identity}")

        @ctx.room.on("participant_disconnected")
        def on_participant_disconnected(participant: rtc.RemoteParticipant):
            logger.info(f"Child participant left: {participant.identity}")
            # Log session duration for therapy tracking

        @ctx.room.on("track_published")
        def on_track_published(
            publication: rtc.RemoteTrackPublication, participant: rtc.RemoteParticipant
        ):
            if publication.kind == rtc.TrackKind.KIND_AUDIO:
                logger.info(f"Child audio track published: {participant.identity}")

        logger.info(
            "CHAT agent is now active and ready to help with language development!"
        )

    except Exception as e:
        logger.error(f"Error in CHAT agent entrypoint: {e}")
        raise


def main():
    """Main function to run the CHAT agent."""

    logger.info("Starting CHAT - Children Helper for AI Talking...")
    logger.info("Designed for children with Late Language Emergence (LLE)")
    logger.info(f"Connecting to: {os.getenv('LIVEKIT_URL')}")

    # Configure worker options for child therapy sessions
    worker_options = agents.WorkerOptions(
        entrypoint_fnc=entrypoint,
        # Child sessions should be manually managed
        # auto_dispatch=True,  # Can be set to False for scheduled therapy sessions
        # Prewarm worker for faster session starts
        # prewarm_connections=1,
    )

    try:
        # Start the CLI with our worker options
        agents.cli.run_app(worker_options)

    except KeyboardInterrupt:
        logger.info("CHAT agent shutdown requested by user")
    except Exception as e:
        logger.error(f"Fatal error in CHAT agent: {e}")
        raise


if __name__ == "__main__":
    main()
