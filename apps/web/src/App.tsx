import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { autoConnect: false }); // Prevent auto-connect

const ChatPage = () => {
  const chatId = "67ea976fcfb0c23011e8b8fc";
  const [messages, setMessages] = useState<{ senderId: string; text: string; timestamp: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YzYyNjc4OTRiNTU1Y2NmMzg4NmEwOCIsImVtYWlsIjoic29uYW1sYS5zaGVycGFAb3V0bG9vay5jb20iLCJpYXQiOjE3NDM3NjA0MDQsImV4cCI6MTc0Mzc2NDAwNH0.trjBq6NSwzRo4WJh7BwRXN0GsMcqxllT8THefksQ9No";
    if (!token) {
      console.error("⚠️ No token found! User must log in.");
      return;
    }

    fetch(`http://localhost:5000/api/messages/${chatId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setMessages(
          data.map((msg: any) => ({
            senderId: msg.sender,
            text: msg.content,
            timestamp: msg.timestamp,
          }))
        );

        socket.connect();
        socket.emit("joinChat", chatId);

        socket.on("receiveMessage", (message) => {
          setMessages((prev) => [...prev, message]);
        });
      })
      .catch((error) => console.error("❌ Error fetching messages:", error))
      .finally(() => setLoading(false));

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [chatId]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const messageData = {
      senderId: "67c6267894b555ccf3886a08", // Replace with actual sender ID
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", { chatId, ...messageData });
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  return (
    <div>
      <h1>Chat Room: {chatId}</h1>
      {loading ? <p>Loading messages...</p> : null}
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.senderId}:</strong> {msg.text} {" "}
            <small>({new Date(msg.timestamp).toLocaleTimeString()})</small>
          </p>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
