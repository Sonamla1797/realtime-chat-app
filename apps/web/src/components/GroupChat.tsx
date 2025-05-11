"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  ArrowLeft,
  Smile,
  Paperclip,
  Camera,
  Mic,
  Check,
  Video,
  FileText,
  MapPin,
  ImageIcon,
  MoreVertical,
  Edit,
  Trash2,
  Forward,
  Reply,
  Pin,
  Copy,
  Play,
  Pause,
  Lock,
  Search,
  X,
  CheckCheck,
  Clock,
} from "lucide-react"
import { Link } from "react-router-dom"

// Add these imports at the top with the other imports
/* import VideoCall from "./VideoCall" */
import IncomingCallNotification from "./IncomingCallNotification"

interface PollOption {
  id: string
  text: string
  votes: number
  voters: string[]
}

interface Poll {
  id: string
  question: string
  options: PollOption[]
  createdBy: string
  timestamp: string
}

interface Reaction {
  emoji: string
  count: number
  users: string[]
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  reactions?: Reaction
  isPoll?: boolean
  poll?: Poll
  isEdited?: boolean
  isDeleted?: boolean
  replyTo?: string
  isPinned?: boolean
  attachmentType?: string
  voiceDuration?: string
  status?: "sent" | "delivered" | "read"
  forwarded?: boolean
}

interface GroupChatProps {
  groupId?: string
}

interface GroupMember {
  id: string
  name: string
  avatar: string
  isOnline: boolean
  lastSeen?: string
  isTyping?: boolean
  role?: string
}

