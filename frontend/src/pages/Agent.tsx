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
  VideoPresets
} from "livekit-client";
import {
  LiveKitRoom,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  ControlBar,
  useTracks,
  useParticipants
} from "@livekit/components-react";
import "@livekit/components-styles";

// Interface for token response from backend
interface TokenResponse {
  token: string;
  error?: string;
}

// LiveKit room configuration
const roomOptions: RoomOptions = {
  adaptiveStream: true,
  dynacast: true,
  videoCaptureDefaults: {
    resolution: VideoPresets.h720.resolution,
  },
};

export const Agent: React.FC = () => {
  const navigate = useNavigate();
  
  // State management for connection and UI
  const [token, setToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  // LiveKit WebSocket URL from environment variables
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_WS_URL || "";

  /**
   * Fetch LiveKit JWT token from backend API
   * Uses room and identity query parameters for authentication
   */
  const fetchToken = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      
      // Get room and identity from URL params or use defaults
      const urlParams = new URLSearchParams(window.location.search);
      const room = urlParams.get("room") || "language-learning-room";
      const identity = urlParams.get("identity") || `user-${Date.now()}`;
      
      // Construct API endpoint with query parameters
      const apiUrl = `/api/livekit-token/?room=${encodeURIComponent(room)}&identity=${encodeURIComponent(identity)}`;
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TokenResponse = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.token) {
        throw new Error("No token received from server");
      }

      setToken(data.token);
      setIsLoading(false);
    } catch (err) {
      console.error("Token fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch token");
      setIsLoading(false);
    }
  }, []);

  /**
   * Handle LiveKit room connection events
   * Manages connection state and error handling
   */
  const handleRoomEvents = useCallback((room: Room) => {
    // Connection state change handler
    const onConnectionStateChanged = (state: ConnectionState) => {
      console.log("Connection state changed:", state);
      setIsConnected(state === ConnectionState.Connected);
      
      if (state === ConnectionState.Connected) {
        setError("");
        setIsLoading(false);
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

    // Error handler
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
    room.on(RoomEvent.Disconnected, onDisconnected);
    room.on(RoomEvent.Reconnecting, onReconnecting);
    room.on(RoomEvent.Reconnected, onReconnected);

    // Return cleanup function
    return () => {
      room.off(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.Reconnecting, onReconnecting);
      room.off(RoomEvent.Reconnected, onReconnected);
    };
  }, []);

  // Initialize token fetch on component mount
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Validate environment variables
  useEffect(() => {
    if (!wsUrl) {
      setError("LiveKit WebSocket URL not configured. Please set NEXT_PUBLIC_LIVEKIT_WS_URL.");
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
            Connecting to your language learning session...
          </p>
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
              <p className="text-muted-foreground">
                {error}
              </p>
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

  // Main LiveKit room UI
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

        {/* LiveKit Room Component */}
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
          }}
          onError={(error) => {
            console.error("Room error:", error);
            setError(error.message || "An error occurred");
          }}
        >
          {/* Audio renderer for all participants */}
          <RoomAudioRenderer />
          
          {/* Video grid layout */}
          <div className="lk-video-conference">
            <GridLayout>
              <ParticipantTile />
            </GridLayout>
          </div>
          
          {/* Control bar with mic, camera, and leave controls */}
          <ControlBar 
            variation="verbose"
            controls={{
              microphone: true,
              camera: true,
              screenShare: true,
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
          Initializing video chat...
        </p>
      </div>
    </div>
  );
};