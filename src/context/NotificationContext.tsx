import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { io, Socket } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import axios from 'axios';

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

    const isLocal = window.location.hostname === 'localhost';
    let newSocket: Socket | null = null;

    if (isLocal) {
      const socketUrl = 'http://localhost:3000';
      newSocket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5
      });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        newSocket?.emit('join_room', `user_${user.id}`);
      });
    }

    // Polling fallback for notifications
    const fetchUnread = async () => {
      try {
        const res = await axios.get(`/api/unread-count/${user.id}`);
        setUnreadCount(prev => {
          if (res.data.count > prev) {
            toast(`You have ${res.data.count} unread messages`, { icon: '💬' });
          }
          return res.data.count;
        });
      } catch (err) {
        console.error('Notification poll error:', err);
      }
    };

    fetchUnread(); // Initial fetch
    const pollNotifications = setInterval(fetchUnread, 5000);

    newSocket?.on('new_message', (msg) => {
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
      newSocket?.disconnect();
      clearInterval(pollNotifications);
    };
  }, [user]);

  const resetUnread = async () => {
    setUnreadCount(0);
    // Ideally we would mark all as read here, or per room in ChatHub
  };

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
