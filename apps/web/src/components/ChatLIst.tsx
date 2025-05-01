"use client"

import { useState, useEffect,useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, Plus, MoreVertical, Video, Bot } from 'lucide-react'
import { useAuth } from "../context/AuthContext"
//import { mockUsers } from "../lib/mock-data"
import VideoCall from "./VideoCall"
import IncomingCallNotification from "./IncomingCallNotification"
//import { dgroup , dstatus} from "./dummy";
import { FriendDialogBox, GroupDialogBox } from "./dialogbox/DialogBox"
import { User, Friends, Group } from "../type"
const baseURL = import.meta.env.VITE_API_BASE_URL;


import { getSocket } from "../sockets/socket"
import SimplePeer from "simple-peer"
import Header from "./chatComponents/Header"


// Define isPreviewMode directly in this file if the import is causing issues
/* const isPreviewMode = () => 
  return (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname.includes("vercel.app"))
  )
}
 */

export default function ChatList() {
  
  const [activeTab, setActiveTab] = useState("chats")
  const [users, setUsers] = useState<User[]>([])
  //const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([])
  const [friends, setFriends] = useState<Friends[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [searchQuery, setSearchQuery] = useState("")
 
  const [darkMode, setDarkMode] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(["user1", "user3"])
  const [archived, setArchived] = useState<string[]>(["user5"])
  const [notifications, setNotifications] = useState(true)
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const [showVideoCall, setShowVideoCall] = useState(false)

  const [currentCaller, setCurrentCaller] = useState({ name: "", id: "" })
  const [showAddFriendDialog, setShowAddFriendDialog] = useState(false);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const peerRef = useRef<SimplePeer.Instance | null>(null) // Store the peer connection

  const localVideoRef = useRef<HTMLVideoElement>(null!) 
  const remoteVideoRef = useRef<HTMLVideoElement>(null!) 

  const [incomingCall, setIncomingCall] = useState<{ from: string; signal: any } | null>(null)
  const[showIncomingCall, setShowIncomingCall] = useState(false); // Show incoming call modal/notification  


/*  const [peerConnection, setPeerConnection] = useState<SimplePeer.Instance | null>(null); // Store the peer connection */


  const cuser = JSON.parse(localStorage.getItem("user") || "{}");
  const socket = getSocket();


  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
  
        const peer = new SimplePeer({
          initiator: true,
          trickle: false,
        });
  
        // ✅ Manually add tracks
        stream.getTracks().forEach(track => peer.addTrack(track, stream));
  
        socket.emit("register", { userId: cuser.id });
  
        socket.on("incoming-call", ({ from, signal }) => {
          peer.signal(signal); // VERY IMPORTANT
          setIncomingCall({
            from,
            signal,
          });
          setShowIncomingCall(true);
          console.log("Incoming call from:", from);
        });
  
        socket.on("answer", ({ signal }) => {
          peer?.signal(signal); // Answer received, signal back
        });
  
        socket.on("reject-call", () => {
          alert("Call was rejected.");
          setShowVideoCall(false);
        });
        
      } catch (err) {
        console.error("Error getting media:", err);
      }
    };
  
    getMedia();
  
    return () => {
      socket.off("incoming-call");
      socket.off("answer");
      socket.off("reject-call");
    };
  
  }, []);
  
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
   
    fetchChats();
    fetchFriends()

  }, [isAuthenticated, navigate]);

