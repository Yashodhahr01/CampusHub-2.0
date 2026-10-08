import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = [
  { id: 'light', name: 'Light Mode', icon: '☀️', color: '#4f46e5', bg: '#f8fafc' },
  { id: 'dark', name: 'Dark Mode', icon: '🌙', color: '#6366f1', bg: '#0f172a' },
  { id: 'emerald', name: 'Emerald Nature', icon: '🌱', color: '#059669', bg: '#f0fdf4' },
  { id: 'cyber', name: 'Cyber Neon', icon: '⚡', color: '#9333ea', bg: '#090d16' },
  { id: 'amber', name: 'Warm Amber', icon: '🌅', color: '#d97706', bg: '#fffbeb' }
];

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('campushub_theme') || 'light';
  });

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('campushub_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const themeKeys = themes.map(t => t.id);
    const nextIndex = (themeKeys.indexOf(theme) + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
