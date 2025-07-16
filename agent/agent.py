#!/usr/bin/env python3
"""
LiveKit Voice AI Agent with ElevenLabs and MistralAI via LangChain

This agent implements a voice AI assistant using:
- ElevenLabs for Speech-to-Text (STT) and Text-to-Speech (TTS)
- MistralAI via LangChain for language model processing
- LiveKit LangChain plugin for proper integration
- LiveKit for real-time voice communication

Setup Instructions:
1. Install required packages:
   pip install livekit-agents livekit-plugins-elevenlabs livekit-plugins-langchain langchain-mistralai python-dotenv

2. Set environment variables in .env file:
   LIVEKIT_URL=wss://your-livekit-server.com
   LIVEKIT_API_KEY=your_api_key
   LIVEKIT_API_SECRET=your_api_secret
   ELEVENLABS_API_KEY=your_elevenlabs_api_key
   MISTRAL_API_KEY=your_mistral_api_key

3. Run the agent:
   python agent.py dev
"""

import logging
import os
from typing import Annotated
from dotenv import load_dotenv

# LiveKit imports
from livekit import agents
from livekit.agents import AgentSession, Agent
from livekit.plugins import elevenlabs, langchain

# LangChain imports
from langchain_mistralai import ChatMistralAI
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langgraph.graph import StateGraph, MessagesState
from langgraph.graph.message import add_messages

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Define the state for our workflow
class AgentState(MessagesState):
    """State for the voice agent workflow."""
    pass


def create_mistral_workflow():
    """
    Create a LangGraph workflow that uses MistralAI for responses.

    Returns:
        Compiled LangGraph workflow
    """

    # Initialize MistralAI model
    llm = ChatMistralAI(
        model="mistral-large-latest",
        temperature=0.7,
        max_tokens=800,
        mistral_api_key=os.getenv("MISTRAL_API_KEY"),
    )

    # System message for the voice assistant
    system_message = SystemMessage(
        content="""
        You are a helpful and friendly voice assistant. Your role is to:

        1. Provide accurate and helpful information on a wide range of topics
        2. Maintain a conversational and engaging tone
        3. Keep responses concise but informative since this is a voice interaction
        4. Be patient and understanding with users
        5. Ask clarifying questions when needed
        6. Admit when you don't know something rather than guessing

        Remember that you're communicating through voice, so:
        - Use natural speech patterns
        - Avoid overly long responses (aim for 1-3 sentences unless more detail is specifically requested)
        - Don't use formatting like bullet points or numbered lists
        - Speak in a friendly, conversational manner
        - Use contractions and natural language

        You can help with questions, provide explanations, assist with tasks,
        and engage in natural conversation. Always be helpful and respectful.
        """
    )

    def call_model(state: AgentState):
        """
        Call the MistralAI model with the current conversation state.

        Args:
            state: Current conversation state containing messages

        Returns:
            Dictionary with the model's response
        """
        # Prepare messages with system message at the beginning
        messages = [system_message] + state["messages"]

        # Get response from MistralAI
        response = llm.invoke(messages)

        # Return the response to be added to the state
        return {"messages": [response]}

    # Create the workflow graph
    workflow = StateGraph(AgentState)

    # Add the model node
    workflow.add_node("model", call_model)

    # Set the entry point
    workflow.set_entry_point("model")

    # Set the finish point
    workflow.set_finish_point("model")

    # Compile the workflow
    return workflow.compile()


class VoiceAssistant(Agent):
    """
    Custom Voice Assistant Agent with MistralAI integration via LangChain.
    """

    def __init__(self) -> None:
        """Initialize the voice agent with custom instructions."""
        super().__init__(
            instructions="""
            You are a helpful and friendly voice assistant powered by MistralAI. 
            Provide conversational, concise responses optimized for voice interaction.
            """
        )


async def entrypoint(ctx: agents.JobContext):
    """
    Main entrypoint for the voice agent using LangChain integration.

    Args:
        ctx: Job context containing room and connection details
    """
    logger.info("Starting voice agent with MistralAI via LangChain")

    # Create the MistralAI workflow
    workflow = create_mistral_workflow()

    # Create the agent session with LangChain adapter
    session = AgentSession(
        stt=elevenlabs.STT(
            api_key=os.getenv("ELEVENLABS_API_KEY"),
            model_id="eleven_turbo_v2_5",
        ),
        llm=langchain.LLMAdapter(
            graph=workflow,
            config=RunnableConfig(
                # You can add configuration options here if needed
                # For example: recursion_limit=10, max_execution_time=30
            )
        ),
        tts=elevenlabs.TTS(
            api_key=os.getenv("ELEVENLABS_API_KEY"),
            voice_id="21m00Tcm4TlvDq8ikWAM",  # Rachel voice - clear and professional
            model_id="eleven_turbo_v2_5",
            voice_settings=elevenlabs.VoiceSettings(
                stability=0.7,
                similarity_boost=0.8,
                style=0.5,
                use_speaker_boost=True,
            ),
        ),
    )

    # Start the session
    await session.start(
        room=ctx.room,
        agent=VoiceAssistant(),
    )

    # Connect to the room
    await ctx.connect()

    logger.info(f"Connected to room: {ctx.room.name}")

    # Send initial greeting
    await session.generate_reply(
        instructions="""
        Greet the user warmly and introduce yourself as their voice assistant powered by MistralAI. 
        Let them know you're here to help with questions, provide information, or have a conversation. 
        Keep it friendly and conversational.
        """
    )

    logger.info("Voice assistant started and greeting sent")


def main():
    """
    Main entry point for the application.
    Validates environment variables and starts the agent.
    """
    # Validate required environment variables
    required_vars = [
        "LIVEKIT_URL",
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

    logger.info("Starting LiveKit Voice AI Agent with MistralAI via LangChain")
    logger.info(f"Connecting to: {os.getenv('LIVEKIT_URL')}")

    # Run the agent
    agents.cli.run_app(
        agents.WorkerOptions(entrypoint_fnc=entrypoint)
    )


if __name__ == "__main__":
    main()