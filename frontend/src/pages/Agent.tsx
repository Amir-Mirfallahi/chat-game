import React, { useState, useEffect, useCallback, useRef } from "react";
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
} from "@livekit/components-react";
import "@livekit/components-styles";
import { api } from "@/services/api";
import { useGame } from "@/context/GameContext";

interface TokenResponse {
  token: string;
  source?: string;
  error?: string;
}

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
    stopMicTrackOnMute: true,
  },
  disconnectOnPageLeave: true,
};

const checkMediaDevices = async (): Promise<{
  audio: boolean;
  video: boolean;
  error?: string;
}> => {
  try {
    // Check if we're in a browser environment
    if (typeof navigator === "undefined") {
      return {
        audio: false,
        video: false,
        error: "Not running in a browser environment",
      };
    }

    if (!navigator.mediaDevices) {
      return {
        audio: false,
        video: false,
        error: "Media devices API not supported in this browser",
      };
    }

    if (location.protocol !== "https:" && location.hostname !== "localhost") {
      return {
        audio: false,
        video: false,
        error: "Media access requires HTTPS or localhost",
      };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      stream.getTracks().forEach((track) => track.stop());
      return { audio: true, video: true };
    } catch (permissionError) {
      console.warn("Media permission denied:", permissionError);
      return {
        audio: false,
        video: false,
        error:
          "Microphone access is required for this feature. Please allow microphone permissions and refresh.",
      };
    }
  } catch (error) {
    console.error("Media device check failed:", error);
    return {
      audio: false,
      video: false,
      error: "Failed to check media device availability",
    };
  }
};

