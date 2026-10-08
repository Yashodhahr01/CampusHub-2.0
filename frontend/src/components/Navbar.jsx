import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Bell, LogOut, User, Sparkles, Shield, ChevronDown, Check, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlobalSearchModal from './GlobalSearchModal';
import ThemeSwitcher from './ThemeSwitcher';
import api from '../services/api';

export default function Navbar({ onMobileMenuToggle }) {
  const { user, logout, loginDemo } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      api.get('/notifications')
        .then(res => {
          if (res.success) {
            setNotifications(res.notifications || []);
            setUnreadCount(res.unreadCount || 0);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleMarkRead = async () => {
    setShowNotifDropdown(!showNotifDropdown);
    if (unreadCount > 0) {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleSwitchDemo = async (role) => {
    setShowUserDropdown(false);
    await loginDemo(role);
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'faculty') navigate('/faculty/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
  };

  return (
    <header style={{
      height: 'var(--navbar-height)',
      background: 'var(--navbar-bg)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onMobileMenuToggle} className="mobile-menu-btn" style={{ display: 'none', padding: '0.4rem' }}>
          <Menu size={22} color="#0f172a" />
        </button>

        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', letterSpacing: '-0.02em' }}>CampusHub</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, background: '#e0e7ff', color: '#4f46e5', padding: '0.1rem 0.4rem', borderRadius: '4px', marginLeft: '0.3rem' }}>2.0</span>
          </div>
        </Link>
      </div>

      {/* Global Search Bar */}
      <div style={{ flex: 1, maxWidth: '480px', margin: '0 1.5rem' }}>
        <div 
          onClick={() => setIsSearchOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '0.5rem 0.9rem',
            cursor: 'pointer',
            color: '#64748b',
            fontSize: '0.875rem'
          }}
        >
          <Search size={16} />
          <span style={{ flex: 1 }}>Search faculty, classrooms, notices, resources...</span>
          <kbd style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '0.1rem 0.35rem', fontSize: '0.7rem', color: '#64748b' }}>Ctrl K</kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Theme Switcher Button */}
        <ThemeSwitcher />

        {user ? (
          <>
            {/* Quick Role Badge Indicator */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <Shield size={14} color="var(--primary)" />
                <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {showUserDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '210px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '0.5rem',
                  zIndex: 200
                }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', padding: '0.35rem 0.5rem', textTransform: 'uppercase' }}>
                    Quick Demo Switcher
                  </div>
                  <button onClick={() => handleSwitchDemo('student')} style={dropdownItemStyle}>
                    <span>🎓 Student Mode</span>
                    {user.role === 'student' && <Check size={14} color="var(--success)" />}
                  </button>
                  <button onClick={() => handleSwitchDemo('faculty')} style={dropdownItemStyle}>
                    <span>👨‍🏫 Faculty Mode</span>
                    {user.role === 'faculty' && <Check size={14} color="var(--success)" />}
                  </button>
                  <button onClick={() => handleSwitchDemo('admin')} style={dropdownItemStyle}>
                    <span>👑 Admin Mode</span>
                    {user.role === 'admin' && <Check size={14} color="var(--success)" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={handleMarkRead}
                style={{
                  position: 'relative',
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--bg-card)'
                }}
              >
                <Bell size={18} color="var(--text-main)" />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '120%',
                  width: '320px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-lg)',
                  padding: '1rem',
                  zIndex: 200,
                  maxHeight: '380px',
                  overflowY: 'auto'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>Notifications</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notifications.length} total</span>
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', textAlign: 'center', padding: '1rem' }}>No notifications yet.</div>
                  ) : (
                    notifications.slice(0, 5).map(n => (
                      <div key={n.id} onClick={() => { setShowNotifDropdown(false); navigate(n.link || '#'); }} style={{
                        padding: '0.65rem 0',
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer'
                      }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>{n.title}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{n.message}</div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar / User Details */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '0.5rem' }}>
              <img 
                src={user.avatar || 'https://i.pravatar.cc/150'} 
                alt={user.name} 
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{user.email}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={logout}
              title="Logout"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: '1px solid var(--danger-bg)',
                background: 'var(--danger-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '0.25rem'
              }}
            >
              <LogOut size={16} color="var(--danger)" />
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        )}
      </div>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}

const dropdownItemStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.5rem 0.65rem',
  fontSize: '0.825rem',
  fontWeight: 500,
  color: '#0f172a',
  borderRadius: '6px',
  cursor: 'pointer',
  textAlign: 'left'
};
