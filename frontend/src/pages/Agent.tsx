import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Room,
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
  // REWRITE: Replaced deprecated hooks and components with modern alternatives
  useChat,
  useLocalParticipant,
  useConnectionState,
  useParticipants,
  useTracks,
  ParticipantTile,
  MicToggle,
  AudioDeviceMenu,
  BarVisualizer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { api } from "@/services/api";
import { useGame } from "@/context/GameContext";

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
 * REWRITE: Voice Assistant Component - Updated for modern LiveKit agent hooks
 */
const VoiceAssistantInterface: React.FC = () => {
  // REWRITE: Replaced `useVoiceAssistant` with the modern `useChat` hook
  const { isThinking, isSpeaking, agentAudioTrack } = useChat();
  const { isMicrophoneEnabled } = useLocalParticipant();
  const participants = useParticipants();
  const connectionState = useConnectionState();

  // Get local participant's microphone track for visualization
  const localParticipant = useLocalParticipant().localParticipant;
  const localTracks = useTracks(
    [{ source: Track.Source.Microphone, participant: localParticipant }],
    { onlySubscribed: true }
  );
  const localAudioTrack = localTracks[0]?.track;

  // Find the agent and avatar participants
  const agentParticipant = participants.find(
    (p) => p.kind === ParticipantKind.AGENT
  );
  const avatarParticipant = participants.find(
    (p) => p.identity === "CHAT-Avatar"
  );
  const avatarTracks = useTracks(
    [{ source: Track.Source.Camera, participant: avatarParticipant }],
    { onlySubscribed: true }
  );

  // REWRITE: Derived UI state from new hooks to maintain original layout and text
  const [uiState, setUiState] = useState("idle");

  useEffect(() => {
    if (isThinking) {
      setUiState("thinking");
    } else if (isSpeaking) {
      setUiState("speaking");
    } else if (isMicrophoneEnabled) {
      setUiState("listening");
    } else {
      setUiState("idle");
    }
  }, [isThinking, isSpeaking, isMicrophoneEnabled]);

  const getStateDisplay = (state: string) => {
    switch (state) {
      case "idle":
        return "Ready to chat!";
      case "listening":
        return "I'm listening! 👂";
      case "thinking":
        return "Let me think... 🤔";
      case "speaking":
        return "Speaking 🗣️";
      default:
        return "Getting ready...";
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
      case "idle":
        return "text-purple-600";
      default:
        return "text-gray-600";
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
            <div className="w-64 h-64 rounded-full overflow-hidden shadow-2xl bg-white">
              <ParticipantTile
                participant={avatarParticipant}
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
            <h2 className={`text-2xl font-bold ${getStateColor(uiState)}`}>
              {getStateDisplay(uiState)}
            </h2>
            <p className="text-sm text-gray-600 max-w-md">
              {uiState === "listening" &&
                "Say something! I'm here to help you practice speaking."}
              {uiState === "thinking" && "I'm processing what you said..."}
              {uiState === "speaking" && "Listen carefully to my response!"}
              {uiState === "idle" &&
                "Your AI speech therapist is ready to help you!"}
            </p>
          </div>

          <div className="w-80 h-24 flex items-center justify-center">
            {/* REWRITE: BarVisualizer now visualizes the agent's or user's track */}
            <BarVisualizer
              trackRef={isSpeaking ? agentAudioTrack : localAudioTrack}
              className="w-full h-full"
              style={{
                "--lk-bar-color":
                  uiState === "speaking" ? "#3b82f6" : "#8b5cf6",
                "--lk-bar-color-active":
                  uiState === "speaking" ? "#1d4ed8" : "#7c3aed",
              }}
            />
          </div>

          <div className="text-sm text-gray-500">
            {participants.length > 1 ? (
              <span>✅ Connected with your AI assistant</span>
            ) : (
              <span>⏳ Waiting for AI assistant...</span>
            )}
          </div>
        </div>

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

      {/* REWRITE: Replaced `VoiceAssistantControlBar` with modern, equivalent controls */}
      <div className="p-4 bg-white/80 backdrop-blur-sm flex justify-center items-center space-x-4">
        <MicToggle />
        <div className="w-40">
          <AudioDeviceMenu />
        </div>
      </div>
    </div>
  );
};

/**
 * Connection Error Component (Unchanged)
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
 * Loading Component (Unchanged)
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
 * Token fetching function (Unchanged)
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

    if (data.error) {
      throw new Error(data.error);
    }
    if (!data.token) {
      throw new Error("No token received from server");
    }
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
 * Main Agent Component (Unchanged)
 */
export const Agent: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, startSession } = useGame();

  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const wsUrl =
    import.meta.env.NEXT_PUBLIC_LIVEKIT_WS_URL ||
    "wss://saz-game-ur3zm2qf.livekit.cloud";

  const handleBackClick = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const handleRetry = useCallback(() => {
    console.log("Retrying connection...");
    setError("");
    setToken("");
    setIsInitialized(false);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (gameState.selectedChild && !gameState.livekitRoom && !isInitialized) {
      console.log(
        "Triggering session start for child:",
        gameState.selectedChild.id
      );
      startSession(gameState.selectedChild.id);
    }
  }, [
    gameState.selectedChild,
    gameState.livekitRoom,
    isInitialized,
    startSession,
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchToken = async () => {
      if (gameState.livekitRoom && gameState.selectedChild && !token) {
        console.log(
          "Room is ready, fetching token for:",
          gameState.livekitRoom
        );
        setIsLoading(true);
        setError("");
        try {
          const fetchedToken = await fetchLiveKitToken(
            gameState.livekitRoom,
            gameState.selectedChild.id
          );
          if (isMounted) {
            setToken(fetchedToken);
            setIsInitialized(true);
          }
        } catch (err) {
          if (isMounted) {
            setError(
              err instanceof Error ? err.message : "Failed to fetch token"
            );
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };
    fetchToken();
    return () => {
      isMounted = false;
    };
  }, [gameState.livekitRoom, gameState.selectedChild, token]);

  useEffect(() => {
    const handleChildChange = () => {
      setIsInitialized(false);
      setToken("");
      setError("");
      setIsLoading(true);
    };

    if (
      isInitialized &&
      token &&
      gameState.selectedChild?.id !== Room.parseJWTPayload(token).sub
    ) {
      console.log("Child context has changed. Resetting session.");
      handleChildChange();
    }
  }, [gameState.selectedChild?.id, token, isInitialized]);

  useEffect(() => {
    if (!wsUrl) {
      setError(
        "LiveKit WebSocket URL not configured. Please set NEXT_PUBLIC_LIVEKIT_WS_URL."
      );
      setIsLoading(false);
    } else if (!wsUrl.startsWith("wss://") && !wsUrl.startsWith("ws://")) {
      setError("Invalid WebSocket URL format. Must start with wss:// or ws://");
      setIsLoading(false);
    }
  }, [wsUrl]);

  if (!gameState.selectedChild) {
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

  if (error) {
    return (
      <ConnectionError
        error={error}
        onRetry={handleRetry}
        onBack={handleBackClick}
      />
    );
  }

  if (isLoading || !token) {
    return <LoadingScreen onBack={handleBackClick} />;
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-14 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBackClick}
          className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      <LiveKitRoom
        video={true}
        audio={true}
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
        <RoomAudioRenderer />
        <VoiceAssistantInterface />
      </LiveKitRoom>
    </div>
  );
};
