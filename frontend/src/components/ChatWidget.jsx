import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, MessageSquare, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

/* ─── Helpers ─────────────────────────────────────── */
const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  if (d.toDateString() === today.toDateString()) return 'Today';
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

/* ─── Conversation List ───────────────────────────── */
const ConversationList = ({ conversations, onSelect, unreadTotal }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{
      padding: '20px 20px 16px',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: '10px'
    }}>
      <MessageSquare size={20} color="var(--accent)" />
      <span style={{ fontWeight: 700, fontSize: '1rem' }}>Messages</span>
      {unreadTotal > 0 && (
        <span style={{
          background: '#8b5cf6',
          color: '#fff',
          borderRadius: '999px',
          padding: '2px 8px',
          fontSize: '0.75rem',
          fontWeight: 700,
          marginLeft: 'auto'
        }}>{unreadTotal}</span>
      )}
    </div>
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {conversations.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          No conversations yet.<br />Book an appointment to start chatting.
        </div>
      ) : (
        conversations.map((conv) => (
          <button
            key={conv.appointment_id}
            onClick={() => onSelect(conv)}
            style={{
              width: '100%', textAlign: 'left', background: 'none',
              border: 'none', borderBottom: '1px solid var(--border)',
              padding: '14px 20px', cursor: 'pointer',
              transition: 'background 0.15s',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.9rem', color: '#fff'
              }}>
                {conv.other_user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', truncate: true }}>
                    {conv.other_user?.name || 'Unknown'}
                  </span>
                  {conv.last_message_at && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      {formatDate(conv.last_message_at)}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    color: 'var(--text-secondary)', fontSize: '0.8rem',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    maxWidth: '160px'
                  }}>
                    {conv.last_message || conv.category}
                  </span>
                  {conv.unread > 0 && (
                    <span style={{
                      background: '#8b5cf6', color: '#fff',
                      borderRadius: '999px', padding: '1px 7px',
                      fontSize: '0.7rem', fontWeight: 700, flexShrink: 0
                    }}>{conv.unread}</span>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))
      )}
    </div>
  </div>
);

/* ─── Chat Window ─────────────────────────────────── */
const ChatWindow = ({ conversation, currentUserId, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await api.get(`/user/chat/appointments/${conversation.appointment_id}`);
      setMessages(data);
    } catch {
      try {
        const { data } = await api.get(`/agent/chat/appointments/${conversation.appointment_id}`);
        setMessages(data);
      } catch { /* silent */ }
    }
  }, [conversation.appointment_id]);

  useEffect(() => {
    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    const text = input.trim();
    setInput('');
    try {
      await api.post(`/user/chat/appointments/${conversation.appointment_id}`, { message: text });
      fetchMessages();
    } catch {
      try {
        await api.post(`/agent/chat/appointments/${conversation.appointment_id}`, { message: text });
        fetchMessages();
      } catch { /* silent */ }
    } finally {
      setSending(false);
    }
  };

  let lastDate = null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px', display: 'flex' }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '0.85rem', color: '#fff'
        }}>
          {conversation.other_user?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{conversation.other_user?.name}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            {conversation.category} · {conversation.status}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          const msgDate = formatDate(msg.created_at);
          const showDateDivider = msgDate !== lastDate;
          lastDate = msgDate;

          return (
            <div key={msg.id}>
              {showDateDivider && (
                <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {msgDate}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '75%',
                  background: isMe
                    ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                    : 'rgba(255,255,255,0.06)',
                  border: isMe ? 'none' : '1px solid var(--border)',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '10px 14px',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  color: isMe ? '#fff' : 'var(--text-primary)',
                }}>
                  <div>{msg.message}</div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>
                    {formatTime(msg.created_at)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex', gap: '10px', alignItems: 'center'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message…"
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          style={{
            background: input.trim() ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '12px',
            width: '42px', height: '42px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            flexShrink: 0, transition: 'all 0.2s',
            boxShadow: input.trim() ? '0 0 15px rgba(139,92,246,0.4)' : 'none',
          }}
        >
          <Send size={16} color={input.trim() ? '#fff' : 'var(--text-muted)'} />
        </button>
      </form>
    </div>
  );
};

/* ─── Main Chat Widget ────────────────────────────── */
const ChatWidget = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const pollRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    const role = user.role || user.roles?.[0]?.name;
    if (!role || (role !== 'user' && role !== 'agent')) return;
    try {
      const prefix = role === 'agent' ? 'agent' : 'user';
      const { data } = await api.get(`/${prefix}/chat/conversations`);
      console.log('Conversations fetched:', data);
      
      // Deduplicate conversations by other_user.id so names don't duplicate
      const uniqueConversations = [];
      const seen = new Set();
      for (const conv of data) {
        const otherId = conv.other_user?.id;
        if (otherId && !seen.has(otherId)) {
          seen.add(otherId);
          uniqueConversations.push(conv);
        }
      }
      
      setConversations(uniqueConversations);
      setUnreadTotal(uniqueConversations.reduce((acc, c) => acc + (c.unread || 0), 0));
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchConversations();
      pollRef.current = setInterval(fetchConversations, 5000);
    }
    return () => clearInterval(pollRef.current);
  }, [user, fetchConversations]);

  // Auto-open chat when conversations exist
  useEffect(() => {
    if (conversations.length > 0 && !open) {
      setOpen(true);
    }
  }, [conversations]);

  if (!user) return null;
  // Don't show for admin
  const role = user.role || user.roles?.[0]?.name;
  if (role === 'admin') return null;

  return (
    <>
      {/* Floating Button */}
      <button
        id="chat-widget-btn"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: 'fixed', bottom: '30px', right: '30px',
          zIndex: 8888,
          width: '56px', height: '56px',
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
          border: 'none', borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(139,92,246,0.5)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(139,92,246,0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(139,92,246,0.5)';
        }}
      >
        {open ? <X size={22} color="#fff" /> : <MessageSquare size={22} color="#fff" />}
        {!open && unreadTotal > 0 && (
          <div style={{
            position: 'absolute', top: '0', right: '0',
            width: '20px', height: '20px', borderRadius: '50%',
            background: '#ef4444', color: '#fff',
            fontSize: '0.7rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg-base, #09090f)',
          }}>
            {unreadTotal > 9 ? '9+' : unreadTotal}
          </div>
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '100px', right: '30px',
          zIndex: 8888,
          width: '360px', height: '520px',
          background: '#111116',
          border: '1px solid rgba(139,92,246,0.3)',
          borderRadius: '20px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(139,92,246,0.15)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'chatPanelIn 0.25s ease',
        }}>
          {selected ? (
            <ChatWindow
              conversation={selected}
              currentUserId={user.id}
              onBack={() => {
                setSelected(null);
                fetchConversations();
              }}
            />
          ) : (
            <ConversationList
              conversations={conversations}
              unreadTotal={unreadTotal}
              onSelect={setSelected}
            />
          )}
        </div>
      )}

      <style>{`
        @keyframes chatPanelIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
