import React from 'react';
import { Bot, User, BookOpen } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '1.25rem 1.5rem',
      backgroundColor: isUser ? '#ffffff' : '#f8fafc',
      borderBottom: '1px solid #f1f5f9'
    }}>
      <div style={{
        width: '36px',
        height: '36px',
        borderRadius: '10px',
        background: isUser ? '#0f172a' : 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {isUser ? <User size={18} /> : <Bot size={20} />}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', marginBottom: '0.25rem' }}>
          {isUser ? 'You' : 'CampusHub AI Assistant'}
        </div>

        <div style={{
          fontSize: '0.925rem',
          color: '#334155',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap'
        }}>
          {message.content}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <BookOpen size={12} /> Grounded Sources:
            </span>
            {message.sources.map((src, i) => (
              <span key={i} style={{ fontSize: '0.7rem', background: '#e0e7ff', color: '#4f46e5', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                {src}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
