import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import EventCard from './components/EventCard';
import EventModal from './components/EventModal';
import EventDetailModal from './components/EventDetailModal';
import BlogList from './components/BlogList';
import BlogModal from './components/BlogModal';
import MediaUploader from './components/MediaUploader';
import Gallery from './components/Gallery';
import UserProfile from './components/UserProfile';
import Toast from './components/Toast';

import {
  usersApi,
  eventsApi,
  blogsApi,
  checkGatewayStatus
} from './services/api';

import { Search, Plus, Compass, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('events');
  const [isOnline, setIsOnline] = useState(true);

  // Core App Data States
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState(1);
  const [events, setEvents] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  // Modals state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);

  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState(null);

  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [uploaderDefaultEventId, setUploaderDefaultEventId] = useState(null);

  // Toast State
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Initial Load & Refresh
  const refreshData = async () => {
    const online = await checkGatewayStatus();
    setIsOnline(online);

    // Fetch users
    const fetchedUsers = await usersApi.getUsers();
    setUsers(fetchedUsers || []);
    if (fetchedUsers && fetchedUsers.length > 0 && !activeUserId) {
      setActiveUserId(fetchedUsers[0].id);
    }

    // Fetch events
    const fetchedEvents = await eventsApi.getEvents();
    setEvents(fetchedEvents || []);

    // Fetch blogs
    const fetchedBlogs = await blogsApi.getBlogsByEvent('');
    setBlogs(fetchedBlogs || []);
  };

  const fetchUserFavorites = async () => {
    if (!activeUserId) return;
    const favs = await usersApi.getFavorites(activeUserId);
    setUserFavorites(favs || []);
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    fetchUserFavorites();
  }, [activeUserId]);

  // --- CRUD EVENT HANDLERS ---
  const handleSaveEvent = async (payload, editId) => {
    try {
      if (editId) {
        await eventsApi.updateEvent(editId, payload);
        showToast('Memory Event updated successfully!', 'success');
      } else {
        await eventsApi.createEvent(payload);
        showToast('New Memory Event created!', 'success');
      }
      refreshData();
    } catch (err) {
      showToast('Failed to save memory event', 'error');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this memory event?')) return;
    try {
      await eventsApi.deleteEvent(id);
      showToast('Memory Event deleted', 'info');
      refreshData();
    } catch (err) {
      showToast('Failed to delete event', 'error');
    }
  };

  const handleToggleFavorite = async (destinationId) => {
    const existing = userFavorites.find(f => f.destinationId === destinationId);
    try {
      if (existing) {
        await usersApi.removeFavorite(existing.id);
        showToast('Removed from Favorites', 'info');
      } else {
        await usersApi.addFavorite(activeUserId, destinationId);
        showToast('Added to Favorites!', 'success');
      }
      fetchUserFavorites();
    } catch (err) {
      showToast('Failed to update favorite', 'error');
    }
  };

  // --- CRUD BLOG HANDLERS ---
  const handleSaveBlog = async (payload, editId) => {
    try {
      if (editId) {
        await blogsApi.updateBlog(editId, payload);
        showToast('Blog article updated!', 'success');
      } else {
        await blogsApi.createBlog(payload);
        showToast('Blog article published!', 'success');
      }
      refreshData();
    } catch (err) {
      showToast('Failed to save blog post', 'error');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await blogsApi.deleteBlog(id);
      showToast('Blog article deleted', 'info');
      refreshData();
    } catch (err) {
      showToast('Failed to delete blog post', 'error');
    }
  };

  // Filtered Events
  const allTags = Array.from(
    new Set(events.flatMap(e => e.tags || []))
  );

  const filteredEvents = events.filter(e => {
    const matchesSearch = searchQuery === '' ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.country && e.country.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === '' || (e.tags && e.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  return (
    <div>
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        users={users}
        activeUserId={activeUserId}
        setActiveUserId={setActiveUserId}
        isOnline={isOnline}
        onOpenCreateEvent={() => { setEventToEdit(null); setIsEventModalOpen(true); }}
        onOpenCreateUser={() => setActiveTab('profile')}
      />

      {/* Main Content Area */}
      <main className="app-container">
        {/* TAB 1: MEMORIES / EVENTS */}
        {activeTab === 'events' && (
          <div>
            {/* Hero Header */}
            <div className="hero-header">
              <div className="hero-title-area">
                <h1>Capture Your <span className="gradient-text">Unforgettable Memories</span></h1>
                <p>Log travel destinations, upload photos to Google Cloud, and keep track of your journey.</p>
              </div>

              <div className="action-btn-group">
                <button
                  className="btn btn-primary"
                  onClick={() => { setEventToEdit(null); setIsEventModalOpen(true); }}
                >
                  <Plus size={18} />
                  <span>Create Memory</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="filter-bar">
              <div className="search-input-wrapper">
                <Search size={18} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search memories by title, city, or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Tag Pills */}
              <div className="tag-pills-container">
                <button
                  className={`tag-pill ${selectedTag === '' ? 'active' : ''}`}
                  onClick={() => setSelectedTag('')}
                >
                  All Tags
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-pill ${selectedTag === tag ? 'active' : ''}`}
                    onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Grid */}
            {filteredEvents.length === 0 ? (
              <div style={{ background: 'var(--bg-card)', padding: '3.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                <Compass size={52} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
                <h3>No Memories Found</h3>
                <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>
                  {searchQuery || selectedTag ? 'No events matched your search filter.' : 'Start logging your travel memories now!'}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => { setEventToEdit(null); setIsEventModalOpen(true); }}
                >
                  <Plus size={18} />
                  <span>Create First Memory</span>
                </button>
              </div>
            ) : (
              <div className="cards-grid">
                {filteredEvents.map(evt => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    isFavorite={userFavorites.some(f => f.destinationId === evt.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectEvent={(e) => { setSelectedEventDetail(e); setIsEventDetailOpen(true); }}
                    onEditEvent={(e) => { setEventToEdit(e); setIsEventModalOpen(true); }}
                    onDeleteEvent={handleDeleteEvent}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BLOGS */}
        {activeTab === 'blogs' && (
          <BlogList
            blogs={blogs}
            events={events}
            users={users}
            activeUserId={activeUserId}
            onOpenCreateBlog={() => { setBlogToEdit(null); setIsBlogModalOpen(true); }}
            onEditBlog={(b) => { setBlogToEdit(b); setIsBlogModalOpen(true); }}
            onDeleteBlog={handleDeleteBlog}
          />
        )}

        {/* TAB 3: MEDIA GALLERY */}
        {activeTab === 'gallery' && (
          <Gallery
            activeUserId={activeUserId}
            events={events}
            onOpenUploader={(evtId) => {
              setUploaderDefaultEventId(evtId || null);
              setIsUploaderOpen(true);
            }}
          />
        )}

        {/* TAB 4: PROFILE & ACTIVITY */}
        {activeTab === 'profile' && (
          <UserProfile
            activeUserId={activeUserId}
            users={users}
            events={events}
            onUserCreated={(newUsr) => {
              refreshData();
              setActiveUserId(newUsr.id);
            }}
            showToast={showToast}
          />
        )}
      </main>

      {/* --- MODAL DIALOGS --- */}

      {/* Event Create / Edit Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
        activeUserId={activeUserId}
      />

      {/* Event Details & Reviews Modal */}
      <EventDetailModal
        isOpen={isEventDetailOpen}
        onClose={() => setIsEventDetailOpen(false)}
        event={selectedEventDetail}
        activeUserId={activeUserId}
        onOpenUploader={(evtId) => {
          setUploaderDefaultEventId(evtId);
          setIsUploaderOpen(true);
        }}
        showToast={showToast}
      />

      {/* Blog Create / Edit Modal */}
      <BlogModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        onSave={handleSaveBlog}
        blogToEdit={blogToEdit}
        events={events}
        activeUserId={activeUserId}
      />

      {/* Media Uploader Modal */}
      <MediaUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        events={events}
        activeUserId={activeUserId}
        defaultDestinationId={uploaderDefaultEventId}
        onUploadSuccess={() => refreshData()}
        showToast={showToast}
      />

      {/* Floating Toast Alerts */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
