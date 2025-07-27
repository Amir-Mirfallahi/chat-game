import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import {
  Room,
  RoomEvent,
  ConnectionState,
  DisconnectReason,
  RoomOptions,
  VideoPresets,
  RemoteParticipant,
  Participant,
} from "livekit-client";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useParticipants,
  ParticipantLoop,
  useTracks,
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

// Interface for avatar configuration
interface AvatarConfig {
  enabled: boolean;
  participantIdentity?: string;
  videoTrackName?: string;
}

// LiveKit room configuration optimized for avatar usage
const roomOptions: RoomOptions = {
  adaptiveStream: true,
  dynacast: true,
  videoCaptureDefaults: {
    resolution: VideoPresets.h720.resolution,
  },
  // Optimize for avatar streaming
  publishDefaults: {
    videoSimulcastLayers: [
      VideoPresets.h180,
      VideoPresets.h360,
      VideoPresets.h720,
    ],
  },
};

/**
 * TODO: Implement JWT token retrieval from backend API
 * This function should fetch the LiveKit JWT token required for room access
 *
 * @param room - Room identifier
 * @param identity - User identity
 * @returns Promise<string> - JWT token for LiveKit room access
 */
const fetchLiveKitToken = async (
  room: string,
  identity: string
): Promise<string> => {
  // TODO: Replace this with actual API call to your backend
  const response = await api.get(
    `/livekit-token/?room=${room}&identity=${identity}`
  );

  const data: TokenResponse = await response.data;

  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.token) {
    throw new Error("No token received from server");
  }

  return data.token;
};

/**
 * Avatar Participant Component
 * Renders avatar participants differently from regular participants
 */
