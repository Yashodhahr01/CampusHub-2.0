import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

export default function ChatInput({ onSendMessage, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      background: '#ffffff',
      borderTop: '1px solid #e2e8f0'
    }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about campus, vacant rooms, faculty, exams, resources..."
        rows={1}
        disabled={disabled}
        style={{
          flex: 1,
          resize: 'none',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          border: '1px solid #cbd5e1',
          outline: 'none',
          fontSize: '0.9rem',
          fontFamily: 'inherit'
        }}
      />
      <button 
        type="submit"
        disabled={!text.trim() || disabled}
        className="btn btn-primary"
        style={{ padding: '0 1.25rem', borderRadius: '10px' }}
      >
        <Send size={18} />
      </button>
    </form>
  );
}
