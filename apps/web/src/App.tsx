import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Home from "./components/Home"
import ChatWindow from "./components/ChatWindow"
import ChatList from "./components/ChatLIst"
import GroupChat from "./components/GroupChat"
import FriendRequests from "./components/FriendRequests"
import Login from "./auth/login"
import Signup from "./auth/signup"
import "./App.css"

import LandingPage from "./landing/Landing"

if (typeof global === 'undefined') {
  global = window;
}



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/chat" element={<ChatList />} />
            <Route path="/chat/:userId" element={<ChatWindow />} />
            <Route path="/group/:groupId" element={<GroupChat />} />
            <Route path="/group" element={<GroupChat />} />
            <Route path="/friend-requests" element={<FriendRequests />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
