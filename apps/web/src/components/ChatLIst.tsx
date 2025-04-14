"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Users, UserPlus, Plus, MoreVertical, Bell, Moon, Settings, Star, Archive, Video, Bot } from 'lucide-react'
import { useAuth } from "../context/AuthContext"
import { mockUsers } from "../lib/mock-data"
import VideoCall from "./VideoCall"
import IncomingCallNotification from "./IncomingCallNotification"

// Define isPreviewMode directly in this file if the import is causing issues
const isPreviewMode = () => {
  return (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname.includes("vercel.app"))
  )
}

interface User {
  id: string
  firstName: string
  lastName: string
  online: boolean
  lastMessage?: string
  isAI?: boolean
}

interface StatusUpdate {
  id: string
  userId: string
  userName: string
  userInitials: string
  content: string
  timestamp: string
  viewed: boolean
}

interface Group {
  id: string
  name: string
  avatar: string
  description: string
  members: number
  lastMessage?: string
  lastActivity: string
}

export default function ChatList() {
  const [activeTab, setActiveTab] = useState("chats")
  const [users, setUsers] = useState<User[]>([])
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(["user1", "user3"])
  const [archived, setArchived] = useState<string[]>(["user5"])
  const [notifications, setNotifications] = useState(true)
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const [showVideoCall, setShowVideoCall] = useState(false)
  const [showIncomingCall, setShowIncomingCall] = useState(false)
  const [currentCaller, setCurrentCaller] = useState({ name: "", id: "" })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
      return
    }

    fetchUsers()
    loadDummyData()
  }, [isAuthenticated, navigate])

  useEffect(() => {
    // Simulate an incoming call after 30 seconds
    const incomingCallTimeout = setTimeout(() => {
      if (!showVideoCall && !showIncomingCall) {
        const randomUser = users[Math.floor(Math.random() * users.length)]
        setCurrentCaller({
          name: `${randomUser.firstName} ${randomUser.lastName}`,
          id: randomUser.id,
        })
        setShowIncomingCall(true)
      }
    }, 30000)

    return () => {
      clearTimeout(incomingCallTimeout)
    }
  }, [showVideoCall, showIncomingCall, users])

  const loadDummyData = () => {
    // Dummy status updates
    const dummyStatusUpdates: StatusUpdate[] = [
      {
        id: "status1",
        userId: "user1",
        userName: "Ted Mosby",
        userInitials: "TM",
        content: "Working on a new building design! 🏢",
        timestamp: "2 hours ago",
        viewed: false,
      },
      {
        id: "status2",
        userId: "user2",
        userName: "Barney Stinson",
        userInitials: "BS",
        content: "Suit up! 👔",
        timestamp: "4 hours ago",
        viewed: false,
      },
      {
        id: "status3",
        userId: "user3",
        userName: "Marshall Erikson",
        userInitials: "ME",
        content: "Just won another case! ⚖️",
        timestamp: "6 hours ago",
        viewed: true,
      },
      {
        id: "status4",
        userId: "user4",
        userName: "Lily Aldrin",
        userInitials: "LA",
        content: "New art project coming soon! 🎨",
        timestamp: "8 hours ago",
        viewed: true,
      },
      {
        id: "status5",
        userId: "user5",
        userName: "Robin Scherbatsky",
        userInitials: "RS",
        content: "Live from New York! 📺",
        timestamp: "10 hours ago",
        viewed: false,
      },
    ]

    // Dummy groups - Adding more groups to test scrolling
    const dummyGroups: Group[] = [
      {
        id: "group1",
        name: "Dessert Debate",
        avatar: "DD",
        description: "Chef Alex & 31 others",
        members: 32,
        lastMessage: "Great choice 🍰",
        lastActivity: "5 min ago",
      },
      {
        id: "group2",
        name: "Architecture Club",
        avatar: "AC",
        description: "Ted & 15 others",
        members: 16,
        lastMessage: "Check out this new design!",
        lastActivity: "2 hours ago",
      },
      {
        id: "group3",
        name: "Legal Team",
        avatar: "LT",
        description: "Marshall & 8 others",
        members: 9,
        lastMessage: "Meeting at 3pm tomorrow",
        lastActivity: "Yesterday",
      },
      {
        id: "group4",
        name: "Art Enthusiasts",
        avatar: "AE",
        description: "Lily & 24 others",
        members: 25,
        lastMessage: "New exhibition this weekend!",
        lastActivity: "2 days ago",
      },
      {
        id: "group5",
        name: "News Anchors",
        avatar: "NA",
        description: "Robin & 12 others",
        members: 13,
        lastMessage: "Breaking news: We're awesome!",
        lastActivity: "3 days ago",
      },
      {
        id: "group6",
        name: "Coffee Lovers",
        avatar: "CL",
        description: "Barista Joe & 18 others",
        members: 19,
        lastMessage: "Anyone tried the new blend?",
        lastActivity: "4 days ago",
      },
      {
        id: "group7",
        name: "Book Club",
        avatar: "BC",
        description: "Emily & 12 others",
        members: 13,
        lastMessage: "Next book: The Great Gatsby",
        lastActivity: "5 days ago",
      },
      {
        id: "group8",
        name: "Fitness Fanatics",
        avatar: "FF",
        description: "Trainer Mike & 22 others",
        members: 23,
        lastMessage: "New workout routine posted!",
        lastActivity: "1 week ago",
      },
      {
        id: "group9",
        name: "Travel Buddies",
        avatar: "TB",
        description: "Sarah & 30 others",
        members: 31,
        lastMessage: "Planning trip to Bali next month",
        lastActivity: "2 weeks ago",
      },
      {
        id: "group10",
        name: "Tech Talk",
        avatar: "TT",
        description: "Developer Dan & 45 others",
        members: 46,
        lastMessage: "Did you see the new AI features?",
        lastActivity: "3 weeks ago",
      },
    ]

    setStatusUpdates(dummyStatusUpdates)
    setGroups(dummyGroups)
  }

  const fetchUsers = async () => {
    try {
      if (isPreviewMode()) {
        // Use mock data in preview mode
        setUsers(mockUsers)
        return
      }

      const response = await fetch("http://localhost:5000/api/users", {
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      // Fallback to mock data
      setUsers(mockUsers)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const toggleFavorite = (userId: string) => {
    if (favorites.includes(userId)) {
      setFavorites(favorites.filter((id) => id !== userId))
    } else {
      setFavorites([...favorites, userId])
    }
  }

  const toggleArchive = (userId: string) => {
    if (archived.includes(userId)) {
      setArchived(archived.filter((id) => id !== userId))
    } else {
      setArchived([...archived, userId])
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // In a real app, you would apply dark mode styles to the entire app
    document.body.style.background = darkMode
      ? "linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)"
      : "linear-gradient(135deg, #2c3e50 0%, #4a00e0 100%)"
  }

  const toggleNotifications = () => {
    setNotifications(!notifications)
    if (notifications) {
      alert("Notifications turned off")
    } else {
      alert("Notifications turned on")
    }
  }

  const filteredUsers = users.filter((user) => {
    // Filter by search query
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
    const matchesSearch = fullName.includes(searchQuery.toLowerCase())

    // Filter by archived status if showing archived
    if (showArchived) {
      return archived.includes(user.id) && matchesSearch
    }

    // Filter by favorite status if showing favorites
    if (showFavorites) {
      return favorites.includes(user.id) && matchesSearch
    }

    // Otherwise show non-archived contacts
    return !archived.includes(user.id) && matchesSearch
  })

  const filteredGroups = groups.filter((group) => {
    return group.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  const handleStartCall = (userId: string, userName: string) => {
    setCurrentCaller({
      name: userName,
      id: userId,
    })
    setShowVideoCall(true)
  }

  const handleAcceptCall = () => {
    setShowIncomingCall(false)
    setShowVideoCall(true)
  }

  const handleDeclineCall = () => {
    setShowIncomingCall(false)
  }

  return (
    <div className="chat-container">
      <div
        className="card"
        style={{
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: darkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.2)",
        }}
      >
        <div
          className="card-content"
          style={{ display: "flex", flexDirection: "column", height: "100%", padding: "1rem" }}
        >
          {/* Header with Settings Menu */}
          <div className="flex items-center" style={{ justifyContent: "space-between", marginBottom: "1rem" }}>
            <h1 className="card-title">Messages</h1>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div style={{ position: "relative" }} onClick={() => setShowMenu(!showMenu)}>
                <Settings size={24} color="white" style={{ cursor: "pointer" }} />

                {/* Settings dropdown menu */}
                {showMenu && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      backgroundColor: darkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
                      borderRadius: "0.5rem",
                      padding: "0.5rem",
                      width: "200px",
                      zIndex: 10,
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div
                      style={{
                        padding: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: darkMode ? "white" : "#333",
                        cursor: "pointer",
                      }}
                      onClick={toggleDarkMode}
                    >
                      <Moon size={18} />
                      <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                    </div>
                    <div
                      style={{
                        padding: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: darkMode ? "white" : "#333",
                        cursor: "pointer",
                      }}
                      onClick={toggleNotifications}
                    >
                      <Bell size={18} />
                      <span>{notifications ? "Mute Notifications" : "Enable Notifications"}</span>
                    </div>
                    <div
                      style={{
                        padding: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: darkMode ? "white" : "#333",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowFavorites(!showFavorites)}
                    >
                      <Star size={18} />
                      <span>{showFavorites ? "Show All Contacts" : "Show Favorites"}</span>
                    </div>
                    <div
                      style={{
                        padding: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: darkMode ? "white" : "#333",
                        cursor: "pointer",
                      }}
                      onClick={() => setShowArchived(!showArchived)}
                    >
                      <Archive size={18} />
                      <span>{showArchived ? "Show Active Chats" : "Show Archived"}</span>
                    </div>
                  </div>
                )}
              </div>
              <Link to="/friend-requests" style={{ color: "white" }}>
                <UserPlus size={24} />
              </Link>
              <Link to="/group" style={{ color: "white" }}>
                <Users size={24} />
              </Link>
            </div>
          </div>

          {/* Filter indicators */}
          {(showFavorites || showArchived) && (
            <div
              style={{
                backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "white", fontSize: "0.875rem" }}>
                {showFavorites ? "Showing favorites only" : "Showing archived chats"}
              </span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  textDecoration: "underline",
                }}
                onClick={() => (showFavorites ? setShowFavorites(false) : setShowArchived(false))}
              >
                Clear
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="tabs">
            <div
              className={`tab ${activeTab === "chats" ? "active" : ""}`}
              onClick={() => setActiveTab("chats")}
              style={{
                backgroundColor: activeTab === "chats" ? "#f97316" : "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              CHATS
            </div>
            <div
              className={`tab ${activeTab === "status" ? "active" : ""}`}
              onClick={() => setActiveTab("status")}
              style={{
                backgroundColor: activeTab === "status" ? "#f97316" : "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              STATUS
            </div>
            <div
              className={`tab ${activeTab === "groups" ? "active" : ""}`}
              onClick={() => setActiveTab("groups")}
              style={{
                backgroundColor: activeTab === "groups" ? "#f97316" : "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              GROUPS
            </div>
          </div>

          {/* Search */}
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              style={{
                backgroundColor: darkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.8)",
              }}
            />
          </div>

          {/* Scrollable content area */}
          <div style={{ flex: 1, overflowY: "auto", maxHeight: "calc(100% - 150px)" }}>
            {activeTab === "chats" && (
              <div>
                {/* Add Group Chat Link */}
                <Link
                  to="/group"
                  className="contact-item"
                  style={{ backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)" }}
                >
                  <div className="avatar" style={{ backgroundColor: "#4776e6", color: "white", border: "none" }}>
                    GD
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">Dessert Debate</div>
                    <div className="contact-message">Great choice 🍰</div>
                    <div className="contact-status">32 members</div>
                  </div>
                </Link>

                {/* AI Assistant - Highlighted and clearly visible */}
                <Link
                  to={`/chat/ai-assistant`}
                  className="contact-item"
                  style={{
                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                    border: "1px solid rgba(76, 175, 80, 0.5)",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div
                    className="avatar"
                    style={{
                      backgroundColor: "#4776e6",
                      color: "white",
                      border: "2px solid #4CAF50",
                      position: "relative",
                    }}
                  >
                    AI
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
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">
                      AI Assistant
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
                    </div>
                    <div className="contact-message">How can I help you today?</div>
                    <div className="contact-status">Online</div>
                  </div>
                </Link>

                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user.id} style={{ position: "relative" }}>
                      <Link
                        to={`/chat/${user.id}`}
                        className="contact-item"
                        style={{
                          backgroundColor: user.isAI
                            ? "rgba(76, 175, 80, 0.2)"
                            : darkMode
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(255, 255, 255, 0.1)",
                          opacity: archived.includes(user.id) ? 0.7 : 1,
                          border: user.isAI ? "1px solid rgba(76, 175, 80, 0.5)" : undefined,
                        }}
                      >
                        <div
                          className="avatar"
                          style={{
                            border: favorites.includes(user.id)
                              ? "2px solid gold"
                              : user.isAI
                                ? "2px solid #4CAF50"
                                : undefined,
                            backgroundColor: user.isAI ? "#4776e6" : undefined,
                            color: user.isAI ? "white" : undefined,
                            position: "relative",
                          }}
                        >
                          {getInitials(user.firstName, user.lastName)}
                          {user.isAI && (
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
                        <div className="contact-info">
                          <div className="contact-name">
                            {user.firstName} {user.lastName}
                            {favorites.includes(user.id) && (
                              <span style={{ color: "gold", marginLeft: "0.25rem" }}>★</span>
                            )}
                            {user.isAI && (
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
                          {user.lastMessage && <div className="contact-message">{user.lastMessage}</div>}
                          <div className="contact-status">{user.online ? "Online" : "Offline"}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {!user.isAI && (
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                color: "rgba(255, 255, 255, 0.7)",
                                cursor: "pointer",
                                padding: "0.5rem",
                              }}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleStartCall(user.id, `${user.firstName} ${user.lastName}`)
                              }}
                            >
                              <Video size={18} />
                            </button>
                          )}
                        </div>
                      </Link>

                      {/* Context menu button */}
                      <div
                        style={{
                          position: "absolute",
                          right: "0.5rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          zIndex: 5,
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          const contextMenu = document.getElementById(`context-menu-${user.id}`)
                          if (contextMenu) {
                            contextMenu.style.display = contextMenu.style.display === "none" ? "block" : "none"
                          }
                        }}
                      >
                        <MoreVertical size={16} color="rgba(255, 255, 255, 0.7)" />
                      </div>

                      {/* Context menu */}
                      <div
                        id={`context-menu-${user.id}`}
                        style={{
                          display: "none",
                          position: "absolute",
                          right: "1.5rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          backgroundColor: darkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
                          borderRadius: "0.5rem",
                          padding: "0.5rem",
                          zIndex: 10,
                          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <div
                          style={{
                            padding: "0.5rem",
                            color: darkMode ? "white" : "#333",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            toggleFavorite(user.id)
                            document.getElementById(`context-menu-${user.id}`)!.style.display = "none"
                          }}
                        >
                          {favorites.includes(user.id) ? "Remove from favorites" : "Add to favorites"}
                        </div>
                        <div
                          style={{
                            padding: "0.5rem",
                            color: darkMode ? "white" : "#333",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            toggleArchive(user.id)
                            document.getElementById(`context-menu-${user.id}`)!.style.display = "none"
                          }}
                        >
                          {archived.includes(user.id) ? "Unarchive chat" : "Archive chat"}
                        </div>
                        <div
                          style={{
                            padding: "0.5rem",
                            color: darkMode ? "white" : "#333",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                            alert(`Muting notifications for ${user.firstName} ${user.lastName}`)
                            document.getElementById(`context-menu-${user.id}`)!.style.display = "none"
                          }}
                        >
                          Mute notifications
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-white">
                    {showFavorites
                      ? "No favorite contacts found"
                      : showArchived
                        ? "No archived chats found"
                        : "No contacts found"}
                  </div>
                )}
              </div>
            )}

            {activeTab === "status" && (
              <div>
                {/* My Status - Made clickable */}
                <div className="status-section">
                  <h3 className="status-heading">My Status</h3>
                  <div
                    className="contact-item"
                    style={{
                      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.15)",
                      cursor: "pointer",
                    }}
                    onClick={() => alert("Add status feature will be implemented soon!")}
                  >
                    <div className="avatar" style={{ position: "relative" }}>
                      YO
                      <div
                        style={{
                          position: "absolute",
                          bottom: "-2px",
                          right: "-2px",
                          backgroundColor: "#4776e6",
                          borderRadius: "50%",
                          width: "1rem",
                          height: "1rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "2px solid rgba(255, 255, 255, 0.2)",
                        }}
                      >
                        <Plus size={12} color="white" />
                      </div>
                    </div>
                    <div className="contact-info">
                      <div className="contact-name">My Status</div>
                      <div className="contact-message">Tap to add status update</div>
                    </div>
                  </div>
                </div>

                {/* Recent Updates */}
                <div className="status-section" style={{ marginTop: "1.5rem" }}>
                  <h3 className="status-heading">Recent Updates</h3>
                  {statusUpdates
                    .filter((status) => !status.viewed)
                    .map((status) => (
                      <div
                        key={status.id}
                        className="contact-item"
                        style={{
                          cursor: "pointer",
                          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)",
                        }}
                        onClick={() => alert(`Viewing ${status.userName}'s status: ${status.content}`)}
                      >
                        <div
                          className="avatar"
                          style={{
                            border: "2px solid #4776e6",
                            position: "relative",
                          }}
                        >
                          {status.userInitials}
                        </div>
                        <div className="contact-info">
                          <div className="contact-name">{status.userName}</div>
                          <div className="contact-message">{status.content}</div>
                          <div className="contact-status">{status.timestamp}</div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Viewed Updates */}
                <div className="status-section" style={{ marginTop: "1.5rem" }}>
                  <h3 className="status-heading">Viewed Updates</h3>
                  {statusUpdates
                    .filter((status) => status.viewed)
                    .map((status) => (
                      <div
                        key={status.id}
                        className="contact-item"
                        style={{
                          opacity: 0.7,
                          cursor: "pointer",
                          backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)",
                        }}
                        onClick={() => alert(`Viewing ${status.userName}'s status: ${status.content}`)}
                      >
                        <div className="avatar" style={{ border: "2px solid #ccc" }}>
                          {status.userInitials}
                        </div>
                        <div className="contact-info">
                          <div className="contact-name">{status.userName}</div>
                          <div className="contact-message">{status.content}</div>
                          <div className="contact-status">{status.timestamp}</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === "groups" && (
              <div>
                {/* Create New Group Button - Made clickable */}
                <div
                  className="contact-item"
                  style={{
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.15)",
                    marginBottom: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => alert("Create new group feature will be implemented soon!")}
                >
                  <div
                    className="avatar"
                    style={{
                      backgroundColor: "#4776e6",
                      color: "white",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Plus size={20} />
                  </div>
                  <div className="contact-info">
                    <div className="contact-name">Create New Group</div>
                    <div className="contact-message">Start a new conversation</div>
                  </div>
                </div>

                {/* Group List */}
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <Link
                      key={group.id}
                      to={`/group/${group.id}`}
                      className="contact-item"
                      style={{ backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.1)" }}
                    >
                      <div className="avatar" style={{ backgroundColor: "#4776e6", color: "white", border: "none" }}>
                        {group.avatar}
                      </div>
                      <div className="contact-info">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div className="contact-name">{group.name}</div>
                          <div className="contact-status" style={{ fontSize: "0.7rem" }}>
                            {group.lastActivity}
                          </div>
                        </div>
                        <div className="contact-message">{group.lastMessage}</div>
                        <div className="contact-status">{group.description}</div>
                      </div>
                      <div style={{ marginLeft: "0.5rem" }}>
                        <MoreVertical size={16} color="rgba(255, 255, 255, 0.7)" />
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center text-white">No groups found</div>
                )}
              </div>
            )}
          </div>

          {/* Logout button - Positioned higher with more space */}
          <div style={{ padding: "1rem 0" }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                border: "none",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                cursor: "pointer",
              }}
            >
              <span style={{ marginRight: "0.5rem" }}>Logout</span>
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {showVideoCall && (
        <VideoCall
          contactName={currentCaller.name}
          contactAvatar="/placeholder.svg?height=80&width=80"
          onClose={() => setShowVideoCall(false)}
        />
      )}

      {showIncomingCall && (
        <IncomingCallNotification
          caller={{
            name: currentCaller.name,
            avatar: "/placeholder.svg?height=80&width=80",
          }}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}
    </div>
  )
}
