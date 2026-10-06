import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, Clock, User as UserIcon } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { exchangeId } = useParams<{ exchangeId: string }>();
  const { user } = useAuth();
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!exchangeId) return;

    const fetchConversation = async () => {
      try {
        const res = await api.get(`/chat/conversation/${exchangeId}`);
        setConversation(res.data);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();

    const socket = getSocket();
    socket.emit('join_conversation', exchangeId);

    socket.on('new_message', (data: any) => {
      if (data.exchangeId === exchangeId) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => {
      socket.off('new_message');
    };
  }, [exchangeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !exchangeId) return;

    const messageText = text;
    setText('');

    try {
      const socket = getSocket();
      socket.emit('send_message', { exchangeId, text: messageText });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading chat room...</div>;
  if (!conversation) return <div className="p-8 text-center text-slate-500">Conversation not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="card p-0 flex flex-col h-[75vh] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Exchange Chat Room</h3>
              <p className="text-xs text-slate-500">Linked to Session #{exchangeId?.slice(-6)}</p>
            </div>
          </div>
        </div>

        {/* Message Log Window */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FAFC]">
          {messages.length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-12">
              No messages yet. Send a greeting to coordinate your skill exchange session!
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMine = msg.senderId === user?._id || msg.senderId?._id === user?._id;

              return (
                <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                      isMine
                        ? 'bg-[#2563EB] text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[10px] mt-1 text-right ${
                        isMine ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message to your partner..."
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
          />
          <button type="submit" className="btn-primary flex items-center gap-1.5 px-5">
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