/*   useEffect(() => {
    // Simulate an incoming call after 30 seconds
    if (!showVideoCall && !showIncomingCall) {
      const randomUser = users[Math.floor(Math.random() * users.length)]
      setCurrentCaller({
        name: `${randomUser.firstName} ${randomUser.lastName}`,
        id: randomUser.id,
      })
      setShowIncomingCall(true)
    }

    return () => {
      clearTimeout(incomingCallTimeout)
    }
  }, [showVideoCall, showIncomingCall, users]) */

  
  const fetchChats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("accessToken");
      const userId = user.id;
     

      if (!userId) {
        console.error("User ID not found in localStorage.");
        return;
      }
  
      const response = await fetch(`${baseURL}/api/chats/user`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "userId": userId,
        },
        credentials: "include",
        
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }
      
      const chats = await response.json();
      setUsers(chats);
      // Filter only group chats
      const groupChats = chats.filter((chat: any) => chat.type === "group");
  
      const formattedGroups = groupChats.map((group: any) => ({
        id: group._id,
        name: group.name,
        participants: group.participants,
      }));
  
      setGroups(formattedGroups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };
  const fetchFriends = async () => {
    try {

      const token = localStorage.getItem("accessToken");
      const userId = cuser.id;

      if (!userId) {
        console.error("User ID not found in localStorage.");
        return;
      }
  
      const response = await fetch(`${baseURL}/api/friend/friends`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "userId": userId,
        },
        credentials: "include",
        
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch friends");
      }
      
      const friendsList = await response.json();
      setFriends(friendsList);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  }
  const handleAddFriend = async (friendId: string) => {
    try {                 
      const token = localStorage.getItem("accessToken");
      const userId = cuser.id;

      if (!userId) {
        console.error("User ID not found in localStorage.");
        return;
      }
  
      const response = await fetch(`${baseURL}/api/friend/add`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "userId": userId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
        credentials: "include",
        
      });
  
      if (!response.ok) {
        throw new Error("Failed to add friend");
      }
      
      const updatedFriendsList = await response.json();
      setFriends(updatedFriendsList);
    }
    catch (error) {
      console.error("Error adding friend:", error);
    }
  }
  const handleStartChat = async (type:string , participants:string[]) => {
      try {
        console.log("Starting chat with participants:", participants);
        const token = localStorage.getItem("accessToken");
        const userId = cuser.id;
        

        if (!userId) {
          console.error("User ID not found in localStorage.");
          return;
        }
    
        const response = await fetch(`${baseURL}/api/chats/create`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "userId": userId,
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({ 
            userId,
            participants,
            type
            
           }),
          credentials: "include",
          
        });
    
        if (!response.ok) {
          throw new Error("Failed to start chat");
        }
        /* const rawChat = await response.json();

        const newChat: User = {
          _id: rawChat._id,
          name: rawChat.name || "",
          type: rawChat.type,
          participants: rawChat.participants || [],
          messages: rawChat.messages || [],
          createdAt: rawChat.createdAt || new Date().toISOString(),
          updatedAt: rawChat.updatedAt || new Date().toISOString(),
        };    

        setUsers((prevUsers) => [...prevUsers, newChat]); */
        fetchChats(); // Refresh the chat list
        setActiveTab("chats");
      } catch (error) {
        console.error("Error starting chat:", error);
      }
    }


