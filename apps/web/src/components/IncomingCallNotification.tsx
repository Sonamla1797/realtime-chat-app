"use client"

import { useState, useEffect } from "react"
import { Phone, PhoneOff, Video } from "lucide-react"

interface IncomingCallNotificationProps {
  caller: {
    name: string
    avatar: string
  }
  onAccept: () => void
  onDecline: () => void
  isAudioCall?: boolean // Add this prop
}

export default function IncomingCallNotification({
  caller,
  onAccept,
  onDecline,
  isAudioCall = false, // Add default value
}: IncomingCallNotificationProps) {
  const [isRinging, setIsRinging] = useState(true)
  const [ringtoneAudio] = useState<HTMLAudioElement | null>(
    typeof window !== "undefined" ? new Audio("/ringtone.mp3") : null,
  )

  // Play ringtone
  useEffect(() => {
    if (ringtoneAudio) {
      ringtoneAudio.loop = true
      ringtoneAudio.play().catch((e) => console.log("Autoplay prevented:", e))

      // Vibration pattern if supported
      if (navigator.vibrate) {
        const vibrateInterval = setInterval(() => {
          navigator.vibrate([200, 100, 200])
        }, 1000)

        return () => {
          clearInterval(vibrateInterval)
          ringtoneAudio.pause()
          ringtoneAudio.currentTime = 0
          navigator.vibrate(0) // Stop vibration
        }
      }

      return () => {
        ringtoneAudio.pause()
        ringtoneAudio.currentTime = 0
      }
    }
  }, [ringtoneAudio])

  // Auto-hide after 30 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsRinging(false)
      onDecline()
    }, 30000)

    return () => clearTimeout(timeout)
  }, [onDecline])

  if (!isRinging) return null

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "400px",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        borderRadius: "1rem",
        padding: "1rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
        animation: "slideInDown 0.3s ease-out",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          overflow: "hidden",
          marginBottom: "1rem",
          border: "2px solid white",
        }}
      >
        <img
          src={caller.avatar || "/placeholder.svg"}
          alt={caller.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      <h3 style={{ margin: "0 0 0.5rem", color: "white", textAlign: "center" }}>{caller.name}</h3>

      <p style={{ margin: "0 0 1.5rem", color: "rgba(255, 255, 255, 0.7)", textAlign: "center" }}>
        Incoming {isAudioCall ? "audio" : "video"} call...
      </p>

      <div style={{ display: "flex", gap: "2rem" }}>
        <button
          onClick={onDecline}
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
        >
          <PhoneOff size={24} color="white" />
        </button>

        <button
          onClick={onAccept}
          style={{
            width: "3.5rem",
            height: "3.5rem",
            borderRadius: "50%",
            backgroundColor: "#4CAF50",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {isAudioCall ? <Phone size={24} color="white" /> : <Video size={24} color="white" />}
        </button>
      </div>
    </div>
  )
}
