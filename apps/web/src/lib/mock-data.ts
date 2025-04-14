// Mock data for preview/demo mode when backend is not available

export const mockUsers = [
  {
    id: "user1",
    firstName: "Ted",
    lastName: "Mosby",
    email: "ted@example.com",
    online: true,
    lastMessage: "We'll go out tomorrow, honey!",
  },
  {
    id: "user2",
    firstName: "Barney",
    lastName: "Stinson",
    email: "barney@example.com",
    online: false,
    lastMessage: "Tomorrow, party at 4.",
  },
  {
    id: "user3",
    firstName: "Marshall",
    lastName: "Erikson",
    email: "marshall@example.com",
    online: true,
    lastMessage: "I won bet again, oh yeah!",
  },
  {
    id: "user4",
    firstName: "Lily",
    lastName: "Aldrin",
    email: "lily@example.com",
    online: false,
    lastMessage: "Let's go shopping!",
  },
  {
    id: "user5",
    firstName: "Robin",
    lastName: "Scherbatsky",
    email: "robin@example.com",
    online: true,
    lastMessage: "News at 7!",
  },
  // Add AI Assistant as a contact - make sure it's clearly visible
  {
    id: "ai-assistant",
    firstName: "AI",
    lastName: "Assistant",
    email: "ai@example.com",
    online: true,
    lastMessage: "How can I help you today?",
    isAI: true, // Flag to identify this as an AI contact
  },
]

export const mockMessages = [
  {
    id: "msg1",
    sender: "user123",
    content: "Hello there!",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "msg2",
    sender: "user1",
    content: "Hi! How are you doing?",
    timestamp: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: "msg3",
    sender: "user123",
    content: "I'm doing great, thanks for asking!",
    timestamp: new Date(Date.now() - 3400000).toISOString(),
  },
  {
    id: "msg4",
    sender: "user1",
    content: "That's wonderful to hear!",
    timestamp: new Date(Date.now() - 3300000).toISOString(),
  },
]

export const mockPrivateMessages = {
  user1: [
    {
      id: "pm1",
      sender: "user123",
      receiver: "user1",
      content: "Hey Ted, how's it going?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "pm2",
      sender: "user1",
      receiver: "user123",
      content: "Pretty good! Working on a new building design.",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
    },
    {
      id: "pm3",
      sender: "user123",
      receiver: "user1",
      content: "That sounds exciting!",
      timestamp: new Date(Date.now() - 3400000).toISOString(),
    },
  ],
  user2: [
    {
      id: "pm4",
      sender: "user123",
      receiver: "user2",
      content: "Barney, are you coming to the party?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "pm5",
      sender: "user2",
      receiver: "user123",
      content: "You know it! It's going to be legen... wait for it... dary!",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
    },
  ],
  // Add initial messages for the AI Assistant
  "ai-assistant": [
    {
      id: "ai1",
      sender: "ai-assistant",
      receiver: "user123",
      content: "👋 Hello! I'm your AI Assistant. How can I help you today?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
}

// Add AI response generation function
export const generateAIResponse = (message: string): string => {
  // Simple response patterns
  if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi")) {
    return "Hello there! How can I assist you today?"
  }

  if (message.toLowerCase().includes("how are you")) {
    return "I'm functioning perfectly, thank you for asking! How about you?"
  }

  if (message.toLowerCase().includes("help")) {
    return "I'd be happy to help! I can answer questions, provide information, or just chat. What do you need assistance with?"
  }

  if (message.toLowerCase().includes("weather")) {
    return "I don't have access to real-time weather data, but I can suggest checking a weather app or website for the most accurate forecast."
  }

  if (message.toLowerCase().includes("joke")) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "What do you call a fake noodle? An impasta!",
      "How does a penguin build its house? Igloos it together!",
      "Why don't eggs tell jokes? They'd crack each other up!",
    ]
    return jokes[Math.floor(Math.random() * jokes.length)]
  }

  if (message.toLowerCase().includes("thank")) {
    return "You're welcome! Is there anything else I can help you with?"
  }

  if (message.toLowerCase().includes("bye") || message.toLowerCase().includes("goodbye")) {
    return "Goodbye! Feel free to message me anytime you need assistance."
  }

  // Default responses for when no pattern matches
  const defaultResponses = [
    "That's interesting! Can you tell me more?",
    "I understand. How can I help you with that?",
    "Thanks for sharing. Is there anything specific you'd like to know?",
    "I'm here to assist you. What would you like to do next?",
    "I'm processing that information. Is there anything else you'd like to discuss?",
    "I'm designed to be helpful. Let me know if you have any questions!",
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}
