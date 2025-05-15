"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Video, VideoOff, PhoneOff, Phone, Users, MoreVertical, MessageSquare, X } from "lucide-react"

// Update the VideoCallProps interface to include localStream
interface VideoCallProps {
  contactName?: string
  contactAvatar?: string
  isIncoming?: boolean

  groupCall?: boolean
  participants?: { name: string; avatar: string }[]
  audioOnly?: boolean
  localVideoRef: React.RefObject<HTMLVideoElement>
  remoteVideoRef: React.RefObject<HTMLVideoElement>
  localStream: MediaStream | null
  onEndCall: () => void
}

// Update the function signature to include localStream
export default function VideoCall({
  contactName = "Chef Alex",
  contactAvatar = "/placeholder.svg?height=80&width=80",
  isIncoming = false,

  groupCall = false,
  participants = [],
  audioOnly = false,
  localVideoRef,
  remoteVideoRef,
  localStream,
  onEndCall,
}: VideoCallProps) {
  const [callStatus, setCallStatus] = useState<"ringing" | "connected" | "ended">(isIncoming ? "ringing" : "ringing")
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(!audioOnly)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ sender: string; content: string; timestamp: Date }[]>([])
  const [localStreamReady, setLocalStreamReady] = useState(false)

  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check streams and set status
  useEffect(() => {
    console.log("VideoCall mounted with refs:", {
      localRef: localVideoRef?.current ? "exists" : "null",
      remoteRef: remoteVideoRef?.current ? "exists" : "null",
      localStream: localStream ? "exists" : "null",
      remoteStream: remoteVideoRef?.current?.srcObject ? "exists" : "null",

    })
    console.log("VideoCall remoteStream:", remoteVideoRef?.current?.srcObject)

    // Ensure the local stream is assigned to the video element
    if (localStream && localVideoRef.current) {
      // Only assign if not already assigned
      if (localVideoRef.current.srcObject !== localStream) {
        console.log("Assigning local stream to video element in VideoCall")
        localVideoRef.current.srcObject = localStream
      }
      setLocalStreamReady(true)
      setCallStatus("connected")
      startCallDurationTimer()
    } else if (localVideoRef?.current?.srcObject) {
      console.log("Local video already has a stream assigned")
      setLocalStreamReady(true)
      setCallStatus("connected")
      startCallDurationTimer()
    } else {
      console.warn("Local stream not available on mount - waiting...")

      // Check for local stream every 200ms
      const checkInterval = setInterval(() => {
        if (localVideoRef?.current?.srcObject) {
          console.log("Local stream now available")
          setLocalStreamReady(true)
          setCallStatus("connected")
          startCallDurationTimer()
          clearInterval(checkInterval)
        }
      }, 200)

      // Clean up interval after 5 seconds if stream never arrives
      setTimeout(() => {
        clearInterval(checkInterval)
        if (!localStreamReady) {
          console.error("Local stream never became available after timeout")
          // Still show the UI even without local stream
          setCallStatus("connected")
          startCallDurationTimer()
        }
      }, 5000)

      // Clean up interval
      return () => clearInterval(checkInterval)
    }
  }, [localStream])

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (callStatus === "connected") {
      const controlsTimeout = setTimeout(() => {
        setShowControls(false)
      }, 5000)

      return () => {
        clearTimeout(controlsTimeout)
      }
    }
  }, [callStatus, showControls])

  // Handle incoming call auto-rejection after timeout
  useEffect(() => {
    let rejectTimeout: NodeJS.Timeout | null = null

    if (isIncoming && callStatus === "ringing") {
      rejectTimeout = setTimeout(() => {
        onEndCall()
      }, 30000) // Auto reject after 30 seconds
    }

    return () => {
      if (rejectTimeout) clearTimeout(rejectTimeout)
    }
  }, [isIncoming, callStatus, onEndCall])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }

      // Don't stop media tracks here - let the parent component handle this
      console.log("VideoCall component unmounting")
    }
  }, [])

  const startCallDurationTimer = () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
    }

    durationIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
  }

  const handleAcceptCall = () => {
    setCallStatus("connected")
    startCallDurationTimer()
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)

    // Mute the audio track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted // Toggle the current state
      })
    }
  }

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled)

    // Disable the video track
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled // Toggle the current state
      })
    }
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
    // In a real app, you would switch audio output here
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setMessages([
      ...messages,
      {
        sender: "You",
        content: message,
        timestamp: new Date(),
      },
    ])

    setMessage("")

    // Simulate reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: contactName,
          content: "Got your message! 👍",
          timestamp: new Date(),
        },
      ])
    }, 2000)
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      onClick={() => setShowControls(true)}
    >
      {/* Main video area */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        {/* Remote video (full screen) */}
        {callStatus === "connected" ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted={!isSpeakerOn}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "#111",
            }}
            poster={contactAvatar}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#111",
              color: "white",
              padding: "2rem",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                marginBottom: "1.5rem",
                border: "2px solid white",
              }}
            >
              <img
                src={contactAvatar || "/placeholder.svg"}
                alt={contactName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.5rem", textAlign: "center" }}>
              {groupCall ? "Group Call" : contactName}
            </h2>
            <p style={{ margin: 0, opacity: 0.7, textAlign: "center" }}>
              {callStatus === "ringing"
                ? isIncoming
                  ? `Incoming ${audioOnly ? "audio" : "video"} call...`
                  : `${audioOnly ? "Audio" : "Video"} calling...`
                : "Call ended"}
            </p>
          </div>
        )}

        {/* Local video (picture-in-picture) */}
        <div
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "120px",
            height: "160px",
            borderRadius: "0.5rem",
            overflow: "hidden",
            border: "2px solid rgba(255,255,255,0.3)",
            backgroundColor: "#333",
            zIndex: 2,
          }}
        >
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scaleX(-1)", // Mirror effect
            }}
          />
          {(!isVideoEnabled || !localStreamReady) && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <VideoOff size={24} color="white" />
              {!localStreamReady && (
                <p style={{ color: "white", fontSize: "10px", textAlign: "center", margin: "5px 0 0" }}>
                  Connecting...
                </p>
              )}
            </div>
          )}
        </div>

        {/* Group call participants */}
        {groupCall && callStatus === "connected" && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {participants.map((participant, index) => (
              <div
                key={index}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "0.5rem",
                  overflow: "hidden",
                  border: "2px solid rgba(255,255,255,0.3)",
                  backgroundColor: "#333",
                  position: "relative",
                }}
              >
                <img
                  src={participant.avatar || "/placeholder.svg"}
                  alt={participant.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "0.25rem",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    fontSize: "0.7rem",
                    color: "white",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {participant.name}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Call duration */}
        {callStatus === "connected" && (
          <div
            style={{
              position: "absolute",
              top: "1rem",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              padding: "0.25rem 0.75rem",
              borderRadius: "1rem",
              fontSize: "0.875rem",
            }}
          >
            {formatCallDuration(callDuration)}
          </div>
        )}

        {/* Call controls */}
        {showControls && (
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              padding: "1rem",
              backgroundColor: "rgba(0,0,0,0.5)",
              transition: "opacity 0.3s",
              opacity: showControls ? 1 : 0,
            }}
          >
            <button
              style={{
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "50%",
                backgroundColor: isMuted ? "#f44336" : "rgba(255,255,255,0.2)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={toggleMute}
            >
              {isMuted ? <MicOff size={24} color="white" /> : <Mic size={24} color="white" />}
            </button>

            {/* Add speaker toggle button */}
            <button
              style={{
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "50%",
                backgroundColor: !isSpeakerOn ? "#f44336" : "rgba(255,255,255,0.2)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={toggleSpeaker}
            >
              {!isSpeakerOn ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <line x1="23" y1="9" x2="17" y2="15"></line>
                  <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
              )}
            </button>

            {!audioOnly ? (
              <button
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "50%",
                  backgroundColor: !isVideoEnabled ? "#f44336" : "rgba(255,255,255,0.2)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={toggleVideo}
              >
                {!isVideoEnabled ? <VideoOff size={24} color="white" /> : <Video size={24} color="white" />}
              </button>
            ) : (
              <button
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "not-allowed",
                  opacity: 0.5,
                }}
                disabled
              >
                <VideoOff size={24} color="white" />
              </button>
            )}

            <button
              style={{
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "50%",
                backgroundColor: "#f44336",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={onEndCall}
            >
              <PhoneOff size={24} color="white" />
            </button>

            {callStatus === "connected" && (
              <>
                <button
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowChat(!showChat)}
                >
                  <MessageSquare size={24} color="white" />
                </button>

                {groupCall && (
                  <button
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Users size={24} color="white" />
                  </button>
                )}

                <button
                  style={{
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <MoreVertical size={24} color="white" />
                </button>
              </>
            )}
          </div>
        )}

        {/* Incoming call controls */}
        {isIncoming && callStatus === "ringing" && (
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              padding: "1rem",
            }}
          >
            <button
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                backgroundColor: "#f44336",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={onEndCall}
            >
              <PhoneOff size={28} color="white" />
            </button>

            <button
              style={{
                width: "4rem",
                height: "4rem",
                borderRadius: "50%",
                backgroundColor: "#4CAF50",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
              onClick={handleAcceptCall}
            >
              <Phone size={28} color="white" />
            </button>
          </div>
        )}
      </div>

      {/* Chat sidebar */}
      {showChat && callStatus === "connected" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "300px",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            borderLeft: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
            zIndex: 3,
          }}
        >
          <div
            style={{
              padding: "1rem",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0, color: "white" }}>In-call Messages</h3>
            <button
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => setShowChat(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            {messages.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center" }}>
                No messages yet. Send a message without interrupting the call.
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    alignSelf: msg.sender === "You" ? "flex-end" : "flex-start",
                    maxWidth: "80%",
                    backgroundColor: msg.sender === "You" ? "#8e54e9" : "rgba(255,255,255,0.1)",
                    color: "white",
                    padding: "0.75rem",
                    borderRadius: "1rem",
                    borderBottomRightRadius: msg.sender === "You" ? 0 : "1rem",
                    borderBottomLeftRadius: msg.sender === "You" ? "1rem" : 0,
                  }}
                >
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>{msg.content}</p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.7rem", opacity: 0.7, textAlign: "right" }}>
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleSendMessage}
            style={{
              padding: "1rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "1.5rem",
                border: "none",
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
                outline: "none",
              }}
            />
            <button
              type="submit"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "50%",
                backgroundColor: "#8e54e9",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "white" }}
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
