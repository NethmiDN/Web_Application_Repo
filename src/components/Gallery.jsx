import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, UploadCloud, Calendar, User, Eye, X } from 'lucide-react';
import { mediaApi } from '../services/api';

export default function Gallery({
  activeUserId,
  events,
  onOpenUploader
}) {
  const [photos, setPhotos] = useState([]);
  const [filterMode, setFilterMode] = useState('user'); // 'user' or 'all'
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchPhotos = async () => {
    if (filterMode === 'user' && activeUserId) {
      const data = await mediaApi.getPhotosByUser(activeUserId);
      setPhotos(data || []);
    } else {
      // Fetch user photos as fallback
      const data = await mediaApi.getPhotosByUser(activeUserId);
      setPhotos(data || []);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [activeUserId, filterMode]);

  const getEventTitle = (destId) => {
    if (!destId) return 'Personal Upload';
    const evt = events.find(e => e.id === destId);
    return evt ? evt.title : destId;
  };

  return (
    <div>
      {/* Header */}
      <div className="hero-header">
        <div className="hero-title-area">
          <h1>Cloud <span className="gradient-text">Media Vault</span></h1>
          <p>Uploaded travel photos saved directly to microservice storage.</p>
        </div>

        <div className="action-btn-group">
          <div className="nav-tabs" style={{ marginRight: '0.5rem' }}>
            <button
              className={`nav-tab-btn ${filterMode === 'user' ? 'active' : ''}`}
              onClick={() => setFilterMode('user')}
            >
              My Photos
            </button>
            <button
              className={`nav-tab-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All Assets
            </button>
          </div>

          <button className="btn btn-primary" onClick={() => onOpenUploader()}>
            <UploadCloud size={18} />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div style={{ background: 'var(--bg-card)', padding: '3.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <ImageIcon size={52} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3>No Media Uploaded Yet</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>
            Upload travel photos to store them safely via GCP Cloud Storage SDK.
          </p>
          <button className="btn btn-primary" onClick={() => onOpenUploader()}>
            <UploadCloud size={18} />
            <span>Upload First Photo</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {photos.map((photo) => (
            <div
              key={photo.id}
              style={{
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                position: 'relative',
                transition: 'var(--transition-normal)'
              }}
              className="event-card"
            >
              <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={photo.photoUrl}
                  alt={photo.fileName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  className="btn btn-secondary btn-icon-only"
                  style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.6)' }}
                  onClick={() => setSelectedPhoto(photo)}
                  title="View Fullsize"
                >
                  <Eye size={16} />
                </button>
              </div>

              <div style={{ padding: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                  {getEventTitle(photo.destinationId)}
                </span>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, margin: '0.5rem 0 0.3rem 0', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {photo.fileName}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Uploaded {photo.uploadedAt ? new Date(photo.uploadedAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content" style={{ maxWidth: '800px', background: 'rgba(5, 8, 15, 0.95)' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedPhoto.fileName}</h3>
              <button className="btn btn-secondary btn-icon-only" onClick={() => setSelectedPhoto(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center' }}>
              <img
                src={selectedPhoto.photoUrl}
                alt={selectedPhoto.fileName}
                style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 'var(--radius-md)', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
