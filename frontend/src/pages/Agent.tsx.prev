import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
} from "lucide-react";

// Demo Component - Static version of the Agent
export function Agent() {
  // Demo state management
  const [connectionState, setConnectionState] = useState("connecting");
  const [agentState, setAgentState] = useState("initializing");
  const [isAvatarActive, setIsAvatarActive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [audioVisualizerBars, setAudioVisualizerBars] = useState(
    Array(12).fill(0)
  );
  const [currentMessage, setCurrentMessage] = useState("");
  const [sessionStats, setSessionStats] = useState({
    vocalizations: 0,
    responses: 3,
    duration: "2:34",
  });
  const [conversationIndex, setConversationIndex] = useState(0);

  // Demo conversation flow
  const conversationFlow = [
    {
      state: "speaking",
      message: "Hi there, little friend! I'm CHAT! 🤗",
      duration: 3000,
      color: "text-blue-600",
    },
  ];

  // Initialize demo
  useEffect(() => {
    const initDemo = async () => {
      // Simulate loading
      setTimeout(() => {
        setIsLoading(false);
        setConnectionState("connected");
        setIsAvatarActive(true);
        startConversationFlow();
      }, 2000);
    };

    initDemo();
  }, []);

  // Conversation flow simulation
  const startConversationFlow = () => {
    let currentIndex = 0;

    const runConversation = () => {
      if (currentIndex >= conversationFlow.length) {
        currentIndex = 1; // Loop back to speaking state
      }

      const current = conversationFlow[currentIndex];
      setAgentState(current.state);
      setCurrentMessage(current.message);
      setConversationIndex(currentIndex);

      // Simulate stats updates
      if (current.state === "listening") {
        setSessionStats((prev) => ({
          ...prev,
          vocalizations: prev.vocalizations + 1,
        }));
      }

      currentIndex++;
      //   setTimeout(runConversation, current.duration);
    };

    runConversation();
  };

  // Demo avatar component
  const DemoAvatar = () => {
    return (
      <div className="relative">
        <div className="w-64 h-64 rounded-full transition-all duration-500 shadow-2xl">
          <div className="flex items-center justify-center h-full">
            <video
              className="w-64 h-64 rounded-full object-cover"
              autoPlay
              loop
              muted
            >
              <source src="/avatars/chat-avatar.mp4" type="video/mp4" />
            </video>
          </div>
          {/* Animated ring for speaking */}
          {agentState === "speaking" && (
            <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping opacity-50"></div>
          )}
          {/* Animated ring for listening */}
          {agentState === "listening" && (
            <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-pulse opacity-50"></div>
          )}
        </div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          CHAT Avatar
        </div>
      </div>
    );
  };

  // Audio visualizer component
  const AudioVisualizer = () => (
    <div className="flex items-end justify-center space-x-1 h-24 w-80">
      {audioVisualizerBars.map((height, index) => (
        <div
          key={index}
          className={`w-4 rounded-t-lg transition-all duration-150 ${
            agentState === "speaking"
              ? "bg-gradient-to-t from-blue-400 to-blue-600"
              : "bg-gradient-to-t from-purple-400 to-purple-600"
          }`}
          style={{
            height: `${Math.max(height, 10)}%`,
          }}
        />
      ))}
    </div>
  );

  const handleRestart = () => {
    setConversationIndex(0);
    setAgentState("initializing");
    setCurrentMessage("");
    setSessionStats({ vocalizations: 0, responses: 0, duration: "0:00" });
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center space-y-6">
          <button className="absolute top-4 left-4 p-2 rounded-full border border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Starting Your Speech Session
            </h2>
            <p className="text-lg text-gray-600 max-w-md">
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
  }

  // Main demo interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 relative">
      {/* Back button */}
      <div className="absolute top-14 left-4 z-50">
        <button className="p-2 rounded-full border border-gray-300 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-colors shadow-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col h-screen">
        {/* Connection Status */}
        <div className="flex justify-between items-center p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <div
              className={`w-3 h-3 rounded-full ${
                connectionState === "connected" ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium text-black">
              {connectionState === "connected" ? "Connected" : "Connecting..."}
            </span>
          </div>

          {isAvatarActive && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm text-blue-600">
                CHAT Assistant Active
              </span>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
          {/* Avatar */}
          <DemoAvatar />

          {/* Voice Assistant Status and Visualizer */}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 max-w-md min-h-[3rem] flex items-center justify-center">
                {currentMessage}
              </p>
            </div>

            {/* Audio Visualizer */}
            <div className="flex items-center justify-center">
              <AudioVisualizer />
            </div>

            {/* Session Stats */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 max-w-md">
              <h3 className="font-semibold text-gray-800 mb-2">
                📊 Session Stats
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {sessionStats.vocalizations}
                  </div>
                  <div className="text-gray-600">Child Sounds</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {sessionStats.responses}
                  </div>
                  <div className="text-gray-600">AI Responses</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {sessionStats.duration}
                  </div>
                  <div className="text-gray-600">Duration</div>
                </div>
              </div>
            </div>

            {/* Participant Status */}
            <div className="text-sm text-gray-500">
              <span>✅ Connected with your AI assistant</span>
            </div>
          </div>

          {/* Tips for Parents */}
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

        {/* Control Bar */}
        <div className="p-4 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-4">
            {/* Microphone Toggle */}
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3 rounded-full transition-colors ${
                isMicOn
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {isMicOn ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>

            {/* Speaker Toggle */}
            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`p-3 rounded-full transition-colors ${
                isSpeakerOn
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-500 hover:bg-gray-600 text-white"
              }`}
            >
              {isSpeakerOn ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>

            {/* Restart Demo */}
            <button
              onClick={handleRestart}
              className="p-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