const AvatarParticipant: React.FC<{ participant: Participant }> = ({
  participant,
}) => {
  const tracks = useTracks(
    [
      {
        source: "camera",
        publication: participant.videoTrackPublications.values().next().value,
      },
      {
        source: "microphone",
        publication: participant.audioTrackPublications.values().next().value,
      },
    ],
    { onlySubscribed: true }
  );

  return (
    <div className="avatar-participant relative">
      <ParticipantTile participant={participant} className="avatar-tile" />
      {/* Avatar-specific UI elements can be added here */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        AI Avatar
      </div>
    </div>
  );
};

/**
 * Custom Participant Grid with Avatar Support
 * Handles different rendering for avatar vs regular participants
 */
const ParticipantGrid: React.FC<{ avatarConfig: AvatarConfig }> = ({
  avatarConfig,
}) => {
  const participants = useParticipants();

  const isAvatarParticipant = (participant: Participant): boolean => {
    if (!avatarConfig.enabled) return false;

    // Check if participant is an avatar based on identity or other criteria
    return avatarConfig.participantIdentity
      ? participant.identity === avatarConfig.participantIdentity
      : participant.identity.includes("avatar") ||
          participant.identity.includes("agent");
  };

  return (
    <div className="participant-grid h-full">
      <GridLayout>
        <ParticipantLoop participants={participants}>
          {(participant) =>
            isAvatarParticipant(participant) ? (
              <AvatarParticipant
                key={participant.identity}
                participant={participant}
              />
            ) : (
              <ParticipantTile
                key={participant.identity}
                participant={participant}
              />
            )
          }
        </ParticipantLoop>
      </GridLayout>
    </div>
  );
};

export const Agent: React.FC = () => {
  const navigate = useNavigate();

  // State management for connection and UI
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    enabled: true,
  });
  const { gameState, startSession } = useGame();

  // LiveKit WebSocket URL from environment variables
  const wsUrl =
    import.meta.env.NEXT_PUBLIC_LIVEKIT_WS_URL ||
    "wss://saz-game-ur3zm2qf.livekit.cloud";

  /**
   * Enhanced token fetch function using the TODO implementation
   */
  const fetchToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      // Get session id and children id
      await startSession(gameState.selectedChild?.id || "");
      if (!gameState.selectedChild) {
        throw new Error("No child selected for the session");
      }
      if (!gameState.livekitRoom) {
        throw new Error("LiveKit room not initialized");
      }

      // Use the TODO function for token retrieval
      const fetchedToken = await fetchLiveKitToken(
        gameState.livekitRoom,
        gameState.selectedChild.id
      );
      console.log(fetchedToken);

      setToken(fetchedToken);
      setIsLoading(false);
    } catch (err) {
      console.error("Token fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch token");
      setIsLoading(false);
    }
  }, []);

  /**
   * Enhanced room event handler with avatar support
   */
  const handleRoomEvents = useCallback(
    (room: Room) => {
      // Connection state change handler
      const onConnectionStateChanged = (state: ConnectionState) => {
        console.log("Connection state changed:", state);
        setIsConnected(state === ConnectionState.Connected);

        if (state === ConnectionState.Connected) {
          setError("");
          setIsLoading(false);
        }
      };

      // Participant connected handler - detect avatars
      const onParticipantConnected = (participant: RemoteParticipant) => {
        console.log("Participant connected:", participant.identity);

        // Check if this is an avatar participant
        if (
          participant.identity.includes("avatar") ||
          participant.identity.includes("agent")
        ) {
          setAvatarConfig((prev) => ({
            ...prev,
            participantIdentity: participant.identity,
          }));
          console.log("Avatar participant detected:", participant.identity);
        }
      };

      // Participant disconnected handler
      const onParticipantDisconnected = (participant: RemoteParticipant) => {
        console.log("Participant disconnected:", participant.identity);

        // Clear avatar config if avatar disconnects
        if (participant.identity === avatarConfig.participantIdentity) {
          setAvatarConfig((prev) => ({
            ...prev,
            participantIdentity: undefined,
          }));
        }
      };

      // Disconnection handler
      const onDisconnected = (reason?: DisconnectReason) => {
        console.log("Disconnected:", reason);
        setIsConnected(false);
        if (reason !== DisconnectReason.CLIENT_INITIATED) {
          setError("Connection lost. Please try reconnecting.");
        }
      };

      // Reconnection handlers
      const onReconnecting = () => {
        console.log("Reconnecting...");
        setIsLoading(true);
        setError("");
      };

      const onReconnected = () => {
        console.log("Reconnected");
        setIsLoading(false);
        setError("");
        setIsConnected(true);
      };

      // Attach event listeners
      room.on(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
      room.on(RoomEvent.ParticipantConnected, onParticipantConnected);
      room.on(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
      room.on(RoomEvent.Disconnected, onDisconnected);
      room.on(RoomEvent.Reconnecting, onReconnecting);
      room.on(RoomEvent.Reconnected, onReconnected);

      // Return cleanup function
      return () => {
        room.off(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
        room.off(RoomEvent.ParticipantConnected, onParticipantConnected);
        room.off(RoomEvent.ParticipantDisconnected, onParticipantDisconnected);
        room.off(RoomEvent.Disconnected, onDisconnected);
        room.off(RoomEvent.Reconnecting, onReconnecting);
        room.off(RoomEvent.Reconnected, onReconnected);
      };
    },
    [avatarConfig.participantIdentity]
  );

  // Initialize token fetch on component mount
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Validate environment variables
  useEffect(() => {
    if (!wsUrl) {
      setError(
        "LiveKit WebSocket URL not configured. Please set NEXT_PUBLIC_LIVEKIT_WS_URL."
      );
      setIsLoading(false);
    }
  }, [wsUrl]);

  /**
   * Handle back navigation
   * Ensures proper cleanup before leaving
   */
  const handleBackClick = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  /**
   * Retry connection function
   * Allows users to retry if connection fails
   */
  const handleRetry = useCallback(() => {
    setError("");
    fetchToken();
  }, [fetchToken]);

  // Loading state UI
  if (isLoading && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackClick}
            className="absolute top-4 left-4 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <p className="text-lg text-muted-foreground">
            Connecting to your AI language learning session...
          </p>
          {avatarConfig.enabled && (
            <p className="text-sm text-muted-foreground">
              Initializing avatar support...
            </p>
          )}
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackClick}
            className="absolute top-4 left-4 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

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
                <Button onClick={handleRetry} className="w-full">
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBackClick}
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main LiveKit room UI with avatar support
  if (token && wsUrl) {
    return (
      <div className="min-h-screen bg-background">
        {/* Back button - positioned absolutely over the LiveKit UI */}
        <div className="absolute top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBackClick}
            className="rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Avatar status indicator */}
        {avatarConfig.enabled && (
          <div className="absolute top-4 right-4 z-50">
            <div className="bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
              {isConnected && avatarConfig.participantIdentity ? (
                <span className="text-green-600">Avatar Connected</span>
              ) : (
                <span className="text-yellow-600">Waiting for Avatar</span>
              )}
            </div>
          </div>
        )}

        {/* LiveKit Room Component with enhanced avatar support */}
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={wsUrl}
          data-lk-theme="default"
          style={{ height: "100vh" }}
          options={roomOptions}
          onConnected={(room) => {
            console.log("Connected to room:", room.name);
            handleRoomEvents(room);
          }}
          onDisconnected={(reason) => {
            console.log("Disconnected from room:", reason);
            setIsConnected(false);
            setAvatarConfig((prev) => ({
              ...prev,
              participantIdentity: undefined,
            }));
          }}
          onError={(error) => {
            console.error("Room error:", error);
            setError(error.message || "An error occurred");
          }}
        >
          {/* Audio renderer for all participants */}
          <RoomAudioRenderer />

          {/* Enhanced video layout with avatar support */}
          <div className="lk-video-conference">
            <ParticipantGrid avatarConfig={avatarConfig} />
          </div>

          {/* Enhanced control bar with avatar-aware controls */}
          <ControlBar
            variation="verbose"
            controls={{
              microphone: true,
              camera: true,
              screenShare: false, // Disabled for avatar sessions
              leave: true,
            }}
          />
        </LiveKitRoom>
      </div>
    );
  }

  // Fallback UI (should not reach here normally)
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBackClick}
          className="absolute top-4 left-4 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <p className="text-lg text-muted-foreground">
          Initializing AI avatar session...
        </p>
      </div>
    </div>
  );
};
