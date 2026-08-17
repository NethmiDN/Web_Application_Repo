import React, { useState, useEffect } from 'react';
import { X, BookOpen, Tag, Lightbulb } from 'lucide-react';

export default function BlogModal({
  isOpen,
  onClose,
  onSave,
  blogToEdit,
  events,
  activeUserId
}) {
  const [destinationId, setDestinationId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [travelTipsInput, setTravelTipsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (blogToEdit) {
      setDestinationId(blogToEdit.destinationId || '');
      setTitle(blogToEdit.title || '');
      setContent(blogToEdit.content || '');
      setTravelTipsInput(blogToEdit.travelTips ? blogToEdit.travelTips.join(', ') : '');
      setTagsInput(blogToEdit.tags ? blogToEdit.tags.join(', ') : '');
    } else {
      setDestinationId(events.length > 0 ? events[0].id : '');
      setTitle('');
      setContent('');
      setTravelTipsInput('');
      setTagsInput('');
    }
  }, [blogToEdit, isOpen, events]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const tipsArray = travelTipsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const tagsArray = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(t => t.length > 0);

    const payload = {
      destinationId,
      userId: Number(activeUserId),
      title,
      content,
      travelTips: tipsArray,
      tags: tagsArray
    };

    onSave(payload, blogToEdit ? blogToEdit.id : null);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{blogToEdit ? 'Edit Blog Post' : 'Write Travel Blog'}</h3>
          <button className="btn btn-secondary btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Link to Memory Event</label>
              <select
                className="form-select"
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                required
              >
                <option value="" disabled>Select an Event...</option>
                {events.map(evt => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Article Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ultimate 3-Day Hiking Guide"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Article Content</label>
              <textarea
                className="form-textarea"
                rows={6}
                placeholder="Share your detailed travel experience, stories, and recommendations..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Travel Tips (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Wear waterproof boots, Pack rain poncho, Start early"
                value={travelTipsInput}
                onChange={(e) => setTravelTipsInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tags (comma separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. guide, trekking, budgeting"
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
              {blogToEdit ? 'Save Article' : 'Publish Blog'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
