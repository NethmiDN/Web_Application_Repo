import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Trash2, Send } from 'lucide-react';
import { reviewsApi } from '../services/api';

export default function ReviewSection({ destinationId, activeUserId, onRatingUpdated, showToast }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    if (!destinationId) return;
    const data = await reviewsApi.getReviewsForEvent(destinationId);
    setReviews(data || []);
  };

  useEffect(() => {
    fetchReviews();
  }, [destinationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);

    try {
      await reviewsApi.addReview(destinationId, {
        userId: Number(activeUserId),
        rating: Number(rating),
        comment
      });
      setComment('');
      setRating(5);
      showToast('Review submitted successfully!', 'success');
      await fetchReviews();
      if (onRatingUpdated) onRatingUpdated();
    } catch (err) {
      showToast('Failed to add review', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await reviewsApi.deleteReview(id);
      showToast('Review deleted', 'info');
      await fetchReviews();
      if (onRatingUpdated) onRatingUpdated();
    } catch (err) {
      showToast('Failed to delete review', 'error');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <MessageSquare size={20} color="var(--accent-cyan)" />
        <h4 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Reviews & Ratings ({reviews.length})</h4>
      </div>

      {/* Add Review Form */}
      <form onSubmit={handleSubmit} style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Your Rating:</span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={22}
                fill={star <= rating ? '#f59e0b' : 'none'}
                color={star <= rating ? '#f59e0b' : 'var(--text-dim)'}
                style={{ cursor: 'pointer', transition: 'var(--transition-fast)' }}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Write your review or thoughts..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Send size={16} />
            <span>Post</span>
          </button>
        </div>
      </form>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {reviews.length === 0 ? (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', fontStyle: 'italic' }}>No reviews yet. Be the first to leave a review!</p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-color)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyBinding: 'space-between',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={13} fill={s <= rev.rating ? '#f59e0b' : 'none'} color={s <= rev.rating ? '#f59e0b' : 'var(--text-dim)'} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Just now'}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.4' }}>{rev.comment}</p>
              </div>

              {Number(rev.userId) === Number(activeUserId) && (
                <button className="btn btn-danger btn-icon-only" style={{ width: 28, height: 28 }} title="Delete Review" onClick={() => handleDelete(rev.id)}>
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
