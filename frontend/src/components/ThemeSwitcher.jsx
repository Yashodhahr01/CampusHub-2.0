import React, { useState } from 'react';
import { Palette, Check, Sun, Moon, Zap, Leaf, Sunset } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getThemeIcon = (id) => {
    switch(id) {
      case 'dark': return <Moon size={15} className="text-indigo-400" />;
      case 'emerald': return <Leaf size={15} color="#10b981" />;
      case 'cyber': return <Zap size={15} color="#a855f7" />;
      case 'amber': return <Sunset size={15} color="#f59e0b" />;
      default: return <Sun size={15} color="#f59e0b" />;
    }
  };

  const activeThemeObj = themes.find(t => t.id === theme) || themes[0];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Change Theme"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.65rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          fontSize: '0.8rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        <Palette size={16} color="var(--primary)" />
        <span style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{activeThemeObj.icon}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: '125%',
          width: '210px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          padding: '0.5rem',
          zIndex: 300,
          animation: 'modalIn 0.15s ease'
        }}>
          <div style={{ 
            fontSize: '0.7rem', 
            fontWeight: 700, 
            color: 'var(--text-muted)', 
            padding: '0.35rem 0.5rem', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Select Theme
          </div>
          {themes.map((t) => {
            const isSelected = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.65rem',
                  fontSize: '0.825rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                  background: isSelected ? 'var(--primary-light)' : 'transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  margin: '0.15rem 0',
                  transition: 'background 0.15s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1rem' }}>{t.icon}</span>
                  <span>{t.name}</span>
                </div>
                {isSelected && <Check size={14} color="var(--primary)" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
