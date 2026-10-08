import React, { useState, useEffect, useRef } from 'react';
import { Bot, Plus, Trash2, Sparkles, MessageSquare, BookOpen, Clock } from 'lucide-react';
import ChatMessage from '../../components/ChatMessage';
import ChatInput from '../../components/ChatInput';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AICampusAssistant() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    "Which classrooms are vacant right now?",
    "Who teaches Database Management Systems?",
    "When is the next hackathon?",
    "Where can I find previous year papers?",
    "What are the requirements for the mini project?",
    "How do I contact the CSE department?"
  ];

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/ai/sessions');
      if (res.success && res.sessions) {
        setSessions(res.sessions);
        if (res.sessions.length > 0 && !activeSessionId) {
          selectSession(res.sessions[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    try {
      const res = await api.get(`/ai/sessions/${sessionId}/messages`);
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewSession = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const handleSendMessage = async (text) => {
    const tempUserMsg = {
      id: 'temp_' + Date.now(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: text,
        sessionId: activeSessionId
      });

      if (res.success) {
        if (!activeSessionId) {
          setActiveSessionId(res.sessionId);
          fetchSessions();
        }
        setMessages(prev => [
          ...prev.filter(m => m.id !== tempUserMsg.id),
          res.userMessage,
          res.reply
        ]);
      }
    } catch (err) {
      showToast(err.message || 'AI assistant service error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/ai/sessions/${sessionId}`);
      showToast('Chat history cleared', 'success');
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        handleNewSession();
      }
    } catch (err) {
      showToast('Failed to delete session', 'error');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--navbar-height))', overflow: 'hidden' }}>
      {/* Left History Sidebar */}
      <div style={{
        width: '260px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem 1rem'
      }}>
        <button onClick={handleNewSession} className="btn btn-primary" style={{ width: '100%', marginBottom: '1.25rem', borderRadius: '8px' }}>
          <Plus size={16} /> New Conversation
        </button>

        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', marginBottom: '0.75rem' }}>
          Recent Chats
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => selectSession(s.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: activeSessionId === s.id ? '#eef2ff' : 'transparent',
                color: activeSessionId === s.id ? '#4f46e5' : '#334155',
                fontWeight: activeSessionId === s.id ? 600 : 400
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                <MessageSquare size={14} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</span>
              </div>
              <button onClick={e => handleDeleteSession(s.id, e)} style={{ color: '#94a3b8', padding: '0.2rem' }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
        {/* Chat Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>CampusHub AI Assistant</h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Grounded in local college knowledge base & live timetable data</p>
            </div>
          </div>
        </div>

        {/* Message Feed */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {messages.length === 0 ? (
            <div style={{ maxWidth: '750px', margin: '3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)' }}>
                <Sparkles size={32} style={{ margin: 'auto' }} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>What can I help you with today?</h2>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '2rem' }}>
                Ask me about vacant classrooms, faculty office hours, course syllabi, hackathons, previous papers, or campus rules.
              </p>

              {/* Suggested prompts list */}
              <div className="grid-cols-2" style={{ gap: '0.85rem', textAlign: 'left' }}>
                {suggestedPrompts.map((prompt, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleSendMessage(prompt)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      color: '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    "{prompt}"
                  </div>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <ChatMessage key={m.id || idx} message={m} />
            ))
          )}

          {loading && (
            <div style={{ padding: '1.25rem 1.5rem', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>
              <Bot size={20} color="#4f46e5" />
              <span>CampusHub AI is thinking and searching knowledge base...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
}
