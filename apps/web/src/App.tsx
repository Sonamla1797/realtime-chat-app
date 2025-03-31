import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the Message interface
interface Message {
  senderId: string;
  content: string;
  timestamp: string;
}

export default function Chat({ chatId, userId }: { chatId: string; userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!chatId) return; // Prevent connecting if chatId is not available

    // Initialize socket connection
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Join the chat room
    newSocket.emit("joinChat", chatId);

    // Listen for incoming messages
    newSocket.on("message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      // Leave the chat room when the component unmounts
      newSocket.emit("leaveChat", chatId);
      newSocket.off("message");
      newSocket.disconnect(); // Close socket connection
    };
  }, [chatId]);

  const sendMessage = () => {
    if (input.trim() && socket) {
      // Emit the message event to send the message
      socket.emit("sendMessage", {
        chatId,
        senderId: userId,
        content: input,
      });
      setInput(""); // Clear input field
    }
  };

  return (
    <div>
      <h1>Chat Room: {chatId}</h1>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.senderId}:</strong> {msg.content} <em>({msg.timestamp})</em>
          </p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
