"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, PhoneOff, Phone, MoreVertical } from "lucide-react"

interface AudioCallProps {
  contactName?: string
  contactAvatar?: string
  isIncoming?: boolean

  groupCall?: boolean
  participants?: { name: string; avatar: string }[]
  localVideoRef: React.RefObject<HTMLVideoElement>
  remoteVideoRef: React.RefObject<HTMLVideoElement>
  localStream: MediaStream | null
  onEndCall: () => void
}

export default function AudioCall({
  contactName = "Chef Alex",
  contactAvatar = "/placeholder.svg?height=80&width=80",
  isIncoming = false,

  groupCall = false,
  participants = [],
  localVideoRef,
  remoteVideoRef,
  localStream,
  onEndCall,
}: AudioCallProps) {
  const [callStatus, setCallStatus] = useState<"ringing" | "connected" | "ended">(isIncoming ? "ringing" : "ringing")
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const [localStreamReady, setLocalStreamReady] = useState(false)

  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Check streams and set status
  useEffect(() => {
    console.log("AudioCall mounted with refs:", {
      localRef: localVideoRef?.current ? "exists" : "null",
      remoteRef: remoteVideoRef?.current ? "exists" : "null",
      localStream: localStream ? "exists" : "null",
      remoteStream: remoteVideoRef?.current?.srcObject ? "exists" : "null",
    })

    // Ensure the local stream is assigned to the video element
    if (localStream && localVideoRef.current) {
      // Only assign if not already assigned
      if (localVideoRef.current.srcObject !== localStream) {
        console.log("Assigning local stream to video element in AudioCall")
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
    console.log("AudioCall controls timeout set")
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
      console.log("AudioCall component unmounting")
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

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
    // In a real app, you would switch audio output here
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
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
      {/* Main audio call area */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        {/* Hidden video elements for stream handling */}
        <video ref={localVideoRef} autoPlay playsInline muted style={{ display: "none" }} />
        <video ref={remoteVideoRef} autoPlay playsInline muted={!isSpeakerOn} style={{ display: "none" }} />

        {/* Audio call UI */}
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
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              overflow: "hidden",
              marginBottom: "2rem",
              border: "3px solid white",
              boxShadow: "0 0 20px rgba(255,255,255,0.3)",
            }}
          >
            <img
              src={contactAvatar || "/placeholder.svg"}
              alt={contactName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "2rem", textAlign: "center" }}>
            {groupCall ? "Group Call" : contactName}
          </h2>
          <p style={{ margin: "0 0 1rem", opacity: 0.7, textAlign: "center", fontSize: "1.2rem" }}>
            {callStatus === "ringing"
              ? isIncoming
                ? "Incoming audio call..."
                : "Audio calling..."
              : callStatus === "connected"
                ? "Audio call in progress"
                : "Call ended"}
          </p>

          {/* Call duration */}
          {callStatus === "connected" && (
            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                color: "white",
                padding: "0.5rem 1.5rem",
                borderRadius: "2rem",
                fontSize: "1.2rem",
                marginTop: "1rem",
              }}
            >
              {formatCallDuration(callDuration)}
            </div>
          )}

          {/* Audio visualization (simple pulsing circle) */}
          {callStatus === "connected" && (
            <div
              style={{
                marginTop: "2rem",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                backgroundColor: "rgba(76, 175, 80, 0.2)",
                border: "2px solid rgba(76, 175, 80, 0.5)",
                animation: "pulse 1.5s infinite",
              }}
            >
              <style>
                {`
                @keyframes pulse {
                  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
                  70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(76, 175, 80, 0); }
                  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                }
                `}
              </style>
            </div>
          )}

          {/* Group call participants */}
          {groupCall && callStatus === "connected" && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "2rem",
              }}
            >
              {participants.map((participant, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <img
                      src={participant.avatar || "/placeholder.svg"}
                      alt={participant.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "0.8rem",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {participant.name}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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

            {/* Speaker toggle button */}
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
    </div>
  )
}