const VoiceAssistantInterface: React.FC = () => {
  // Existing VoiceAssistantInterface implementation remains the same
  const { state, audioTrack } = useVoiceAssistant();
  const participants = useParticipants();
  const connectionState = useConnectionState();
  const room = useRoomContext();

  const agentParticipant = participants.find(
    (p) => p.kind === ParticipantKind.AGENT
  );

  const avatarParticipant = participants.find(
    (p) =>
      p.identity.toLowerCase().includes("avatar") ||
      p.identity.toLowerCase().includes("chat-avatar") ||
      p.kind === ParticipantKind.AGENT
  );

  const avatarTracks = useTracks(
    [
      {
        source: Track.Source.Camera,
        participant: avatarParticipant,
      },
    ],
    { onlySubscribed: false }
  );

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
      case "idle":
        return "Ready to chat!";
      default:
        return "Voice Assistant Ready";
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
      case "idle":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  console.log("VoiceAssistant state:", {
    state,
    hasAudioTrack: !!audioTrack,
    participantCount: participants.length,
    agentPresent: !!agentParticipant,
    avatarPresent: !!avatarParticipant,
    avatarTracksCount: avatarTracks.length,
    connectionState,
  });

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              connectionState === ConnectionState.Connected
                ? "bg-green-500"
                : connectionState === ConnectionState.Connecting
                ? "bg-yellow-500 animate-pulse"
                : "bg-red-500"
            }`}
          />
          <span className="text-sm font-medium text-black">
            {connectionState === ConnectionState.Connected
              ? "Connected"
              : connectionState === ConnectionState.Connecting
              ? "Connecting..."
              : "Disconnected"}
          </span>
        </div>
        {agentParticipant && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-sm text-blue-600">AI Assistant Active</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        {avatarParticipant && avatarTracks.length > 0 && (
          <div className="relative">
            <div className="w-64 h-64 rounded-full overflow-hidden shadow-2xl bg-white border-4 border-blue-200">
              <ParticipantTile
                participant={avatarParticipant}
                className="w-full h-full"
                displayName={false}
                disableSpeakingIndicator={false}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              AI Avatar
            </div>
          </div>
        )}

        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className={`text-3xl font-bold ${getStateColor(state)}`}>
              {getStateDisplay(state)}
            </h2>
            <p className="text-base text-gray-600 max-w-lg mx-auto">
              {state === "listening" &&
                "Say something! I'm here to help you practice speaking."}
              {state === "thinking" && "I'm processing what you said..."}
              {state === "speaking" && "Listen carefully to my response!"}
              {state === "initializing" &&
                "Setting up your speech practice session..."}
              {(state === "idle" ||
                !["listening", "thinking", "speaking", "initializing"].includes(
                  state
                )) &&
                "Your AI speech therapist is ready to help you!"}
            </p>
          </div>

          <div className="w-96 h-24 flex items-center justify-center bg-white/40 rounded-xl backdrop-blur-sm p-4">
            <BarVisualizer
              state={state}
              barCount={16}
              trackRef={audioTrack}
              className="w-full h-full"
              style={{
                "--lk-va-bar-width": "4px",
                "--lk-va-bar-gap": "2px",
                "--lk-va-bar-color":
                  state === "speaking" ? "#3b82f6" : "#8b5cf6",
                "--lk-va-bar-color-active":
                  state === "speaking" ? "#1d4ed8" : "#7c3aed",
                "--lk-va-bar-height": "100%",
              }}
            />
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-500">
              {participants.length > 1 ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Connected with your AI assistant</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Waiting for AI assistant to join...</span>
                </span>
              )}
            </div>

            {process.env.NODE_ENV === "development" && (
              <div className="text-xs text-gray-400 bg-gray-100 rounded p-2 max-w-md">
                <div>State: {state}</div>
                <div>Participants: {participants.length}</div>
                <div>Audio Track: {audioTrack ? "Yes" : "No"}</div>
                <div>Agent: {agentParticipant ? "Connected" : "Not found"}</div>
                <div>Avatar: {avatarParticipant ? "Found" : "Not found"}</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 max-w-lg text-center shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-3 text-lg">
            💡 Tips for Parents
          </h3>
          <div className="text-sm text-gray-600 space-y-2 text-left">
            <p>
              • <strong>Speak clearly</strong> and at a comfortable pace
            </p>
            <p>
              • <strong>Wait for responses</strong> - the AI needs time to
              process
            </p>
            <p>
              • <strong>Celebrate attempts</strong> - every effort counts!
            </p>
            <p>
              • <strong>Keep sessions short</strong> - 5-10 minutes work best
            </p>
            <p>
              • <strong>Be patient</strong> - learning takes time
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <VoiceAssistantControlBar
          controls={{
            leave: false,
            microphone: true,
          }}
        />
      </div>
    </div>
  );
};

const ConnectionError: React.FC<{
  error: string;
  onRetry: () => void;
  onBack: () => void;
}> = ({ error, onRetry, onBack }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
    <div className="max-w-md w-full">
      <Card className="border-red-200 shadow-lg">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex items-center justify-center">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Connection Error</h2>
          <p className="text-gray-600 leading-relaxed">{error}</p>
          <div className="space-y-3">
            <Button
              onClick={onRetry}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
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

const LoadingScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 relative">
    <Button
      variant="outline"
      size="icon"
      onClick={onBack}
      className="absolute top-6 left-6 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
    <div className="text-center space-y-8">
      <div className="flex items-center justify-center">
        <div className="relative">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full"></div>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          Starting Your Speech Session
        </h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          Connecting you with CHAT, your AI speech therapist...
        </p>
        <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
          <span>Initializing voice recognition...</span>
        </div>
      </div>
    </div>
  </div>
);

const fetchLiveKitToken = async (
  room: string,
  identity: string
): Promise<string> => {
  console.log("Fetching LiveKit token:", { room, identity });
  try {
    const response = await api.get(
      `/livekit-token/?room=${encodeURIComponent(
        room
      )}&identity=${encodeURIComponent(identity)}`
    );
    const data: TokenResponse = response.data;
    console.log("Token response:", {
      hasToken: !!data.token,
      hasError: !!data.error,
      source: data.source,
    });
    if (data.error) {
      throw new Error(`Token error: ${data.error}`);
    }
    if (!data.token) {
      throw new Error("No token received from server");
    }
    const tokenParts = data.token.split(".");
    if (tokenParts.length !== 3) {
      throw new Error("Invalid JWT token format received");
    }
    return data.token;
  } catch (err) {
    console.error("Token fetch failed:", err);
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("Failed to fetch authentication token");
  }
};

export const Agent: React.FC = () => {
  const navigate = useNavigate();
  const { gameState, startSession } = useGame();

  // State declarations
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [mediaCheckPassed, setMediaCheckPassed] = useState<boolean>(false);
  const [mediaError, setMediaError] = useState<string>("");
  const initializationAttempted = useRef<boolean>(false);
  const currentChildId = useRef<string | null>(null);

  const wsUrl =
    import.meta.env.NEXT_PUBLIC_LIVEKIT_WS_URL ||
    import.meta.env.VITE_LIVEKIT_WS_URL ||
    "wss://saz-game-ur3zm2qf.livekit.cloud";

  // Media device check effect
  useEffect(() => {
    let isMounted = true;

    const performMediaCheck = async () => {
      try {
        if (typeof navigator === "undefined") {
          if (isMounted) {
            setMediaError("Not running in a browser environment");
            setMediaCheckPassed(false);
          }
          return;
        }

        const mediaResult = await checkMediaDevices();
        if (isMounted) {
          if (mediaResult.error) {
            setMediaError(mediaResult.error);
            setMediaCheckPassed(false);
          } else if (mediaResult.audio) {
            setMediaCheckPassed(true);
            setMediaError("");
          } else {
            setMediaError("Audio access is required for voice interaction");
            setMediaCheckPassed(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Media check failed:", err);
          setMediaError("Failed to check media devices");
          setMediaCheckPassed(false);
        }
      }
    };

    performMediaCheck();

    return () => {
      isMounted = false;
    };
  }, []);

  // Environment validation
  useEffect(() => {
    if (!wsUrl) {
      setError(
        "LiveKit WebSocket URL not configured. Please check your environment variables."
      );
      setIsLoading(false);
    } else if (!wsUrl.startsWith("wss://") && !wsUrl.startsWith("ws://")) {
      setError("Invalid WebSocket URL format. Must start with wss:// or ws://");
      setIsLoading(false);
    }
  }, [wsUrl]);

  // Session initialization
  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeSession = async () => {
      if (initializationAttempted.current) return;

      if (!gameState.selectedChild) {
        setIsLoading(false);
        return;
      }

      if (!mediaCheckPassed) {
        setIsLoading(false);
        return;
      }

      if (mediaError) {
        setError(mediaError);
        setIsLoading(false);
        return;
      }

      if (!wsUrl || error) {
        setIsLoading(false);
        return;
      }

      if (currentChildId.current !== gameState.selectedChild.id) {
        initializationAttempted.current = false;
        currentChildId.current = gameState.selectedChild.id;
        setIsInitialized(false);
        setToken("");
        setError("");
      }

      if (initializationAttempted.current || isInitialized) return;

      initializationAttempted.current = true;

      try {
        console.log(
          "Initializing session for child:",
          gameState.selectedChild.id
        );
        setIsLoading(true);
        setError("");

        await startSession(gameState.selectedChild.id);

        timeoutId = setTimeout(async () => {
          if (!isMounted) return;

          try {
            const roomName =
              gameState.livekitRoom ||
              `voice-session-${gameState.selectedChild!.id}-${Date.now()}`;
            console.log("Fetching token for room:", roomName);

            const fetchedToken = await fetchLiveKitToken(
              roomName,
              gameState.selectedChild!.id
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
                err instanceof Error
                  ? err.message
                  : "Failed to fetch authentication token"
              );
              setIsLoading(false);
              initializationAttempted.current = false;
            }
          }
        }, 1000);
      } catch (err) {
        console.error("Session initialization error:", err);
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to initialize session"
          );
          setIsLoading(false);
          initializationAttempted.current = false;
        }
      }
    };

    initializeSession();

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    gameState.selectedChild?.id,
    mediaCheckPassed,
    mediaError,
    wsUrl,
    error,
    gameState.livekitRoom,
    startSession,
    isInitialized,
  ]);

  const handleBackClick = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const handleRetry = useCallback(() => {
    console.log("Retrying connection...");
    setError("");
    setMediaError("");
    setIsInitialized(false);
    setToken("");
    setIsLoading(true);
    initializationAttempted.current = false;
  }, []);

  // Conditional rendering
  if (!gameState.selectedChild) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-6">
          <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-800">
            No Child Selected
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Please select a child from the dashboard to start a speech therapy
            session.
          </p>
          <Button onClick={handleBackClick} size="lg" className="mt-6">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (mediaError && !mediaCheckPassed) {
    return (
      <ConnectionError
        error={mediaError}
        onRetry={handleRetry}
        onBack={handleBackClick}
      />
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
      <div className="absolute top-6 left-6 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBackClick}
          className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {token && wsUrl && (
        <LiveKitRoom
          video={false}
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
            console.error("LiveKit Room error:", error);
            setError(
              error.message || "An error occurred with the voice connection"
            );
          }}
          onConnected={() => {
            console.log("Successfully connected to LiveKit room");
          }}
        >
          <RoomAudioRenderer />
          <VoiceAssistantInterface />
        </LiveKitRoom>
      )}
    </div>
  );
};
