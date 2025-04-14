"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Video, Phone, Bot } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { mockPrivateMessages, mockUsers, generateAIResponse } from "../lib/mock-data"
import { io, type Socket } from "socket.io-client"
import Message from "./Message"
import { formatDistanceToNow } from "date-fns"
import VideoCall from "./VideoCall"
import IncomingCallNotification from "./IncomingCallNotification"

// Define these functions directly if the import is causing issues
const isPreviewMode = () => {
  return (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname.includes("vercel.app"))
  )
}

let socket: Socket | null = null

const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
  return socket
}

const createMockSocket = () => {
  return {
    on: (event: string, callback: Function) => {
      console.log("Mock socket on:", event)

      // Simulate receiving messages
      if (event === "message" || event === "privateMessage") {
        setTimeout(() => {
          callback({
            id: `msg${Date.now()}`,
            sender: event === "privateMessage" ? "user1" : "user1",
            receiver: event === "privateMessage" ? "user123" : undefined,
            content: "This is a demo message in preview mode!",
            timestamp: new Date().toISOString(),
          })
        }, 5000)
      }
    },
    emit: (event: string, data: any) => {
      console.log("Mock socket emit:", event, data)
      return true // Return a value to avoid void return type issues
    },
    disconnect: () => {
      console.log("Mock socket disconnected")
      return true // Return a value to avoid void return type issues
    },
    off: (event: string) => {
      console.log("Mock socket off:", event)
      return true // Return a value to avoid void return type issues
    },
  } as unknown as Socket
}

interface MessageType {
  id: string
  sender: string
  receiver?: string
  content: string
  timestamp: string
}

interface User {
  id: string
  firstName: string
  lastName: string
  online: boolean
  isAI?: boolean
}