export default function GroupChat({ groupId = "dessert-debate" }: GroupChatProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [showVotes, setShowVotes] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [showGroupInfo, setShowGroupInfo] = useState(false)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLInputElement>(null)
  const [isEncrypted, setIsEncrypted] = useState(true)

  // Add these state variables inside the GroupChat component
/*   const [showVideoCall, setShowVideoCall] = useState(false) */
  const [showIncomingCall, setShowIncomingCall] = useState(false)
/*   const [isGroupCall, setIsGroupCall] = useState(false) */

  // Dummy group data
  const groupInfo = {
    id: groupId,
    name: "Dessert Debate",
    description: "Chef Alex & 31 others",
    avatar: "/placeholder.svg?height=40&width=40",
    members: 32,
    createdAt: "2023-05-15T10:30:00Z",
    isEncrypted: true,
  }

  // Dummy group members
  const [groupMembers] = useState<GroupMember[]>([
    {
      id: "user1",
      name: "Chef Alex",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
      role: "admin",
    },
    {
      id: "user2",
      name: "Chloe",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
      isTyping: true,
    },
    {
      id: "user3",
      name: "Steven",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
      lastSeen: "2 hours ago",
    },
    {
      id: "user4",
      name: "Maria",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: true,
    },
    {
      id: "user5",
      name: "John",
      avatar: "/placeholder.svg?height=40&width=40",
      isOnline: false,
      lastSeen: "yesterday",
    },
  ])

  // Dummy messages with a poll
  useEffect(() => {
    console.log(`Loading group chat for group: ${groupId}`)

    const dummyMessages: Message[] = [
      {
        id: "1",
        sender: "Chef Alex",
        content: "What's the dessert option this week?",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: "read",
      },
      {
        id: "2",
        sender: "Chloe",
        content: "😒",
        timestamp: new Date(Date.now() - 3500000).toISOString(),
        status: "read",
      },
      {
        id: "3",
        sender: "You",
        content: "Okay team - time to vote on the dessert - you can only pick one!",
        timestamp: new Date(Date.now() - 3400000).toISOString(),
        isPoll: true,
        status: "read",
        poll: {
          id: "poll1",
          question: "Vote for dessert",
          options: [
            { id: "opt1", text: "Gelato", votes: 10, voters: ["user1", "user2"] },
            { id: "opt2", text: "Chocolate Cake", votes: 12, voters: ["user3", "user4", "You"] },
            { id: "opt3", text: "Cheesecake", votes: 3, voters: ["user5"] },
          ],
          createdBy: "You",
          timestamp: new Date(Date.now() - 3400000).toISOString(),
        },
      },
      {
        id: "4",
        sender: "Steven",
        content: "Great choice 🍰",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
        reactions: { emoji: "❤️", count: 12, users: ["user1", "user2", "You"] },
        status: "read",
      },
      {
        id: "5",
        sender: "Maria",
        content: "I'm bringing extra napkins!",
        timestamp: new Date(Date.now() - 3200000).toISOString(),
        status: "read",
      },
      {
        id: "6",
        sender: "You",
        content: "Perfect! Thanks Maria.",
        timestamp: new Date(Date.now() - 3100000).toISOString(),
        status: "read",
        replyTo: "5",
      },
      {
        id: "7",
        sender: "Chef Alex",
        content: "🎤 Voice message (00:32)",
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        attachmentType: "voice",
        voiceDuration: "00:32",
        status: "read",
      },
      {
        id: "8",
        sender: "You",
        content: "📷 Image attachment",
        timestamp: new Date(Date.now() - 2900000).toISOString(),
        attachmentType: "image",
        status: "delivered",
      },
      {
        id: "9",
        sender: "John",
        content: "Can someone forward this to the other group?",
        timestamp: new Date(Date.now() - 2800000).toISOString(),
        status: "read",
      },
      {
        id: "10",
        sender: "You",
        content: "I'll take care of it!",
        timestamp: new Date(Date.now() - 2700000).toISOString(),
        status: "delivered",
      },
      {
        id: "11",
        sender: "Chloe",
        content: "IMPORTANT: Meeting at 3pm tomorrow to discuss final arrangements.",
        timestamp: new Date(Date.now() - 2600000).toISOString(),
        isPinned: true,
        status: "read",
      },
      {
        id: "12",
        sender: "You",
        content: "This message was edited",
        timestamp: new Date(Date.now() - 2500000).toISOString(),
        isEdited: true,
        status: "sent",
      },
    ]

    setMessages(dummyMessages)
    setSelectedOption("opt2") // Pre-select Chocolate Cake

    // Simulate typing indicator
    const typingInterval = setInterval(() => {
      const shouldShowTyping = Math.random() > 0.7
      if (shouldShowTyping) {
        const randomUser = groupMembers[Math.floor(Math.random() * groupMembers.length)]
        if (randomUser.name !== "You") {
          setTypingUsers([randomUser.name])
          setTimeout(() => {
            setTypingUsers([])
          }, 3000)
        }
      }
    }, 10000)

    return () => {
      clearInterval(typingInterval)
    }
  }, [groupId])

  // Add this useEffect to simulate incoming calls
  useEffect(() => {
    // Simulate an incoming call after 20 seconds
    const incomingCallTimeout = setTimeout(() => {
      if (!showVideoCall) {
        setShowIncomingCall(true)
      }
    }, 20000)

    return () => {
      clearTimeout(incomingCallTimeout)
    }
  }, [showVideoCall])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Cleanup recording interval on unmount
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval)
      }
    }
  }, [recordingInterval])

  // Simulate typing indicator when user is typing
  useEffect(() => {
    if (message.length > 0) {
      // Add "You" to typing users if not already there
      if (!typingUsers.includes("You")) {
        setTypingUsers((prev) => [...prev, "You"])
      }
      const timeout = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((user) => user !== "You"))
      }, 3000)
      return () => clearTimeout(timeout)
    }
  }, [message, typingUsers])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() && !replyingTo) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "You",
      content: message,
      timestamp: new Date().toISOString(),
      status: "sent",
      replyTo: replyingTo ? replyingTo.id : undefined,
    }

    setMessages([...messages, newMessage])
    setMessage("")
    setReplyingTo(null)

    // Simulate message status updates
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)),
      )
    }, 1000)

    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "read" } : msg)),
      )
    }, 3000)
  }

  const handleVote = (pollId: string, optionId: string) => {
    setSelectedOption(optionId)

    setMessages(
      messages.map((msg) => {
        if (msg.isPoll && msg.poll?.id === pollId) {
          // Ensure poll exists before proceeding
          if (!msg.poll) return msg

          const updatedOptions = msg.poll.options.map((opt) => {
            if (opt.id === optionId) {
              // Add vote if not already voted
              if (!opt.voters.includes("You")) {
                return {
                  ...opt,
                  votes: opt.votes + 1,
                  voters: [...opt.voters, "You"],
                }
              }
            } else {
              // Remove vote from other options if already voted
              if (opt.voters.includes("You")) {
                return {
                  ...opt,
                  votes: opt.votes - 1,
                  voters: opt.voters.filter((voter) => voter !== "You"),
                }
              }
            }
            return opt
          })

          return {
            ...msg,
            poll: {
              ...msg.poll,
              options: updatedOptions,
            },
          }
        }
        return msg
      }),
    )
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }

  // Helper function to calculate max votes safely
  const getMaxVotes = (options: PollOption[] | undefined): number => {
    if (!options || options.length === 0) return 1
    return Math.max(...options.map((opt) => opt.votes))
  }

  // Get initials for avatar
  const getInitials = (name: string): string => {
    return name.substring(0, 2)
  }

  // Format recording time
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle voice recording
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      if (recordingInterval) {
        clearInterval(recordingInterval)
        setRecordingInterval(null)
      }

      // Add voice message
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: "You",
        content: `🎤 Voice message (${formatRecordingTime(recordingTime)})`,
        timestamp: new Date().toISOString(),
        attachmentType: "voice",
        voiceDuration: formatRecordingTime(recordingTime),
        status: "sent",
      }

      setMessages([...messages, newMessage])
      setRecordingTime(0)

      // Simulate message status updates
      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)),
        )
      }, 1000)
    } else {
      // Start recording
      setIsRecording(true)
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
      setRecordingInterval(interval)
    }
  }

  // Handle attachment selection
  const handleAttachment = (type: string) => {
    setShowAttachmentMenu(false)

    // Simulate attachment upload
    setTimeout(() => {
      let content = ""
      switch (type) {
        case "image":
          content = "📷 Image attachment"
          break
        case "video":
          content = "🎥 Video attachment"
          break
        case "document":
          content = "📄 Document attachment"
          break
        case "location":
          content = "📍 Location: Central Park, New York"
          break
      }

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        sender: "You",
        content,
        timestamp: new Date().toISOString(),
        attachmentType: type,
        status: "sent",
      }

      setMessages([...messages, newMessage])

      // Simulate message status updates
      setTimeout(() => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg)),
        )
      }, 1000)
    }, 1000)
  }

  // Add emoji to message
  const addEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  // Handle message reaction
  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          if (!msg.reactions) {
            return {
              ...msg,
              reactions: {
                emoji,
                count: 1,
                users: ["You"],
              },
            }
          }

          // If already reacted with this emoji, remove reaction
          if (msg.reactions.emoji === emoji && msg.reactions.users.includes("You")) {
            const newCount = msg.reactions.count - 1
            if (newCount === 0) {
              // Remove reactions object if no reactions left
              const { reactions, ...rest } = msg
              return rest
            }
            return {
              ...msg,
              reactions: {
                ...msg.reactions,
                count: newCount,
                users: msg.reactions.users.filter((user) => user !== "You"),
              },
            }
          }

          // Add new reaction
          return {
            ...msg,
            reactions: {
              emoji,
              count: msg.reactions.emoji === emoji ? msg.reactions.count : msg.reactions.count + 1,
              users: [...msg.reactions.users.filter((user) => user !== "You"), "You"],
            },
          }
        }
        return msg
      }),
    )
    setShowReactions(null)
  }

  // Handle message deletion
  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            content: "This message was deleted",
            isDeleted: true,
          }
        }
        return msg
      }),
    )
  }

  // Handle message edit
  const handleEditMessage = (messageId: string) => {
    const messageToEdit = messages.find((msg) => msg.id === messageId)
    if (messageToEdit) {
      setEditingMessage(messageToEdit)
      setMessage(messageToEdit.content)
      messageInputRef.current?.focus()
    }
  }

  // Save edited message
  const saveEditedMessage = () => {
    if (!editingMessage) return

    setMessages(
      messages.map((msg) => {
        if (msg.id === editingMessage.id) {
          return {
            ...msg,
            content: message,
            isEdited: true,
          }
        }
        return msg
      }),
    )
    setMessage("")
    setEditingMessage(null)
  }

  // Handle message reply
  const handleReplyMessage = (messageId: string) => {
    const messageToReply = messages.find((msg) => msg.id === messageId)
    if (messageToReply) {
      setReplyingTo(messageToReply)
      messageInputRef.current?.focus()
    }
  }

  // Handle message forward
  const handleForwardMessage = (messageId: string) => {
    const messageToForward = messages.find((msg) => msg.id === messageId)
    if (messageToForward) {
      alert(`Message would be forwarded: "${messageToForward.content}"`)
    }
  }

  // Handle message pin/unpin
  const handlePinMessage = (messageId: string) => {
    setMessages(
      messages.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            isPinned: !msg.isPinned,
          }
        }
        return msg
      }),
    )
  }

  // Handle message copy
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content).then(
      () => {
        alert("Message copied to clipboard")
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }

  // Handle voice message playback
  const handlePlayVoiceMessage = (messageId: string) => {
    if (isPlaying === messageId) {
      setIsPlaying(null)
    } else {
      setIsPlaying(messageId)
      // Simulate playback ending after a few seconds
      setTimeout(() => {
        setIsPlaying(null)
      }, 5000)
    }
  }

  // Filter messages by search query
  const filteredMessages = searchQuery
    ? messages.filter((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages

  // Get message by ID (for replies)
  const getMessageById = (id: string) => {
    return messages.find((msg) => msg.id === id)
  }

  // Common emojis
  const commonEmojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "😍", "🙏", "👏", "🤔", "😢", "😎", "🥳", "🤗", "😋"]

  // Reaction options
  const reactionOptions = ["👍", "❤️", "😂", "😮", "😢", "🙏", "🔥", "👏"]

  // Add these functions inside the GroupChat component
  const handleStartCall = (groupCallMode = false) => {
  /*   setIsGroupCall(groupCallMode) */
    setShowVideoCall(true)
  }

  const handleAcceptCall = () => {
    setShowIncomingCall(false)
   /*  setShowVideoCall(true) */
  }

  const handleDeclineCall = () => {
    setShowIncomingCall(false)
  }

  return (
    <div className="chat-container">
      <div className="card" style={{ height: "85vh", display: "flex", flexDirection: "column" }}>
        {/* Header - Fixed with gradient background */}
        <div
          style={{
            background: "linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)",
            padding: "1rem",
            display: "flex",
            alignItems: "center",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
          }}
        >
          <Link to="/chat" style={{ color: "white", marginRight: "1rem" }}>
            <ArrowLeft size={24} />
          </Link>
          <div style={{ cursor: "pointer" }} onClick={() => setShowGroupInfo(!showGroupInfo)}>
            <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "bold", color: "white" }}>
              {groupInfo.name}
              {isEncrypted && (
                <Lock size={14} style={{ display: "inline-block", marginLeft: "0.5rem", verticalAlign: "middle" }} />
              )}
            </h2>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)" }}>
              {typingUsers.length > 0 ? `${typingUsers.join(", ")} typing...` : groupInfo.description}
            </p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
            <button
              className="btn"
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "none",
                padding: "0.25rem",
                borderRadius: "50%",
              }}
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search size={20} />
            </button>
            <button
              className="btn"
              style={{
                backgroundColor: "transparent",
                color: "white",
                border: "none",
                padding: "0.25rem",
                borderRadius: "50%",
              }}
              onClick={() => handleStartCall(true)}
            >
              <Video size={20} />
            </button>
            <button
              className="btn"
              style={{
                backgroundColor: "white",
                color: "#8e54e9",
                border: "none",
                padding: "0.25rem 0.75rem",
                borderRadius: "1rem",
                fontWeight: "500",
                fontSize: "0.875rem",
              }}
            >
              Join
            </button>
            <button
              className="btn btn-outline"
              style={{
                padding: "0.25rem",
                width: "auto",
                color: "white",
                border: "none",
                background: "none",
              }}
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "white",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Search size={18} color="#9333ea" />
            <input
              type="text"
              placeholder="Search in conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "0.5rem 0",
                fontSize: "0.875rem",
              }}
              autoFocus
            />
            {searchQuery && (
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
                onClick={() => setSearchQuery("")}
              >
                <X size={18} color="#9333ea" />
              </button>
            )}
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem",
              }}
              onClick={() => setShowSearch(false)}
            >
              <X size={18} color="#9333ea" />
            </button>
          </div>
        )}

        {/* Group info panel */}
        {showGroupInfo && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "100%",
              backgroundColor: "white",
              zIndex: 10,
              boxShadow: "-2px 0 10px rgba(0,0,0,0.1)",
              padding: "1rem",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0 }}>Group Info</h3>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
                onClick={() => setShowGroupInfo(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#4776e6",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.5rem",
                margin: "0 auto 1rem",
              }}
            >
              DD
            </div>

            <h4 style={{ textAlign: "center", margin: "0 0 0.5rem" }}>{groupInfo.name}</h4>
            <p style={{ textAlign: "center", color: "#666", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
              Created on {new Date(groupInfo.createdAt).toLocaleDateString()}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                marginBottom: "1.5rem",
                padding: "0.5rem 0",
                borderTop: "1px solid #eee",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{groupInfo.members}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#666" }}>Members</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{groupMembers.filter((m) => m.isOnline).length}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#666" }}>Online</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{messages.filter((m) => m.isPinned).length}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#666" }}>Pinned</p>
              </div>
            </div>

            <h5 style={{ margin: "0 0 0.5rem" }}>Members</h5>
            <div style={{ marginBottom: "1.5rem" }}>
              {groupMembers.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "0.5rem 0",
                    borderBottom: "1px solid #f5f5f5",
                  }}
                >
                  <div
                    style={{
                      width: "2rem",
                      height: "2rem",
                      borderRadius: "50%",
                      backgroundColor: "#fef3c7",
                      color: "#92400e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                      fontSize: "0.75rem",
                      marginRight: "0.75rem",
                      position: "relative",
                    }}
                  >
                    {getInitials(member.name)}
                    {member.isOnline && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          width: "0.75rem",
                          height: "0.75rem",
                          borderRadius: "50%",
                          backgroundColor: "#10b981",
                          border: "2px solid white",
                        }}
                      ></span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: "500" }}>
                      {member.name}
                      {member.role === "admin" && (
                        <span
                          style={{
                            marginLeft: "0.5rem",
                            fontSize: "0.7rem",
                            backgroundColor: "#4776e6",
                            color: "white",
                            padding: "0.1rem 0.3rem",
                            borderRadius: "0.25rem",
                          }}
                        >
                          ADMIN
                        </span>
                      )}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "#666" }}>
                      {member.isTyping ? "typing..." : member.isOnline ? "online" : `last seen ${member.lastSeen}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  backgroundColor: "#f5f5f5",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
                onClick={() => setIsEncrypted(!isEncrypted)}
              >
                <Lock size={18} color="#4776e6" />
                <span style={{ flex: 1, textAlign: "left" }}>
                  {isEncrypted ? "Encryption enabled" : "Encryption disabled"}
                </span>
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  backgroundColor: "#f5f5f5",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#4776e6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-bell"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                <span style={{ flex: 1, textAlign: "left" }}>Mute notifications</span>
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  backgroundColor: "#f5f5f5",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <Search size={18} color="#4776e6" />
                <span style={{ flex: 1, textAlign: "left" }}>Search in conversation</span>
              </button>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem",
                  backgroundColor: "#ffebee",
                  border: "none",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  color: "#e53935",
                }}
              >
                <Trash2 size={18} color="#e53935" />
                <span style={{ flex: 1, textAlign: "left" }}>Leave group</span>
              </button>
            </div>
          </div>
        )}

        {/* Pinned messages */}
        {messages.some((msg) => msg.isPinned) && (
          <div
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderBottom: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Pin size={16} color="#9333ea" />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: "500" }}>Pinned Message</p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {messages.find((msg) => msg.isPinned)?.content}
              </p>
            </div>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem",
              }}
              onClick={() => {
                const pinnedMsg = messages.find((msg) => msg.isPinned)
                if (pinnedMsg) {
                  handlePinMessage(pinnedMsg.id)
                }
              }}
            >
              <X size={16} color="#9333ea" />
            </button>
          </div>
        )}

        {/* Messages - Scrollable area with flex-grow */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: msg.sender === "You" ? "row-reverse" : "row",
                alignItems: "flex-start",
                gap: "0.5rem",
                position: "relative",
              }}
            >
              {/* Pin indicator */}
              {msg.isPinned && (
                <div
                  style={{
                    position: "absolute",
                    top: "-0.5rem",
                    right: msg.sender === "You" ? "auto" : "0",
                    left: msg.sender === "You" ? "0" : "auto",
                    backgroundColor: "#9333ea",
                    color: "white",
                    fontSize: "0.7rem",
                    padding: "0.1rem 0.3rem",
                    borderRadius: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <Pin size={10} />
                  <span>Pinned</span>
                </div>
              )}

              {msg.sender !== "You" && (
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "50%",
                    backgroundColor: "#fef3c7",
                    color: "#92400e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    border: "2px solid #f97316",
                  }}
                >
                  {getInitials(msg.sender)}
                </div>
              )}

              <div
                style={{
                  maxWidth: "70%",
                  padding: "0.75rem",
                  borderRadius: "1rem",
                  backgroundColor: msg.sender === "You" ? "#9c27b0" : "white",
                  color: msg.sender === "You" ? "white" : "#333",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  position: "relative",
                }}
              >
                {/* Reply indicator */}
                {msg.replyTo && (
                  <div
                    style={{
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      backgroundColor: msg.sender === "You" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                      marginBottom: "0.5rem",
                      fontSize: "0.875rem",
                      borderLeft: "3px solid",
                      borderColor: msg.sender === "You" ? "rgba(255,255,255,0.5)" : "#9333ea",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: "500",
                        fontSize: "0.75rem",
                        color: msg.sender === "You" ? "rgba(255,255,255,0.7)" : "#666",
                      }}
                    >
                      {getMessageById(msg.replyTo)?.sender || "Unknown"}
                    </p>
                    <p style={{ margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {getMessageById(msg.replyTo)?.content || "Message not found"}
                    </p>
                  </div>
                )}

                {/* Forwarded indicator */}
                {msg.forwarded && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      marginBottom: "0.25rem",
                      fontSize: "0.75rem",
                      color: msg.sender === "You" ? "rgba(255,255,255,0.7)" : "#666",
                    }}
                  >
                    <Forward size={12} />
                    <span>Forwarded</span>
                  </div>
                )}

                {msg.sender !== "You" && (
                  <div style={{ fontWeight: "500", marginBottom: "0.25rem", color: "#9333ea" }}>{msg.sender}</div>
                )}

                {msg.isPoll && msg.poll ? (
                  <div>
                    <p style={{ marginBottom: "0.5rem" }}>{msg.content}</p>
                    <div
                      style={{
                        backgroundColor: msg.sender === "You" ? "#8e24aa" : "#f3f4f6",
                        padding: "0.75rem",
                        borderRadius: "0.75rem",
                        color: msg.sender === "You" ? "white" : "#333",
                      }}
                    >
                      {msg.poll.options.map((option) => {
                        // Calculate max votes safely
                        const maxVotes = getMaxVotes(msg.poll?.options)
                        const percentage = maxVotes > 0 ? (option.votes / maxVotes) * 100 : 0

                        return (
                          <div key={option.id} style={{ marginBottom: "0.75rem" }}>
                            <div style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
                              <div
                                style={{
                                  width: "1.25rem",
                                  height: "1.25rem",
                                  borderRadius: "50%",
                                  border: `1px solid ${msg.sender === "You" ? "rgba(255,255,255,0.5)" : "#d1d5db"}`,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginRight: "0.5rem",
                                  backgroundColor:
                                    selectedOption === option.id
                                      ? msg.sender === "You"
                                        ? "white"
                                        : "#9333ea"
                                      : "transparent",
                                  cursor: "pointer",
                                }}
                                onClick={() => msg.poll && handleVote(msg.poll.id, option.id)}
                              >
                                {selectedOption === option.id && (
                                  <Check size={14} color={msg.sender === "You" ? "#9333ea" : "white"} />
                                )}
                              </div>
                              <span style={{ flex: 1 }}>{option.text}</span>
                              <span
                                style={{
                                  fontSize: "0.875rem",
                                  color: msg.sender === "You" ? "rgba(255,255,255,0.8)" : "#6b7280",
                                }}
                              >
                                {option.votes}
                              </span>
                            </div>
                            <div
                              style={{
                                height: "0.5rem",
                                backgroundColor: msg.sender === "You" ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                                borderRadius: "0.25rem",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${percentage}%`,
                                  backgroundColor: msg.sender === "You" ? "white" : "#9333ea",
                                }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "0.875rem",
                          color: msg.sender === "You" ? "rgba(255,255,255,0.8)" : "#4776e6",
                          cursor: "pointer",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                        }}
                        onClick={() => setShowVotes(!showVotes)}
                      >
                        View votes
                      </button>
                    </div>
                  </div>
                ) : msg.attachmentType === "voice" ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      backgroundColor: msg.sender === "You" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                    }}
                  >
                    <button
                      style={{
                        width: "2rem",
                        height: "2rem",
                        borderRadius: "50%",
                        backgroundColor: msg.sender === "You" ? "white" : "#9333ea",
                        color: msg.sender === "You" ? "#9333ea" : "white",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handlePlayVoiceMessage(msg.id)}
                    >
                      {isPlaying === msg.id ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <div
                      style={{
                        flex: 1,
                        height: "0.25rem",
                        backgroundColor: msg.sender === "You" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)",
                        borderRadius: "0.125rem",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: isPlaying === msg.id ? "60%" : "0%",
                          backgroundColor: msg.sender === "You" ? "white" : "#9333ea",
                          borderRadius: "0.125rem",
                          transition: "width 0.1s linear",
                        }}
                      ></div>
                    </div>
                    <span style={{ fontSize: "0.75rem" }}>{msg.voiceDuration}</span>
                  </div>
                ) : (
                  <p>
                    {msg.isDeleted ? (
                      <span style={{ fontStyle: "italic", opacity: 0.7 }}>{msg.content}</span>
                    ) : (
                      msg.content
                    )}
                  </p>
                )}

                <div
                  style={{
                    fontSize: "0.75rem",
                    color: msg.sender === "You" ? "rgba(255,255,255,0.7)" : "#6b7280",
                    marginTop: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: msg.sender === "You" ? "flex-end" : "flex-start",
                    gap: "0.25rem",
                  }}
                >
                  {formatTime(msg.timestamp)}
                  {msg.isEdited && <span style={{ fontSize: "0.7rem" }}>(edited)</span>}
                  {msg.sender === "You" && (
                    <span>
                      {msg.status === "sent" && <Clock size={12} />}
                      {msg.status === "delivered" && <Check size={12} />}
                      {msg.status === "read" && <CheckCheck size={12} />}
                    </span>
                  )}
                </div>

                {/* Message reactions */}
                {msg.reactions && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "white",
                        borderRadius: "1rem",
                        padding: "0.125rem 0.375rem",
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        color: "#333",
                      }}
                    >
                      {msg.reactions.emoji} {msg.reactions.count}
                    </span>
                  </div>
                )}

                {/* Message actions */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    transform: "translateY(-50%)",
                    right: msg.sender === "You" ? "auto" : "-2.5rem",
                    left: msg.sender === "You" ? "-2.5rem" : "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                    opacity: 0.7,
                  }}
                >
                  <button
                    style={{
                      width: "1.75rem",
                      height: "1.75rem",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                    onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                  >
                    <Smile size={14} color="#9333ea" />
                  </button>
                  <button
                    style={{
                      width: "1.75rem",
                      height: "1.75rem",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                    onClick={() => handleReplyMessage(msg.id)}
                  >
                    <Reply size={14} color="#9333ea" />
                  </button>
                </div>

                {/* Reaction picker */}
                {showReactions === msg.id && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-2.5rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "white",
                      borderRadius: "1.5rem",
                      padding: "0.25rem",
                      display: "flex",
                      gap: "0.25rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      zIndex: 5,
                    }}
                  >
                    {reactionOptions.map((emoji) => (
                      <button
                        key={emoji}
                        style={{
                          background: "none",
                          border: "none",
                          fontSize: "1.25rem",
                          padding: "0.25rem",
                          cursor: "pointer",
                          borderRadius: "50%",
                          width: "2rem",
                          height: "2rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "transform 0.1s",
                        }}
                        onClick={() => handleReaction(msg.id, emoji)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = "scale(1.2)"
                          e.currentTarget.style.backgroundColor = "#f5f5f5"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = "scale(1)"
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message context menu */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: msg.sender === "You" ? "0.5rem" : "auto",
                    left: msg.sender === "You" ? "auto" : "0.5rem",
                  }}
                >
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.25rem",
                      opacity: 0.5,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      const menu = document.getElementById(`message-menu-${msg.id}`)
                      if (menu) {
                        menu.style.display = menu.style.display === "none" ? "block" : "none"
                      }
                    }}
                  >
                    <MoreVertical size={14} />
                  </button>
                  <div
                    id={`message-menu-${msg.id}`}
                    style={{
                      display: "none",
                      position: "absolute",
                      top: "1.5rem",
                      right: msg.sender === "You" ? "0" : "auto",
                      left: msg.sender === "You" ? "auto" : "0",
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      zIndex: 10,
                      width: "150px",
                    }}
                  >
                    {msg.sender === "You" && !msg.isDeleted && (
                      <>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem",
                            width: "100%",
                            textAlign: "left",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                          }}
                          onClick={() => {
                            handleEditMessage(msg.id)
                            document.getElementById(`message-menu-${msg.id}`)!.style.display = "none"
                          }}
                        >
                          <Edit size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem",
                            width: "100%",
                            textAlign: "left",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "0.875rem",
                          }}
                          onClick={() => {
                            handleDeleteMessage(msg.id)
                            document.getElementById(`message-menu-${msg.id}`)!.style.display = "none"
                          }}
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        width: "100%",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                      onClick={() => {
                        handleForwardMessage(msg.id)
                        document.getElementById(`message-menu-${msg.id}`)!.style.display = "none"
                      }}
                    >
                      <Forward size={14} />
                      <span>Forward</span>
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        width: "100%",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                      onClick={() => {
                        handlePinMessage(msg.id)
                        document.getElementById(`message-menu-${msg.id}`)!.style.display = "none"
                      }}
                    >
                      <Pin size={14} />
                      <span>{msg.isPinned ? "Unpin" : "Pin"}</span>
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        width: "100%",
                        textAlign: "left",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                      }}
                      onClick={() => {
                        handleCopyMessage(msg.content)
                        document.getElementById(`message-menu-${msg.id}`)!.style.display = "none"
                      }}
                    >
                      <Copy size={14} />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Recording indicator */}
        {isRecording && (
          <div
            style={{
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              padding: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "0.75rem",
                height: "0.75rem",
                borderRadius: "50%",
                backgroundColor: "red",
                animation: "pulse 1s infinite",
              }}
            />
            <span>Recording... {formatRecordingTime(recordingTime)}</span>
            <button
              style={{
                background: "none",
                border: "none",
                color: "red",
                cursor: "pointer",
                fontSize: "0.875rem",
                textDecoration: "underline",
              }}
              onClick={toggleRecording}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Reply indicator */}
        {replyingTo && (
          <div
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderTop: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Reply size={16} color="#9333ea" />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: "500" }}>
                Replying to <span style={{ color: "#9333ea" }}>{replyingTo.sender}</span>
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {replyingTo.content}
              </p>
            </div>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem",
              }}
              onClick={() => setReplyingTo(null)}
            >
              <X size={16} color="#9333ea" />
            </button>
          </div>
        )}

        {/* Message Input - Fixed at bottom */}
        <div
          style={{
            padding: "0.75rem",
            backgroundColor: "white",
            borderBottomLeftRadius: "0.5rem",
            borderBottomRightRadius: "0.5rem",
            borderTop: "1px solid #eee",
            position: "relative",
          }}
        >
          {/* Emoji picker */}
          {showEmojiPicker && (
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: "0",
                backgroundColor: "white",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                maxWidth: "100%",
              }}
            >
              {commonEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addEmoji(emoji)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    padding: "0.25rem",
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Attachment menu */}
          {showAttachmentMenu && (
            <div
              style={{
                position: "absolute",
                bottom: "100%",
                left: "3rem",
                backgroundColor: "white",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => handleAttachment("image")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "none",
                  border: "none",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  color: "#333",
                  textAlign: "left",
                }}
              >
                <ImageIcon size={20} color="#9333ea" />
                <span>Image</span>
              </button>
              <button
                onClick={() => handleAttachment("video")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "none",
                  border: "none",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  color: "#333",
                  textAlign: "left",
                }}
              >
                <Video size={20} color="#9333ea" />
                <span>Video</span>
              </button>
              <button
                onClick={() => handleAttachment("document")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "none",
                  border: "none",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  color: "#333",
                  textAlign: "left",
                }}
              >
                <FileText size={20} color="#9333ea" />
                <span>Document</span>
              </button>
              <button
                onClick={() => handleAttachment("location")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "none",
                  border: "none",
                  padding: "0.5rem",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  color: "#333",
                  textAlign: "left",
                }}
              >
                <MapPin size={20} color="#9333ea" />
                <span>Location</span>
              </button>
            </div>
          )}

          <form
            onSubmit={editingMessage ? saveEditedMessage : handleSendMessage}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#9333ea",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "50%",
              }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile size={24} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isRecording ? "Recording..." : editingMessage ? "Edit message..." : "Message"}
              style={{
                flex: 1,
                border: "none",
                padding: "0.75rem",
                borderRadius: "1.5rem",
                backgroundColor: "#f3f4f6",
                outline: "none",
              }}
              disabled={isRecording}
              ref={messageInputRef}
            />
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#9333ea",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "50%",
              }}
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            >
              <Paperclip size={24} />
            </button>
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#9333ea",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "50%",
              }}
              onClick={() => handleAttachment("image")}
            >
              <Camera size={24} />
            </button>
            {message || editingMessage ? (
              <button
                type="submit"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            ) : (
              <button
                type="button"
                style={{
                  width: "2.5rem",
                  height: "2.5rem",
                  borderRadius: "50%",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isRecording ? "red" : "linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={toggleRecording}
              >
                <Mic size={20} />
              </button>
            )}
          </form>
        </div>
      </div>
      {/* {showVideoCall && (
        <VideoCall
          contactName={groupInfo.name}
          contactAvatar="/placeholder.svg?height=80&width=80"
          onClose={() => setShowVideoCall(false)}
          groupCall={isGroupCall}
          participants={groupMembers.slice(0, 4).map((member) => ({
            name: member.name,
            avatar: "/placeholder.svg?height=80&width=80",
          }))}
        />
      )} */}

      {showIncomingCall && (
        <IncomingCallNotification
          caller={{
            name: "Chef Alex",
            avatar: "/placeholder.svg?height=80&width=80",
          }}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}
    </div>
  )
}
