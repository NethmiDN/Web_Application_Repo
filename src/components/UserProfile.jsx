import React, { useState, useEffect } from 'react';
import { User as UserIcon, Heart, MapPin, Plus, Trash2, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { usersApi } from '../services/api';

export default function UserProfile({
  activeUserId,
  users,
  events,
  onUserCreated,
  showToast
}) {
  const activeUser = users.find(u => u.id === Number(activeUserId)) || users[0];

  const [favorites, setFavorites] = useState([]);
  const [visited, setVisited] = useState([]);

  // Add Visited Place state
  const [showAddVisited, setShowAddVisited] = useState(false);
  const [placeName, setPlaceName] = useState('');
  const [country, setCountry] = useState('');
  const [visitedDate, setVisitedDate] = useState('');

  // Register New User state
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const fetchUserData = async () => {
    if (!activeUserId) return;
    const favs = await usersApi.getFavorites(activeUserId);
    const vists = await usersApi.getVisitedPlaces(activeUserId);
    setFavorites(favs || []);
    setVisited(vists || []);
  };

  useEffect(() => {
    fetchUserData();
  }, [activeUserId]);

  const handleRemoveFav = async (favId) => {
    try {
      await usersApi.removeFavorite(favId);
      showToast('Removed from Favorites', 'info');
      await fetchUserData();
    } catch (err) {
      showToast('Failed to remove favorite', 'error');
    }
  };

  const handleAddVisited = async (e) => {
    e.preventDefault();
    if (!placeName) return;

    try {
      await usersApi.addVisitedPlace(activeUserId, {
        placeName,
        country,
        visitedDate: visitedDate || new Date().toISOString().split('T')[0]
      });
      showToast('Visited place logged!', 'success');
      setPlaceName('');
      setCountry('');
      setVisitedDate('');
      setShowAddVisited(false);
      await fetchUserData();
    } catch (err) {
      showToast('Failed to log visited place', 'error');
    }
  };

  const handleRemoveVisited = async (placeId) => {
    try {
      await usersApi.removeVisitedPlace(placeId);
      showToast('Removed visited place', 'info');
      await fetchUserData();
    } catch (err) {
      showToast('Failed to delete visited place', 'error');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    try {
      const created = await usersApi.createUser({ name: newName, email: newEmail });
      showToast(`User profile created for ${created.name}!`, 'success');
      setNewName('');
      setNewEmail('');
      setShowCreateUserModal(false);
      if (onUserCreated) onUserCreated(created);
    } catch (err) {
      showToast('Failed to create user', 'error');
    }
  };

  const getFavoriteEventName = (destId) => {
    const evt = events.find(e => e.id === destId);
    return evt ? `${evt.title} (${evt.location})` : destId;
  };

  return (
    <div>
      {/* Profile Header Banner */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'white', boxShadow: 'var(--shadow-glow)' }}>
              {activeUser?.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '0.3rem' }}>
                {activeUser?.name || 'User Profile'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={15} color="var(--accent-cyan)" />
                  {activeUser?.email || 'N/A'}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserIcon size={15} color="var(--accent-primary)" />
                  User ID: #{activeUser?.id || 1}
                </span>
              </div>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => setShowCreateUserModal(true)}>
            <Plus size={18} />
            <span>New User Profile</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Favorites Section */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Heart size={22} color="var(--accent-rose)" fill="rgba(244,63,94,0.2)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Favorite Destinations ({favorites.length})</h3>
          </div>

          {favorites.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              No favorites saved yet. Click the heart icon on memory cards to bookmark!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {favorites.map(fav => (
                <div key={fav.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600 }}>
                    {getFavoriteEventName(fav.destinationId)}
                  </span>
                  <button className="btn btn-danger btn-icon-only" style={{ width: 30, height: 30 }} onClick={() => handleRemoveFav(fav.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visited Places Section */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={22} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Visited Places ({visited.length})</h3>
            </div>

            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setShowAddVisited(!showAddVisited)}>
              <Plus size={14} />
              <span>Log Place</span>
            </button>
          </div>

          {/* Add Visited Form inline */}
          {showAddVisited && (
            <form onSubmit={handleAddVisited} style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                <input type="text" className="form-input" placeholder="Place / Landmark Name" value={placeName} onChange={(e) => setPlaceName(e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <input type="text" className="form-input" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                <input type="date" className="form-input" value={visitedDate} onChange={(e) => setVisitedDate(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.5rem' }}>Save Visited Place</button>
            </form>
          )}

          {visited.length === 0 ? (
            <p style={{ color: 'var(--text-dim)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              No visited places logged yet. Click "Log Place" to record your travel history.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {visited.map(v => (
                <div key={v.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.9rem', color: 'white', fontWeight: 600, display: 'block' }}>{v.placeName}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{v.country} {v.visitedDate ? `• ${v.visitedDate}` : ''}</span>
                  </div>
                  <button className="btn btn-danger btn-icon-only" style={{ width: 30, height: 30 }} onClick={() => handleRemoveVisited(v.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Register User Modal */}
      {showCreateUserModal && (
        <div className="modal-overlay" onClick={() => setShowCreateUserModal(false)}>
          <div className="modal-content" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create User Profile</h3>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Alex Mercer" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" placeholder="e.g. alex@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateUserModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
