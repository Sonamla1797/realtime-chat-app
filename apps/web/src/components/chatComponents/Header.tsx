import { useState } from "react"
import { Link } from "react-router-dom"
import { Settings, Moon, Bell, Star, Archive, UserPlus, Users } from "lucide-react"

export default function Header(props: any) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      id="navbar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", color: "white" }}>Hello {props.name}</h1>

      <div style={{ display: "flex", gap: "1rem" }}>
        <div style={{ position: "relative" }} onClick={() => setShowMenu(!showMenu)}>
          <Settings size={24} color="white" style={{ cursor: "pointer" }} />

          {/* Dropdown */}
          {showMenu && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                backgroundColor: props.darkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                width: "200px",
                zIndex: 10,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Toggle Dark Mode */}
              <div
                style={{
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: props.darkMode ? "white" : "#333",
                  cursor: "pointer",
                }}
                onClick={props.toggleDarkMode}
              >
                <Moon size={18} />
                <span>{props.darkMode ? "Light Mode" : "Dark Mode"}</span>
              </div>

              {/* Toggle Notifications */}
              <div
                style={{
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: props.darkMode ? "white" : "#333",
                  cursor: "pointer",
                }}
                onClick={props.toggleNotifications}
              >
                <Bell size={18} />
                <span>{props.notifications ? "Mute Notifications" : "Enable Notifications"}</span>
              </div>

              {/* Toggle Favorites */}
              <div
                style={{
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: props.darkMode ? "white" : "#333",
                  cursor: "pointer",
                }}
                onClick={() => props.setShowFavorites(!props.showFavorites)}
              >
                <Star size={18} />
                <span>{props.showFavorites ? "Show All Contacts" : "Show Favorites"}</span>
              </div>

              {/* Toggle Archived */}
              <div
                style={{
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: props.darkMode ? "white" : "#333",
                  cursor: "pointer",
                }}
                onClick={() => props.setShowArchived(!props.showArchived)}
              >
                <Archive size={18} />
                <span>{props.showArchived ? "Show Active Chats" : "Show Archived"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Friend Requests Link */}
        <Link to="/friend-requests" style={{ color: "white" }}>
          <UserPlus size={24} />
        </Link>

        {/* Group Page Link */}
       {/*  <Link to="/group" style={{ color: "white" }}>
          <Users size={24} />
        </Link> */}
      </div>
    </div>
  )
}