/*   const fetchUsers = async () => {
    try {
      

      const response = await fetch("`${baseURL}/api/users", {
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
 */
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
    const fullName = `${user.type === "group" ?user.name: user.participants.find(p => p.name !== cuser.name)?.name}`
    const matchesSearch = fullName.includes(searchQuery.toLowerCase())

    // Filter by archived status if showing archived
    if (showArchived) {
      return archived.includes(user._id) && matchesSearch
    }

    // Filter by favorite status if showing favorites
    if (showFavorites) {
      return favorites.includes(user._id) && matchesSearch
    }

    // Otherwise show non-archived contacts
    return !archived.includes(user._id) && matchesSearch
  })

  const filteredGroups = groups.filter((group) => {
    return group.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const getInitials = (userName: string) => {
    return `${userName.charAt(0)}`
  }

/*   const handleAcceptCall = () => {
    setShowIncomingCall(false)
    setShowVideoCall(true)
  } */
    const initiateCall = async (targetChatId: string) => {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    
      const peer: SimplePeer.Instance = new SimplePeer({
        initiator: true,
        trickle: false,
      });
    
      // ✅ Manually add tracks
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
    
      setShowVideoCall(true);
    
      peer.on("signal", (data) => {
        socket.emit("call-user", {
          to: targetChatId,
          from: cuser.id,
          signal: data,
        });
      });
    
      peer.on("stream", (remoteStream) => {
        if (remoteVideoRef.current && remoteStream) {
          console.log("Received remote track:", remoteStream);
          remoteVideoRef.current.srcObject = remoteStream ;
        }
      });
    };
    
    const acceptCall = async (): Promise<void> => {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    
      const peer: SimplePeer.Instance = new SimplePeer({
        initiator: false, // You are answering
        trickle: false,
      });
    
      // ✅ Manually add tracks
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
    
      peer.on("signal", (signalData: SimplePeer.SignalData) => {
        socket.emit("answer", {
          to: incomingCall?.from || "",
          signal: signalData,
        });
      });
    
      if (incomingCall?.signal) {
        peer.signal(incomingCall.signal);
      }
    
      peer.on("stream", (remoteStream) => {
        if (remoteVideoRef.current && remoteStream) {
          console.log("Received remote track:", remoteStream);
          remoteVideoRef.current.srcObject = remoteStream ;
        }
      });
    
      setShowIncomingCall(false);
      setShowVideoCall(true);
    };
    
  
    /* const handleDeclineCall = () => {
    setShowIncomingCall(false)
  } */
  const rejectCall = () => {
    if (incomingCall) {
      socket.emit("reject-call", { to: incomingCall.from }); // userId of caller
    }
    setShowIncomingCall(false);
  };
  const handleEndCall = () => {
   
    setShowVideoCall(false);

  };
  

  

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
          <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        notifications={notifications}
        toggleNotifications={toggleNotifications}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        showArchived={showArchived}
        setShowArchived={setShowArchived}
        name={cuser.name}
      />

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
              onClick={() => setActiveTab("friends")}
              style={{
                backgroundColor: activeTab === "status" ? "#f97316" : "rgba(255, 255, 255, 0.1)",
                color: "white",
                fontWeight: "bold",
              }}
            >
              FRIENDS
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
                    
                    <div key={user._id} style={{ position: "relative" }}>
                      
                      <Link
                      
                        to={`/chat/${user._id}`}
                        className="contact-item"
                        style={{
                          backgroundColor: false
                            ? "rgba(76, 175, 80, 0.2)"
                            : darkMode
                              ? "rgba(255, 255, 255, 0.05)"
                              : "rgba(255, 255, 255, 0.1)",
                          opacity: archived.includes(user._id) ? 0.7 : 1,
                          border: false ? "1px solid rgba(76, 175, 80, 0.5)" : undefined,
                        }}
                      >
                        <div
                          className="avatar"
                          style={{
                            border: favorites.includes(user._id)
                              ? "2px solid gold"
                              : false
                                ? "2px solid #4CAF50"
                                : undefined,
                            backgroundColor: false ? "#4776e6" : undefined,
                            color: false ? "white" : undefined,
                            position: "relative",
                          }}
                        > 
                        {user.type === "group" ? getInitials(user.name) : "U" } 
                         
                          {false && (
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
                            {user.type === "group" ? user.name : user.participants.find(p => p.name !== cuser.name)?.name} 
                            {favorites.includes(user._id) && (
                              <span style={{ color: "gold", marginLeft: "0.25rem" }}>★</span>
                            )}
                            {false && (
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
                          {user.name && <div className="contact-message">
                            {user.type === "group" ? "Group Chat": user.participants.find(p => p.name !== cuser.name)?.email} 
                            </div>}
                          <div className="contact-status">{true ? "Online" : "Offline"}</div>
                        </div>

                       {/*  Call button - Made clickable  */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {!false && (
                            <button
                              style={{background: "none",border: "none",color: "rgba(255, 255, 255, 0.7)",cursor: "pointer",padding: "0.5rem",
                              }}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                var target = user._id
                                user.type === "group" ? alert("Group call not supported yet") : target = user.participants.find(p => p.name !== cuser.name)?._id || "";
            
                                initiateCall(target)
                
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
                          const contextMenu = document.getElementById(`context-menu-${user._id}`)
                          if (contextMenu) {
                            contextMenu.style.display = contextMenu.style.display === "none" ? "block" : "none"
                          }
                        }}
                      >
                        <MoreVertical size={16} color="rgba(255, 255, 255, 0.7)" />
                      </div>

                      {/* Context menu */}
                      <div
                        id={`context-menu-${user._id}`}
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
                            toggleFavorite(user._id)
                            document.getElementById(`context-menu-${user._id}`)!.style.display = "none"
                          }}
                        >
                          {favorites.includes(user._id) ? "Remove from favorites" : "Add to favorites"}
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
                            toggleArchive(user._id)
                            document.getElementById(`context-menu-${user._id}`)!.style.display = "none"
                          }}
                        >
                          {archived.includes(user._id) ? "Unarchive chat" : "Archive chat"}
                        </div>
                        <div
                            style={{
                              padding: "0.5rem",
                              color: darkMode ? "white" : "#333",
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                            }}
                            onClick={async (e) => {
                              e.stopPropagation();
                              e.preventDefault();

                              // Hide context menu
                              const menu = document.getElementById(`context-menu-${user._id}`);
                              if (menu) menu.style.display = "none";

                              try {
                                const token = localStorage.getItem("accessToken");

                                const response = await fetch(`${baseURL}/api/chats/${user._id}`, {
                                  method: "DELETE", // Change to DELETE if your backend expects it
                                  headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${token}`,
                                    "userId": cuser.id,
                                  }, 
                                  body: JSON.stringify({ userId: cuser.id }), // Include userId in the body if needed
                                  
                                });

                                if (!response.ok) {
                                  throw new Error("Failed to remove friend");
                                }

                                // Optional: update local UI
                                setUsers((prev) => prev.filter((u) => u._id !== user._id));
                              } catch (error) {
                                console.error("Error removing friend:", error);
                              }
                            }}
                          >
                            Remove Chat
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

            {activeTab === "friends" && (
              <div>
                {/* My Status - Made clickable */}
                <div className="friends-section">
                  <h3 className="friends-heading">My friends</h3>
                  <div
                    className="contact-item"
                    style={{ 
                      backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.15)",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowAddFriendDialog(true)}
                  >
                    {showAddFriendDialog && <FriendDialogBox setShowAddFriendDialog = {setShowAddFriendDialog} />}
                   
                    <div className="avatar" style={{ position: "relative" }}>
                      
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
                      <div className="contact-name">My friends</div>
                      <div className="contact-message">Tap to add new friends</div>
                    </div>
                  </div>
                </div>
                {/* Friends List Section */}
                <div className="status-section" style={{ marginTop: "1.5rem" }}>
                  <h3 className="status-heading">Friends</h3>
                  {friends.length > 0 ? (
                    friends.map((friend) => (
                      <div
                        key={friend.id}
                        className="contact-item"
                        style={{
                          cursor: "pointer",
                          backgroundColor: darkMode
                            ? "rgba(255, 255, 255, 0.05)"
                            : "rgba(255, 255, 255, 0.1)",
                        }}
                        onClick={() => handleStartChat("one-on-one", [friend._id, cuser.id])}
                      >
                        <div
                          className="avatar"
                          style={{
                            border: "2px solid #4CAF50",
                            position: "relative",
                          }}
                        >
                          {friend.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="contact-info">
                          <div className="contact-name">{friend.name}</div>
                          <div className="contact-message">{friend.email}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ opacity: 0.7 }}>No friends to show.</div>
                  )}
                </div>

                          
                {/* Recent Updates */}
                {/* <div className="status-section" style={{ marginTop: "1.5rem" }}>
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
                </div> */}

                {/* Viewed Updates */}
                {/* <div className="status-section" style={{ marginTop: "1.5rem" }}>
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
                </div> */}
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
                  onClick={() => setShowCreateGroupDialog(true)}
                >
                   {showCreateGroupDialog && <GroupDialogBox setShowCreateGroupDialog = {setShowCreateGroupDialog}/>}
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

       {/*   Logout button - Positioned higher with more space */}
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
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          onClose={() => setShowVideoCall(false)}
          onEndCall={handleEndCall}
        />
      )}

      {showIncomingCall && (
        <IncomingCallNotification
          caller={{
            name: currentCaller.name,
            avatar: "/placeholder.svg?height=80&width=80",
          }}
          onAccept={acceptCall}
          onDecline={rejectCall}
        />
      )}
    </div>
  )
}
