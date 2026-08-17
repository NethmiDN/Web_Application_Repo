import React from 'react';
import { Star, MapPin, Heart, Edit3, Trash2, ArrowRight } from 'lucide-react';

export default function EventCard({
  event,
  isFavorite,
  onToggleFavorite,
  onSelectEvent,
  onEditEvent,
  onDeleteEvent
}) {
  return (
    <div className="event-card">
      <div className="event-card-header">
        {/* Rating Badge */}
        <div className="rating-badge">
          <Star size={14} fill="#f59e0b" color="#f59e0b" />
          <span>{event.rating ? event.rating.toFixed(1) : 'New'}</span>
        </div>

        {/* Favorite Button Overlay */}
        <button
          className={`favorite-btn-overlay ${isFavorite ? 'is-fav' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(event.id);
          }}
          title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        >
          <Heart size={18} fill={isFavorite ? '#f43f5e' : 'none'} />
        </button>

        {/* Header Illustration */}
        <div style={{ textAlign: 'center', padding: '1rem' }}>
          <MapPin size={42} color="rgba(255,255,255,0.4)" />
        </div>
      </div>

      <div className="event-card-body">
        <div className="location-sub">
          <MapPin size={13} />
          <span>{event.location}{event.country ? `, ${event.country}` : ''}</span>
        </div>

        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="event-tags-list">
            {event.tags.map((tag, idx) => (
              <span key={idx} className="tag-item">
                #{tag.replace(/^#/, '')}
              </span>
            ))}
          </div>
        )}

        <div className="event-card-footer">
          <button className="btn btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }} onClick={() => onSelectEvent(event)}>
            <span>Details</span>
            <ArrowRight size={14} />
          </button>

          <div className="card-actions">
            <button className="btn btn-secondary btn-icon-only" title="Edit Memory" onClick={() => onEditEvent(event)}>
              <Edit3 size={16} />
            </button>
            <button className="btn btn-danger btn-icon-only" title="Delete Memory" onClick={() => onDeleteEvent(event.id)}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
