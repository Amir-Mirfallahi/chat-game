#!/usr/bin/env python3
"""
LiveKit Voice AI Agent with ElevenLabs and MistralAI

This agent implements a long-running voice AI assistant using:
- ElevenLabs for Speech-to-Text (STT) and Text-to-Speech (TTS)
- MistralAI via LangChain for language model processing
- LiveKit for real-time voice communication

Setup Instructions:
1. Install required packages:
   pip install livekit-agents livekit-plugins-elevenlabs langchain-mistralai python-dotenv

2. Set environment variables in .env file:
   LIVEKIT_WS_URL=wss://your-livekit-server.com
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   MISTRAL_API_KEY=your_mistral_api_key

3. Run the agent:
   python agent.py

The agent will connect to the LiveKit room and provide voice interaction capabilities.
"""

import asyncio
import logging
from typing import Optional, List, Dict, Any
import os
from dotenv import load_dotenv

# LiveKit imports
from livekit import agents, rtc
from livekit.agents import (
    AutoSubscriber,
    JobContext,
    JobProcess,
    WorkerOptions,
    cli,
    llm,
    stt,
    tts,
    voice_assistant,
)
from livekit.agents.voice_assistant import VoiceAssistant
from livekit.plugins import elevenlabs

# LangChain imports
from langchain_mistralai import ChatMistralAI
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage, AIMessage

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MistralLLMAdapter(llm.LLM):
    """
    Custom adapter that wraps MistralAI LangChain model to implement LiveKit's LLM interface.
    Injects system message at the start of chat context.
    """

    def __init__(
        self,
        model_name: str = "mistral-large-latest",
        temperature: float = 0.7,
        max_tokens: int = 1000,
        system_message: Optional[str] = None,
    ):
        """
        Initialize the MistralAI LLM adapter.
        
        Args:
            model_name: MistralAI model to use
            temperature: Sampling temperature (0.0 to 1.0)
            max_tokens: Maximum tokens to generate
            system_message: System message to inject at start of context
        """
        super().__init__()
        self._model = ChatMistralAI(
            model=model_name,
            temperature=temperature,
            max_tokens=max_tokens,
            mistral_api_key=os.getenv("MISTRAL_API_KEY"),
        )
        self._system_message = system_message or "You are a helpful AI assistant."
        
    def _convert_to_langchain_messages(self, chat_ctx: llm.ChatContext) -> List[BaseMessage]:
        """Convert LiveKit chat context to LangChain messages format."""
        messages = []
        
        # Always inject system message at the beginning
        messages.append(SystemMessage(content=self._system_message))
        
        # Convert chat messages
        for msg in chat_ctx.messages:
            if isinstance(msg, llm.ChatMessage):
                if msg.role == "user":
                    messages.append(HumanMessage(content=msg.content))
                elif msg.role == "assistant":
                    messages.append(AIMessage(content=msg.content))
                elif msg.role == "system":
                    # Skip additional system messages since we already have one
                    continue
                    
        return messages
    
    def _convert_from_langchain_message(self, message: BaseMessage) -> llm.ChatMessage:
        """Convert LangChain message back to LiveKit format."""
        if isinstance(message, HumanMessage):
            role = "user"
        elif isinstance(message, AIMessage):
            role = "assistant"
        elif isinstance(message, SystemMessage):
            role = "system"
        else:
            role = "assistant"  # Default fallback
            
        return llm.ChatMessage(role=role, content=message.content)

    async def chat(
        self,
        chat_ctx: llm.ChatContext,
        conn_handle: agents.JobContext,
        fnc_ctx: Optional[llm.FunctionContext] = None,
    ) -> "llm.LLMStream":
        """
        Process chat request and return streaming response.
        
        Args:
            chat_ctx: Chat context containing conversation history
            conn_handle: Job context for the connection
            fnc_ctx: Function context (not used in this implementation)
            
        Returns:
            LLMStream for streaming response
        """
        logger.info(f"Processing chat request with {len(chat_ctx.messages)} messages")
        
        # Convert to LangChain format
        langchain_messages = self._convert_to_langchain_messages(chat_ctx)
        
        # Create stream for response
        stream = MistralLLMStream(self._model, langchain_messages)
        return stream


class MistralLLMStream(llm.LLMStream):
    """Streaming response handler for MistralAI."""
    
    def __init__(self, model: ChatMistralAI, messages: List[BaseMessage]):
        super().__init__()
        self._model = model
        self._messages = messages
        self._response_started = False
        
    async def __anext__(self) -> llm.ChatChunk:
        """Generate next chunk of the response."""
        if not self._response_started:
            self._response_started = True
            
            try:
                # Get response from MistralAI
                response = await self._model.ainvoke(self._messages)
                content = response.content
                
                # Return the complete response as a single chunk
                # Note: For true streaming, you would need to use MistralAI's streaming API
                return llm.ChatChunk(
                    choices=[
                        llm.ChatChunk.Choice(
                            delta=llm.ChatChunk.ChoiceDelta(content=content, role="assistant"),
                            index=0,
                        )
                    ]
                )
                
            except Exception as e:
                logger.error(f"Error generating response: {e}")
                raise StopAsyncIteration
        else:
            # End of stream
            raise StopAsyncIteration


