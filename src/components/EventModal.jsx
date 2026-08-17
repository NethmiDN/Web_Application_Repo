import React, { useState, useEffect } from 'react';
import { X, MapPin, Tag, FileText, Globe } from 'lucide-react';

export default function EventModal({ isOpen, onClose, onSave, eventToEdit, activeUserId }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title || '');
      setLocation(eventToEdit.location || '');
      setCountry(eventToEdit.country || '');
      setDescription(eventToEdit.description || '');
      setTagsInput(eventToEdit.tags ? eventToEdit.tags.join(', ') : '');
    } else {
      setTitle('');
      setLocation('');
      setCountry('');
      setDescription('');
      setTagsInput('');
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    const payload = {
      title,
      location,
      country,
      description,
      tags: tagsArray,
      createdBy: Number(activeUserId)
    };

    onSave(payload, eventToEdit ? eventToEdit.id : null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{eventToEdit ? 'Edit Memory Event' : 'Create Memory Event'}</h3>
          <button className="btn btn-secondary btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Event / Memory Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Hiking Mount Rainier"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Location / City</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ella"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sri Lanka"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Memory Description</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Share what made this memory special..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. hiking, scenic, beach, budget"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {eventToEdit ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