export default function ChatWindow() {
  console.log("ChatWindow component rendering")
  const { userId } = useParams<{ userId: string }>()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<MessageType[]>([])
  const [receiver, setReceiver] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Add video call state
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [showIncomingCall, setShowIncomingCall] = useState(false)
  // Add audioOnly parameter to state variables
  const [callIsAudioOnly, setCallIsAudioOnly] = useState(false)

  console.log("ChatWindow params:", { userId, isAuthenticated, user })

  useEffect(() => {
    console.log("ChatWindow useEffect running")

    if (!isAuthenticated || !user) {
      console.log("Not authenticated, redirecting to login")
      navigate("/login")
      return
    }

    if (!userId) {
      console.log("No userId provided")
      setError("No user selected")
      setLoading(false)
      return
    }

    // Fetch user details and messages
    fetchUserDetails()
    fetchMessages()

    // Set up socket connection
    try {
      const socket = isPreviewMode() ? createMockSocket() : getSocket()

      socket.on("privateMessage", (newMessage: MessageType) => {
        console.log("Received private message:", newMessage)
        if (
          userId &&
          ((newMessage.sender === userId && newMessage.receiver === user.id) ||
            (newMessage.sender === user.id && newMessage.receiver === userId))
        ) {
          setMessages((prev) => [...prev, newMessage])
        }
      })

      return () => {
        console.log("Cleaning up socket listeners")
        socket.off("privateMessage")
      }
    } catch (error) {
      console.error("Socket setup error:", error)
      setError("Failed to connect to chat server")
      setLoading(false)
    }
  }, [isAuthenticated, user, userId, navigate])

  // Remove or comment out this useEffect to stop simulated incoming calls
  // useEffect(() => {
  //   // Simulate an incoming call after 25 seconds if not already in a call
  //   const incomingCallTimeout = setTimeout(() => {
  //     if (!showVideoCall && !showIncomingCall && receiver) {
  //       setShowIncomingCall(true);
  //     }
  //   }, 25000);

  //   return () => {
  //     clearTimeout(incomingCallTimeout);
  //   };
  // }, [showVideoCall, showIncomingCall, receiver]);

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchUserDetails = async () => {
    console.log("Fetching user details for userId:", userId)
    try {
      if (isPreviewMode()) {
        console.log("Using mock data for user details")
        const mockUser = mockUsers.find((u) => u.id === userId)
        console.log("Found mock user:", mockUser)
        setReceiver(mockUser || null)
        setLoading(false)
        return
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setReceiver(data)
      } else {
        console.error("Failed to fetch user details:", response.status)
        setError("Failed to load user details")
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      // Fallback to mock data
      const mockUser = mockUsers.find((u) => u.id === userId)
      setReceiver(mockUser || null)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    console.log("Fetching messages for userId:", userId)
    try {
      if (isPreviewMode()) {
        console.log("Using mock data for messages")
        // Check if userId exists in mockPrivateMessages
        if (userId && userId in mockPrivateMessages) {
          const mockMsgs = mockPrivateMessages[userId as keyof typeof mockPrivateMessages]
          console.log("Found mock messages:", mockMsgs)
          setMessages(mockMsgs)
        } else {
          console.log("No mock messages found for userId:", userId)
          setMessages([])
        }
        return
      }

      const response = await fetch(`http://localhost:5000/api/messages/${userId}`, {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else {
        console.error("Failed to fetch messages:", response.status)
        setError("Failed to load messages")
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
      // Fallback to mock data
      if (userId && userId in mockPrivateMessages) {
        const mockMsgs = mockPrivateMessages[userId as keyof typeof mockPrivateMessages]
        setMessages(mockMsgs)
      } else {
        setMessages([])
      }
    }
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !user || !userId) return

    try {
      // Create the new message
      const newMessage = {
        id: `msg${Date.now()}`,
        sender: user.id,
        receiver: userId,
        content: message,
        timestamp: new Date().toISOString(),
      }

      // Add the message to the UI
      setMessages((prev) => [...prev, newMessage])

      // Check if this is the AI Assistant and generate a response
      if (receiver?.isAI || userId === "ai-assistant") {
        // Show typing indicator
        setIsTyping(true)

        // Simulate AI thinking time (0.5-2 seconds)
        const thinkingTime = 500 + Math.random() * 1500

        setTimeout(() => {
          // Generate AI response
          const aiResponse = generateAIResponse(message)

          // Create AI response message
          const aiMessage = {
            id: `ai${Date.now()}`,
            sender: userId,
            receiver: user.id,
            content: aiResponse,
            timestamp: new Date().toISOString(),
          }

          // Add AI response to messages
          setMessages((prev) => [...prev, aiMessage])
          setIsTyping(false)
        }, thinkingTime)
      } else {
        // For regular users, use socket
        const socket = isPreviewMode() ? createMockSocket() : getSocket()

        // Send private message to server
        socket.emit("sendPrivateMessage", {
          content: message,
          sender: user.id,
          receiver: userId,
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message")
    }

    setMessage("")
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  // Add video call handlers
  // Update the handleStartCall function to accept a parameter
  const handleStartCall = (audioOnly = false) => {
    setCallIsAudioOnly(audioOnly)
    setShowVideoCall(true)
  }

  // Update the handleAcceptCall function to maintain the audio/video mode
  const handleAcceptCall = () => {
    setShowIncomingCall(false)
    setShowVideoCall(true)
  }

  const handleDeclineCall = () => {
    setShowIncomingCall(false)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="chat-container">
        <div className="card">
          <div className="card-content">
            <div className="text-center text-white">Loading chat...</div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="chat-container">
        <div className="card">
          <div className="card-content">
            <div className="chat-header">
              <button className="back-button" onClick={() => navigate("/chat")}>
                <ArrowLeft size={24} />
              </button>
              <div>Error</div>
            </div>
            <div className="text-center text-white">{error}</div>
            <button onClick={() => navigate("/chat")} className="btn btn-primary mt-4">
              Back to Contacts
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isAIAssistant = receiver?.isAI || userId === "ai-assistant"

  return (
    <div className="chat-container">
      <div className="card">
        <div className="card-content">
          <div
            className="chat-header"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: "rgba(71, 118, 230, 0.8)",
              backdropFilter: "blur(8px)",
              padding: "1rem",
              borderRadius: "0.5rem 0.5rem 0 0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <button className="back-button" onClick={() => navigate("/chat")}>
              <ArrowLeft size={24} />
            </button>

            {receiver ? (
              <div className="flex items-center">
                <div
                  className="avatar"
                  style={{
                    position: "relative",
                    backgroundColor: isAIAssistant ? "#4776e6" : undefined,
                    color: isAIAssistant ? "white" : undefined,
                    border: isAIAssistant ? "2px solid #4CAF50" : undefined,
                  }}
                >
                  {getInitials(receiver.firstName, receiver.lastName)}
                  {isAIAssistant && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        backgroundColor: "#4CAF50",
                        borderRadius: "50%",
                        width: "12px",
                        height: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid white",
                      }}
                    >
                      <Bot size={8} />
                    </div>
                  )}
                </div>
                <div>
                  <div className="contact-name">
                    {receiver.firstName} {receiver.lastName}
                    {isAIAssistant && (
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.7rem",
                          backgroundColor: "#4CAF50",
                          color: "white",
                          padding: "0.1rem 0.3rem",
                          borderRadius: "0.25rem",
                          verticalAlign: "middle",
                        }}
                      >
                        AI
                      </span>
                    )}
                  </div>
                  <div className="contact-status">
                    {isTyping ? "Typing..." : receiver.online ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white">Unknown User</div>
            )}

            {/* Add video call button */}
            {/* Add the audio call button next to the video call button in the header */}
            {!isAIAssistant && (
              <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
                <button className="back-button" onClick={() => handleStartCall(true)}>
                  <Phone size={24} />
                </button>
                <button className="back-button" onClick={() => handleStartCall(false)}>
                  <Video size={24} />
                </button>
              </div>
            )}
          </div>

          <div className="messages-area">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <Message
                  key={msg.id}
                  content={msg.content}
                  timestamp={formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                  isOwnMessage={user?.id === msg.sender}
                />
              ))
            ) : (
              <div className="text-center text-white">No messages yet. Start the conversation!</div>
            )}
            {isTyping && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.5rem",
                  maxWidth: "80px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "1rem",
                  margin: "0.5rem 0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.25rem",
                  }}
                >
                  <span
                    className="typing-dot"
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      opacity: 0.6,
                      animation: "typingAnimation 1s infinite",
                      animationDelay: "0s",
                    }}
                  ></span>
                  <span
                    className="typing-dot"
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      opacity: 0.6,
                      animation: "typingAnimation 1s infinite",
                      animationDelay: "0.2s",
                    }}
                  ></span>
                  <span
                    className="typing-dot"
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      opacity: 0.6,
                      animation: "typingAnimation 1s infinite",
                      animationDelay: "0.4s",
                    }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="message-form">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isAIAssistant ? "Ask me anything..." : "Type a message"}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary" style={{ width: "auto" }}>
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Add video call components */}
      {/* Update the VideoCall component to pass the audioOnly parameter */}
      {showVideoCall && (
        <VideoCall
          contactName={receiver ? `${receiver.firstName} ${receiver.lastName}` : "User"}
          contactAvatar="/placeholder.svg?height=80&width=80"
          onClose={() => setShowVideoCall(false)}
          audioOnly={callIsAudioOnly}
        />
      )}

      {/* Update the IncomingCallNotification to include the call type */}
      {showIncomingCall && (
        <IncomingCallNotification
          caller={{
            name: receiver ? `${receiver.firstName} ${receiver.lastName}` : "User",
            avatar: "/placeholder.svg?height=80&width=80",
          }}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
          isAudioCall={Math.random() > 0.5} // Randomly choose between audio and video calls for demo
        />
      )}
    </div>
  )
}
