import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  ConnectionState,
  DisconnectReason,
  RoomOptions,
  VideoPresets,
  ParticipantKind,
  Track,
} from "livekit-client";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useVoiceAssistant,
  BarVisualizer,
  VoiceAssistantControlBar,
  useRoomContext,
  useParticipants,
  ParticipantTile,
  useConnectionState,
  useTracks,
  TrackRefContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { api } from "@/services/api";
import { useGame } from "@/context/GameContext";
import useChildStore from "@/stores/child";

// Interface for token response from backend
interface TokenResponse {
  token: string;
  source?: string;
  error?: string;
}

// LiveKit room configuration optimized for voice agents
const roomOptions: RoomOptions = {
  adaptiveStream: true,
  dynacast: true,
  videoCaptureDefaults: {
    resolution: VideoPresets.h360.resolution,
  },
  publishDefaults: {
    videoSimulcastLayers: [VideoPresets.h180, VideoPresets.h360],
    audioPreset: {
      maxBitrate: 48_000,
    },
  },
  disconnectOnPageLeave: true,
};

/**
 * Voice Assistant Component - The main UI for interacting with the speech therapy agent
 */
const VoiceAssistantInterface: React.FC = () => {
  const { state, audioTrack } = useVoiceAssistant();
  const participants = useParticipants();
  const connectionState = useConnectionState();
  const room = useRoomContext();

  // Find the agent participant
  const agentParticipant = participants.find(
    (p) => p.kind === ParticipantKind.AGENT
  );

  const avatarParticipant = participants.find(
    (p) => p.identity.includes("avatar") || p.identity.includes("CHAT-Avatar")
  );

  const cameraTracks = useTracks([Track.Source.Camera], {
    onlySubscribed: true,
  });

  // Get avatar video track if available
  const avatarTracks = cameraTracks.filter((track) => {
    // Assuming that each track has a participant property
    return track.participant?.identity === avatarParticipant?.identity;
  });

  const getStateDisplay = (state: string) => {
    switch (state) {
      case "initializing":
        return "Getting ready...";
      case "listening":
        return "I'm listening! 👂";
      case "thinking":
        return "Let me think... 🤔";
      case "speaking":
        return "Speaking 🗣️";
      default:
        return "Ready to chat!";
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "listening":
        return "text-green-600";
      case "thinking":
        return "text-yellow-600";
      case "speaking":
        return "text-blue-600";
      case "initializing":
        return "text-gray-600";
      default:
        return "text-purple-600";
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Connection Status */}
      <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              connectionState === ConnectionState.Connected
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />
          <span className="text-sm font-medium text-black">
            {connectionState === ConnectionState.Connected
              ? "Connected"
              : "Connecting..."}
          </span>
        </div>

        {agentParticipant && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-blue-600">CHAT Assistant Active</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {/* Avatar Video (if available) */}
        {avatarParticipant && avatarTracks.length > 0 && (
          <div className="relative">
            <div className="w-auto h-auto rounded-lg overflow-hidden shadow-2xl bg-white">
              <ParticipantTile
                trackRef={avatarTracks[0]}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              AI Avatar
            </div>
          </div>
        )}

        {/* Voice Assistant Status and Visualizer */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className={`text-2xl font-bold ${getStateColor(state)}`}>
              {getStateDisplay(state)}
            </h2>
            <p className="text-sm text-gray-600 max-w-md">
              {state === "listening" &&
                "Say something! I'm here to help you practice speaking."}
              {state === "thinking" && "I'm processing what you said..."}
              {state === "speaking" && "Listen carefully to my response!"}
              {state === "initializing" &&
                "Setting up your speech practice session..."}
              {!["listening", "thinking", "speaking", "initializing"].includes(
                state
              ) && "Your AI speech therapist is ready to help you!"}
            </p>
          </div>

          {/* Audio Visualizer - FIXED */}
          <div className="w-80 h-24 flex items-center justify-center">
            {audioTrack ? (
              <BarVisualizer
                state={state}
                trackRef={audioTrack}
                barCount={12}
                className="w-full h-full"
                style={
                  {
                    "--lk-bar-color":
                      state === "speaking" ? "#3b82f6" : "#8b5cf6",
                    "--lk-bar-color-active":
                      state === "speaking" ? "#1d4ed8" : "#7c3aed",
                  } as React.CSSProperties
                }
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 bg-gray-300 rounded-full animate-pulse"
                      style={{
                        height: Math.random() * 40 + 20,
                        animationDelay: `${i * 100}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Participant Count */}
          <div className="text-sm text-gray-500">
            {participants.length > 1 ? (
              <span>✅ Connected with your AI assistant</span>
            ) : (
              <span>⏳ Waiting for AI assistant...</span>
            )}
          </div>
        </div>

        {/* Tips for Child Interaction */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 max-w-md text-center">
          <h3 className="font-semibold text-gray-800 mb-2">
            💡 Tips for Parents
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Encourage your child to speak clearly</p>
            <p>• Wait for the assistant to finish before responding</p>
            <p>• Celebrate any attempts at communication!</p>
            <p>• Keep sessions short and fun</p>
          </div>
        </div>
      </div>

      {/* Voice Assistant Control Bar */}
      <div className="p-4 bg-white/80 backdrop-blur-sm">
        <VoiceAssistantControlBar
          controls={{
            leave: false, // We'll handle this with our custom back button
          }}
        />
      </div>
    </div>
  );
};

/**
 * Connection Error Component
 */
const ConnectionError: React.FC<{
  error: string;
  onRetry: () => void;
  onBack: () => void;
}> = ({ error, onRetry, onBack }) => (
  <div className="min-h-screen flex items-center justify-center bg-background p-4">
    <div className="max-w-md w-full">
      <Card className="border-destructive/50">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Connection Error
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="space-y-2">
            <Button onClick={onRetry} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" onClick={onBack} className="w-full">
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

/**
 * Loading Component
 */
const LoadingScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
    <div className="text-center space-y-6">
      <Button
        variant="outline"
        size="icon"
        onClick={onBack}
        className="absolute top-4 left-4 rounded-full"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div className="flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">
          Starting Your Speech Session
        </h2>
        <p className="text-lg text-muted-foreground max-w-md">
          Connecting you with CHAT, your AI speech therapist...
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
          <span>Initializing avatar and voice recognition...</span>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Token fetching function with improved error handling and validation
 */
const fetchLiveKitToken = async (
  room: string,
  identity: string
): Promise<string> => {
  console.log("Fetching token for:", { room, identity });

  try {
    const response = await api.get(
      `/livekit-token/?room=${room}&identity=${identity}`
    );
    const data: TokenResponse = response.data;

    console.log("Token response received:", {
      hasToken: !!data.token,
      hasError: !!data.error,
    });

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.token) {
      throw new Error("No token received from server");
    }

    // Validate token format (JWT should have 3 parts)
    const tokenParts = data.token.split(".");
    if (tokenParts.length !== 3) {
      throw new Error("Invalid token format received");
    }

    return data.token;
  } catch (err) {
    console.error("Token fetch failed:", err);
    throw err;
  }
};

/**
 * Main Agent Component - FIXED VERSION
 */
export const Agent: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, startSession } = useGame();

  // State management
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const selectedChild = useChildStore((state) => state.selectedChild);

  // LiveKit WebSocket URL from environment variables
  const wsUrl =
    import.meta.env.VITE_LIVEKIT_WS_URL ||
    import.meta.env.NEXT_PUBLIC_LIVEKIT_WS_URL ||
    "wss://saz-game-ur3zm2qf.livekit.cloud";

  console.log("Agent component render:", {
    isLoading,
    hasToken: !!token,
    error,
    selectedChild: selectedChild?.id,
    livekitRoom: gameState.livekitRoom ?? selectedChild?.id,
    isInitialized,
  });

  // Early validation - prevent render if no child selected
  if (!selectedChild) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">
            No Child Selected
          </h2>
          <p className="text-gray-600">
            Please select a child from the dashboard first.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // FIXED: Single initialization effect with proper cleanup
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeSession = async () => {
      if (isInitialized) {
        console.log("Session already initialized, skipping");
        return;
      }

      try {
        console.log("Starting session initialization...");
        setIsLoading(true);
        setError("");

        // Validate selected child
        if (!selectedChild) {
          throw new Error("No child selected for the session");
        }

        console.log("Starting session for child:", selectedChild.id);

        const livekitRoom = await startSession(selectedChild.id);

        // Wait a moment for context to update then fetch token
        timeoutId = setTimeout(async () => {
          if (!isMounted) return;

          try {
            const fetchedToken = await fetchLiveKitToken(
              livekitRoom,
              selectedChild!.id
            );

            if (isMounted) {
              setToken(fetchedToken);
              setIsInitialized(true);
              setIsLoading(false);
              console.log("Session initialized successfully");
            }
          } catch (err) {
            console.error("Token fetch error:", err);
            if (isMounted) {
              setError(
                err instanceof Error ? err.message : "Failed to fetch token"
              );
              setIsLoading(false);
            }
          }
        }, 500);
      } catch (err) {
        console.error("Session initialization error:", err);
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to initialize session"
          );
          setIsLoading(false);
        }
      }
    };

    initializeSession();

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Remove dependencies to prevent re-initialization

  // Reset state when child changes
  useEffect(() => {
    if (selectedChild && isInitialized) {
      console.log("Child changed, resetting state");
      setIsInitialized(false);
      setToken("");
      setError("");
      setIsLoading(true);
    }
  }, [selectedChild?.id]);

  // Validate environment variables
  useEffect(() => {
    if (!wsUrl) {
      setError(
        "LiveKit WebSocket URL not configured. Please set VITE_LIVEKIT_WS_URL or NEXT_PUBLIC_LIVEKIT_WS_URL."
      );
      setIsLoading(false);
    } else if (!wsUrl.startsWith("wss://") && !wsUrl.startsWith("ws://")) {
      setError("Invalid WebSocket URL format. Must start with wss:// or ws://");
      setIsLoading(false);
    }
  }, [wsUrl]);

  // Navigation handlers
  const handleBackClick = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const handleRetry = useCallback(() => {
    console.log("Retrying connection...");
    setError("");
    setIsInitialized(false);
    setToken("");
    setIsLoading(true);
  }, []);

  // Error state
  if (error) {
    return (
      <ConnectionError
        error={error}
        onRetry={handleRetry}
        onBack={handleBackClick}
      />
    );
  }

  // Loading state
  if (isLoading || !token) {
    return <LoadingScreen onBack={handleBackClick} />;
  }

  // Main LiveKit room with voice assistant
  return (
    <div className="min-h-screen bg-background relative">
      {/* Back button */}
      <div className="absolute top-8 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBackClick}
          className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* LiveKit Room Component */}
      <LiveKitRoom
        audio={true}
        video={true} // Enable video for avatar support
        token={token}
        serverUrl={wsUrl}
        data-lk-theme="default"
        style={{ height: "100vh" }}
        options={roomOptions}
        onDisconnected={(reason) => {
          console.log("Disconnected from room:", reason);
          if (reason !== DisconnectReason.CLIENT_INITIATED) {
            setError("Connection lost. Please try reconnecting.");
          }
        }}
        onError={(error) => {
          console.error("Room error:", error);
          setError(error.message || "An error occurred");
        }}
      >
        {/* Audio renderer for all participants */}
        <RoomAudioRenderer />

        {/* Voice Assistant Interface */}
        <VoiceAssistantInterface />
      </LiveKitRoom>
    </div>
  );
};
