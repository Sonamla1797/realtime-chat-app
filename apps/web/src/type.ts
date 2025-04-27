/* 
export interface User {
    id: string
    firstName: string
    lastName: string
    online: boolean
    lastMessage?: string
    isAI?: boolean
  } */
  
 export interface StatusUpdate {
    id: string
    userId: string
    userName: string
    userInitials: string
    content: string
    timestamp: string
    viewed: boolean
  }
  
 export interface Group {
    id: string
    name: string
    avatar: string
    description: string
    members: number
    lastMessage?: string
    lastActivity: string
  }
  
export interface User {
  _id: string
  name: string
  type: string
  participants: Participants[]
  messages: string[]
  createdAt: string
  updatedAt: string
  
}
interface Participants{
  _id: string
  name: string
  email: string
}


export interface Group {
  id: string
  name: string
  avatar: string
  description: string
  members: number
  lastMessage?: string
  lastActivity: string
}
export interface Friends {
  id: string
  name: string
  email: string
}
