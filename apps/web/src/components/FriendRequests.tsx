"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import axios from "axios"
const baseURL = import.meta.env.VITE_API_BASE_URL;
interface FriendRequest {
  _id: string
  requesterId: {
    _id: string
    username: string
    email: string
  }
  status: string
  createdAt: string
}

export default function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.post(`${baseURL}/api/req/requests`, {
          userId: localStorage.getItem("userId")
        })
        setRequests(res.data)
      } catch (err) {
        console.error("Error fetching friend requests:", err)
      }
    }

    fetchRequests()
  }, [])

  const handleConfirm = async (requestId: string) => {
    try {
      await axios.post(`${baseURL}/api/req/accept`, {
        requestId,
        userId: localStorage.getItem("userId"),
      })
      setRequests(prev => prev.filter(req => req._id !== requestId))
    } catch (err) {
      console.error("Error confirming friend request:", err)
    }
  }

  const handleDelete = async (requestId: string) => {
    try {
      await axios.post(`${baseURL}/api/req/reject`, {
        requestId,
        userId: localStorage.getItem("userId"),
      })
      setRequests(prev => prev.filter(req => req._id !== requestId))
    } catch (err) {
      console.error("Error deleting friend request:", err)
    }
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
              <div key={request._id} className="contact-item" style={{ alignItems: "flex-start", padding: "1rem" }}>
                <img
                  src={"/placeholder.svg"}
                  alt={request.requesterId.username}
                  className="avatar"
                  style={{ width: "3rem", height: "3rem", marginRight: "1rem" }}
                />
                <div className="contact-info">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="contact-name">{request.requesterId.username}</div>
                    <div className="contact-status">{new Date(request.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="contact-status" style={{ marginBottom: "0.5rem" }}>
                    {request.requesterId.email}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button
                      onClick={() => handleConfirm(request._id)}
                      className="btn btn-primary"
                      style={{ width: "50%", backgroundColor: "#4776e6", color: "white", border: "none", padding: "0.5rem", borderRadius: "0.5rem" }}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleDelete(request._id)}
                      className="btn btn-outline"
                      style={{ width: "50%", backgroundColor: "transparent", color: "#333", border: "1px solid #ccc", padding: "0.5rem", borderRadius: "0.5rem" }}
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
