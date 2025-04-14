// apps/web/src/services/socket.ts
import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;
const SOCKET_URL = 'http://localhost:5000';

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Create a mock socket for preview/demo mode
export const createMockSocket = () => {
  return {
    on: (event: string, callback: Function) => {
      console.log('Mock socket on:', event);
      
      // Simulate receiving messages
      if (event === 'message' || event === 'privateMessage') {
        setTimeout(() => {
          callback({
            id: `msg${Date.now()}`,
            sender: event === 'privateMessage' ? 'user1' : 'user1',
            receiver: event === 'privateMessage' ? 'user123' : undefined,
            content: 'This is a demo message in preview mode!',
            timestamp: new Date().toISOString(),
          });
        }, 5000);
      }
    },
    emit: (event: string, data: any) => {
      console.log('Mock socket emit:', event, data);
      return true; // Return a value to avoid void return type issues
    },
    disconnect: () => {
      console.log('Mock socket disconnected');
      return true; // Return a value to avoid void return type issues
    },
    off: (event: string) => {
      console.log('Mock socket off:', event);
      return true; // Return a value to avoid void return type issues
    }
  } as unknown as Socket;
};

export const isPreviewMode = () => {
  return (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname.includes('vercel.app'))
  );
};