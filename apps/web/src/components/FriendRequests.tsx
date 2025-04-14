"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

interface FriendRequest {
  id: string
  name: string
  avatar: string
  mutualFriends: number
  timeAgo: string
}

export default function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([
    {
      id: "1",
      name: "Dexter Amistad",
      avatar: "/placeholder.svg?height=60&width=60",
      mutualFriends: 286,
      timeAgo: "1d",
    },
    {
      id: "2",
      name: "Alexander Kim",
      avatar: "/placeholder.svg?height=60&width=60",
      mutualFriends: 1,
      timeAgo: "2w",
    },
    {
      id: "3",
      name: "Sasha Fox",
      avatar: "/placeholder.svg?height=60&width=60",
      mutualFriends: 28,
      timeAgo: "36w",
    },
    {
      id: "4",
      name: "Khai Duncan",
      avatar: "/placeholder.svg?height=60&width=60",
      mutualFriends: 162,
      timeAgo: "25w",
    },
    {
      id: "5",
      name: "Calvin Tran",
      avatar: "/placeholder.svg?height=60&width=60",
      mutualFriends: 1,
      timeAgo: "13w",
    },
    {
      id: "6",
      name: "Dereck Rich",
      avatar: "/placeholder.svg?height=60&width=60",
      mutualFriends: 287,
      timeAgo: "44w",
    },
    {
      id: "7",
      name: "Julbert Abraham",
      avatar: "/placeholder.svg?height=60&width=60",
      mutualFriends: 5,
      timeAgo: "4w",
    },
  ])

  const handleConfirm = (id: string) => {
    setRequests(requests.filter((request) => request.id !== id))
  }

  const handleDelete = (id: string) => {
    setRequests(requests.filter((request) => request.id !== id))
  }

  return (
    <div className="chat-container">
      <div className="card">
        <div className="chat-header">
          <Link to="/chat" className="back-button">
            <ArrowLeft size={24} />
          </Link>
          <h2 className="card-title">Friend Requests</h2>
        </div>
        <div className="card-content">
          <h1 className="card-title">{requests.length} Friend Requests</h1>
          <button className="link mt-4" style={{ display: "block", marginBottom: "1rem" }}>
            View sent requests
          </button>

          <div className="friend-requests-list">
            {requests.map((request) => (
              <div key={request.id} className="contact-item" style={{ alignItems: "flex-start", padding: "1rem" }}>
                <img
                  src={request.avatar || "/placeholder.svg"}
                  alt={request.name}
                  className="avatar"
                  style={{ width: "3rem", height: "3rem", marginRight: "1rem" }}
                />
                <div className="contact-info">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="contact-name">{request.name}</div>
                    <div className="contact-status">{request.timeAgo}</div>
                  </div>
                  <div className="contact-status" style={{ marginBottom: "0.5rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "1.25rem",
                        height: "1.25rem",
                        backgroundColor: "#ccc",
                        borderRadius: "50%",
                        marginRight: "0.25rem",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "inline-block",
                        width: "1.25rem",
                        height: "1.25rem",
                        backgroundColor: "#ccc",
                        borderRadius: "50%",
                        marginRight: "0.5rem",
                        marginLeft: "-0.5rem",
                        border: "1px solid white",
                      }}
                    ></span>
                    {request.mutualFriends} mutual friends
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button
                      onClick={() => handleConfirm(request.id)}
                      className="btn btn-primary"
                      style={{ width: "50%", backgroundColor: "#4776e6" }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="btn btn-outline"
                      style={{ width: "50%" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
