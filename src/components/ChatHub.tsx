import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Loader2, MessageCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { Button, Card } from './UI';

export default function ChatHub() {
  const { user } = useAuth();
  const { resetUnread } = useNotifications();
  const { theme } = useTheme();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch all users to chat with
    axios.get('/api/team').then(res => {
      setUsers(res.data.filter((u: any) => u._id !== user?.id));
    });

    const socketUrl = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '/';
    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5
    });
    
    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    // Polling fallback for production / unstable connections
    const pollInterval = setInterval(() => {
      if (selectedUser && user) {
        const room = [user.id, selectedUser._id].sort().join('_');
        axios.get(`/api/messages/${room}`).then(res => {
          // Only update if message count changed
          setMessages(prev => {
            if (res.data.length !== prev.length) return res.data;
            return prev;
          });
        }).catch(err => console.error('Polling error:', err));
      }
    }, 3000);

    return () => {
      socketRef.current?.disconnect();
      clearInterval(pollInterval);
    };
  }, [user, selectedUser]);

  useEffect(() => {
    resetUnread();
  }, []);

  useEffect(() => {
    if (selectedUser && user) {
      const room = [user.id, selectedUser._id].sort().join('_');
      console.log('Joining room:', room);
      socketRef.current?.emit('join_room', room);
      
      setLoading(true);
      axios.get(`/api/messages/${room}`).then(res => {
        setMessages(res.data);
        setLoading(false);
        resetUnread();
      });
    }
  }, [selectedUser, user]);

  useEffect(() => {
    const handleNewMessage = (msg: any) => {
      const room = [user?.id, selectedUser?._id].sort().join('_');
      if (msg.room === room) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socketRef.current?.on('new_message', handleNewMessage);

    return () => {
      socketRef.current?.off('new_message', handleNewMessage);
    };
  }, [selectedUser, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedUser || !user) return;

    const room = [user.id, selectedUser._id].sort().join('_');
    const msgData = {
      room,
      senderId: user.id,
      senderName: user.name,
      text: input
    };

    console.log('Sending message to room:', room);
    
    try {
      // Send via HTTP to ensure it hits the serverless function reliably
      await axios.post('/api/messages', msgData);
      
      // Also emit via socket for local/polling speed
      socketRef.current?.emit('send_message', msgData);
      
      // Optimistic update
      setMessages(prev => [...prev, { ...msgData, timestamp: new Date() }]);
      setInput('');
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[600px] gap-6">
      {/* Users List */}
      <div className="w-full md:w-72 flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar">
        <h3 className="text-xs font-mono uppercase text-white/40 tracking-widest px-2 mb-2">Team Members</h3>
        {users.map(u => (
          <button
            key={u._id}
            onClick={() => setSelectedUser(u)}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all border ${
              selectedUser?._id === u._id ? 'bg-primary border-primary shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center font-bold">
              {u.name[0]}
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold truncate w-32">{u.name}</h4>
              <p className="text-[10px] text-white/40">{u.role}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex flex-col bg-surface border border-border rounded-[2rem] overflow-hidden">
        {selectedUser ? (
          <>
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-bold">
                  {selectedUser.name[0]}
                </div>
                <div>
                  <h4 className="font-bold">{selectedUser.name}</h4>
                  <p className="text-[10px] text-primary uppercase font-mono tracking-tighter">Active Conversation</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-white/20 hover:text-white"><X size={20} /></button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar">
              {loading ? (
                <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-primary" /></div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-20 italic">
                  <MessageCircle size={48} className="mb-4" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                      msg.senderId === user?.id ? 'bg-primary text-white rounded-tr-none' : 'bg-white/10 text-white rounded-tl-none'
                    }`}>
                      <p>{msg.text}</p>
                      <p className="text-[8px] opacity-40 mt-2 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={scrollRef} />
            </div>

            <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/10 flex gap-4">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-6 py-3 focus:border-primary/50 outline-none transition-all text-sm"
              />
              <button type="submit" className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:scale-105 transition-transform">
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/20">
            <MessageCircle size={64} className="mb-6 opacity-10" />
            <h4 className="text-xl font-bold mb-2">Squad Messages</h4>
            <p className="text-sm">Select a member to start collaborating</p>
          </div>
        )}
      </div>
    </div>
  );
}