class VoiceAgent(voice_assistant.VoiceAssistant):
    """
    Custom Voice Assistant Agent with specific instructions and behavior.
    """
    
    def __init__(self, **kwargs):
        """Initialize the voice agent with custom instructions."""
        super().__init__(**kwargs)
        
    @property
    def agent_instructions(self) -> str:
        """Return instructions that define the agent's behavior and personality."""
        return """
        You are a helpful and friendly voice assistant. Your role is to:
        
        1. Provide accurate and helpful information on a wide range of topics
        2. Maintain a conversational and engaging tone
        3. Keep responses concise but informative since this is a voice interaction
        4. Be patient and understanding with users
        5. Ask clarifying questions when needed
        6. Admit when you don't know something rather than guessing
        
        Remember that you're communicating through voice, so:
        - Use natural speech patterns
        - Avoid overly long responses
        - Don't use formatting like bullet points or numbered lists
        - Speak in a friendly, conversational manner
        
        You can help with questions, provide explanations, assist with tasks,
        and engage in natural conversation. Always be helpful and respectful.
        """


async def get_video_track(room: rtc.Room) -> Optional[rtc.VideoTrack]:
    """
    Get the first available video track from the room.
    
    Args:
        room: LiveKit room instance
        
    Returns:
        Video track if available, None otherwise
    """
    video_track = None
    
    for participant in room.remote_participants.values():
        for track_pub in participant.track_publications.values():
            if track_pub.track is not None and isinstance(track_pub.track, rtc.VideoTrack):
                video_track = track_pub.track
                break
        if video_track:
            break
            
    return video_track


async def entrypoint(ctx: JobContext):
    """
    Main entrypoint for the voice agent.
    
    This coroutine:
    1. Connects to the LiveKit room
    2. Sets up STT, TTS, and LLM components
    3. Creates and starts the voice assistant
    4. Sends an initial greeting
    5. Runs indefinitely until cancelled
    
    Args:
        ctx: Job context containing room and connection details
    """
    logger.info("Starting voice agent entrypoint")
    
    # Connect to the room
    await ctx.connect(auto_subscribe=AutoSubscriber.AUDIO_ONLY)
    logger.info(f"Connected to room: {ctx.room.name}")
    
    # Initialize ElevenLabs STT
    stt_service = elevenlabs.STT(
        api_key=os.getenv("ELEVENLABS_API_KEY"),
        model_id="eleven_turbo_v2_5",  # Fast, accurate model
    )
    
    # Initialize ElevenLabs TTS
    tts_service = elevenlabs.TTS(
        api_key=os.getenv("ELEVENLABS_API_KEY"),
        voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel voice - clear and professional
        model_id="eleven_turbo_v2_5",
        voice_settings=elevenlabs.VoiceSettings(
            stability=0.7,
            similarity_boost=0.8,
            style=0.5,
            use_speaker_boost=True,
        ),
    )
    
    # Initialize MistralAI LLM with custom adapter
    llm_service = MistralLLMAdapter(
        model_name="mistral-large-latest",
        temperature=0.7,
        max_tokens=800,  # Reasonable limit for voice responses
        system_message="""
        You are a helpful and friendly voice assistant. Keep your responses 
        conversational and concise since this is a voice interaction. 
        Be natural, engaging, and helpful. Avoid overly long responses.
        """,
    )
    
    # Create the voice assistant
    assistant = VoiceAssistant(
        vad=agents.silero.VAD.load(),  # Voice Activity Detection
        stt=stt_service,
        llm=llm_service,
        tts=tts_service,
        chat_ctx=llm.ChatContext(),
        fnc_ctx=None,  # No function calling in this implementation
    )
    
    # Start the assistant
    assistant.start(ctx.room)
    logger.info("Voice assistant started")
    
    # Send initial greeting
    await assistant.say(
        "Hello! I'm your voice assistant. I'm here to help you with questions, "
        "provide information, or just have a conversation. How can I assist you today?",
        allow_interruptions=True,
    )
    
    # Keep the agent running indefinitely
    try:
        while True:
            await asyncio.sleep(1)
            
    except asyncio.CancelledError:
        logger.info("Agent session cancelled")
    except Exception as e:
        logger.error(f"Error in agent session: {e}")
        raise
    finally:
        # Cleanup
        await assistant.aclose()
        logger.info("Voice assistant closed")


def main():
    """
    Main entry point for the application.
    Validates environment variables and starts the agent.
    """
    # Validate required environment variables
    required_vars = [
        "LIVEKIT_WS_URL",
        "LIVEKIT_API_KEY", 
        "LIVEKIT_API_SECRET",
        "ELEVENLABS_API_KEY",
        "MISTRAL_API_KEY",
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        logger.error("Please set these variables in your .env file or environment")
        return
    
    logger.info("Starting LiveKit Voice AI Agent")
    logger.info(f"Connecting to: {os.getenv('LIVEKIT_WS_URL')}")
    
    # Run the agent
    cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            prewarm_fnc=None,  # No prewarming needed
        )
    )


if __name__ == "__main__":
    main()