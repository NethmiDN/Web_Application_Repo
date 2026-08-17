import React from 'react';
import { Compass, BookOpen, Image, User, Plus, Wifi, WifiOff } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  users,
  activeUserId,
  setActiveUserId,
  isOnline,
  onOpenCreateEvent,
  onOpenCreateUser
}) {
  const activeUser = users.find(u => u.id === Number(activeUserId)) || users[0];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); setActiveTab('events'); }}>
          <div className="brand-icon">
            <Compass size={24} color="white" />
          </div>
          <div>
            <span>My</span><span className="gradient-text">Memories</span>
          </div>
        </a>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button
            className={`nav-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Compass size={18} />
            <span>Memories</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'blogs' ? 'active' : ''}`}
            onClick={() => setActiveTab('blogs')}
          >
            <BookOpen size={18} />
            <span>Blogs</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <Image size={18} />
            <span>Media</span>
          </button>

          <button
            className={`nav-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>Profile</span>
          </button>
        </div>

        {/* Right Status & User Switcher */}
        <div className="user-status-area">
          {/* API Gateway Status Badge */}
          <div className={`status-badge ${isOnline ? '' : 'offline'}`} title={isOnline ? "Connected to Spring Cloud API Gateway (:8080)" : "API Gateway offline. Running in live mock fallback mode."}>
            <span className="status-dot"></span>
            {isOnline ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span>{isOnline ? 'Gateway Live' : 'Offline Mode'}</span>
          </div>

          {/* User Selector Dropdown */}
          <div className="user-selector">
            <div className="avatar-sm">
              {activeUser?.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <select
              value={activeUserId || ''}
              onChange={(e) => setActiveUserId(Number(e.target.value))}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {users.map(u => (
                <option key={u.id} value={u.id} style={{ background: '#0f1522', color: 'white' }}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Create User Button if no users */}
          <button className="btn btn-secondary btn-icon-only" title="Register New User" onClick={onOpenCreateUser}>
            <Plus size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
