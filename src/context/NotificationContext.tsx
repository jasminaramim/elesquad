import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';

interface NotificationContextType {
  unreadCount: number;
  resetUnread: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) {
      socket?.disconnect();
      setSocket(null);
      return;
    }

    const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      // Join user's personal room for global notifications
      newSocket.emit('join_room', `user_${user.id}`);
    });

    newSocket.on('new_message', (msg) => {
      // Increment unread count if user is not on the chat page or if message is for them
      // We only increment if the message is NOT from themselves
      if (msg.senderId !== user.id) {
        setUnreadCount(prev => prev + 1);
        toast(`New message from ${msg.senderName}`, {
          icon: '💬',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const resetUnread = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider value={{ unreadCount, resetUnread }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
