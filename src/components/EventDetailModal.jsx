import React, { useState, useEffect } from 'react';
import { X, MapPin, Star, Calendar, Image as ImageIcon, UploadCloud } from 'lucide-react';
import ReviewSection from './ReviewSection';
import { mediaApi } from '../services/api';

export default function EventDetailModal({
  event,
  isOpen,
  onClose,
  activeUserId,
  onOpenUploader,
  showToast
}) {
  const [photos, setPhotos] = useState([]);

  const fetchEventPhotos = async () => {
    if (!event) return;
    const data = await mediaApi.getPhotosByEvent(event.id);
    setPhotos(data || []);
  };

  useEffect(() => {
    if (event && isOpen) {
      fetchEventPhotos();
    }
  }, [event, isOpen]);

  if (!isOpen || !event) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
        {/* Banner Header */}
        <div className="event-card-header" style={{ height: '220px', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
          <div className="rating-badge" style={{ top: '1.25rem', right: '1.25rem' }}>
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span>{event.rating ? event.rating.toFixed(1) : 'New'}</span>
          </div>

          <button
            className="btn btn-secondary btn-icon-only"
            style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', zIndex: 10 }}
            onClick={onClose}
          >
            <X size={18} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              {event.title}
            </h2>
            <div className="location-sub" style={{ justifyContent: 'center', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              <MapPin size={15} />
              <span>{event.location}{event.country ? `, ${event.country}` : ''}</span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          {/* Description */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>About this Memory</h4>
            <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6' }}>{event.description}</p>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="event-tags-list" style={{ marginBottom: '1.5rem' }}>
              {event.tags.map((t, idx) => (
                <span key={idx} className="tag-item" style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}>
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Photos Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={18} color="var(--accent-cyan)" />
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Memory Gallery ({photos.length})</h4>
              </div>

              <button className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => onOpenUploader(event.id)}>
                <UploadCloud size={15} />
                <span>Upload Media</span>
              </button>
            </div>

            {photos.length === 0 ? (
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px dashed var(--border-color)' }}>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No photos attached to this memory yet.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.75rem' }}>
                {photos.map((p) => (
                  <div key={p.id} style={{ height: 100, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={p.photoUrl} alt={p.fileName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <ReviewSection
            destinationId={event.id}
            activeUserId={activeUserId}
            onRatingUpdated={fetchEventPhotos}
            showToast={showToast}
          />
        </div>
      </div>
    </div>
  );
}
