import React, { useState } from 'react';
import { BookOpen, Lightbulb, Tag, Edit3, Trash2, Plus, Calendar, User } from 'lucide-react';

export default function BlogList({
  blogs,
  events,
  users,
  activeUserId,
  onOpenCreateBlog,
  onEditBlog,
  onDeleteBlog
}) {
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'mine'

  const filteredBlogs = filterMode === 'mine'
    ? blogs.filter(b => Number(b.userId) === Number(activeUserId))
    : blogs;

  const getEventName = (destId) => {
    const evt = events.find(e => e.id === destId);
    return evt ? evt.title : 'General Memory';
  };

  const getUserName = (usrId) => {
    const usr = users.find(u => u.id === Number(usrId));
    return usr ? usr.name : 'Anonymous Writer';
  };

  return (
    <div>
      {/* Header */}
      <div className="hero-header">
        <div className="hero-title-area">
          <h1>Travel <span className="gradient-text">Blogs & Guides</span></h1>
          <p>Read experiences, secret travel tips, and stories shared by travelers.</p>
        </div>

        <div className="action-btn-group">
          <div className="nav-tabs" style={{ marginRight: '0.5rem' }}>
            <button
              className={`nav-tab-btn ${filterMode === 'all' ? 'active' : ''}`}
              onClick={() => setFilterMode('all')}
            >
              All Articles
            </button>
            <button
              className={`nav-tab-btn ${filterMode === 'mine' ? 'active' : ''}`}
              onClick={() => setFilterMode('mine')}
            >
              My Posts
            </button>
          </div>

          <button className="btn btn-primary" onClick={onOpenCreateBlog}>
            <Plus size={18} />
            <span>Write Article</span>
          </button>
        </div>
      </div>

      {/* Blogs Grid */}
      {filteredBlogs.length === 0 ? (
        <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
          <BookOpen size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3>No Blog Articles Found</h3>
          <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem 0' }}>Be the first to share a travel story or tips guide!</p>
          <button className="btn btn-primary" onClick={onOpenCreateBlog}>
            <Plus size={18} />
            <span>Write First Article</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              style={{
                background: 'var(--bg-card)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'var(--transition-normal)'
              }}
            >
              {/* Top Event Tag */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)' }}>
                  {getEventName(blog.destinationId)}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <User size={12} />
                  {getUserName(blog.userId)}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '0.75rem' }}>
                {blog.title}
              </h3>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.25rem', flex: 1 }}>
                {blog.content}
              </p>

              {/* Travel Tips List */}
              {blog.travelTips && blog.travelTips.length > 0 && (
                <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    <Lightbulb size={14} />
                    <span>Travel Tips:</span>
                  </div>
                  <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--text-main)', fontSize: '0.825rem' }}>
                    {blog.travelTips.map((tip, idx) => (
                      <li key={idx} style={{ marginBottom: '2px' }}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="event-tags-list" style={{ marginBottom: '1rem' }}>
                  {blog.tags.map((t, idx) => (
                    <span key={idx} className="tag-item">#{t}</span>
                  ))}
                </div>
              )}

              {/* Card Action Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recently'}
                </span>

                {Number(blog.userId) === Number(activeUserId) && (
                  <div className="card-actions">
                    <button className="btn btn-secondary btn-icon-only" title="Edit Article" onClick={() => onEditBlog(blog)}>
                      <Edit3 size={15} />
                    </button>
                    <button className="btn btn-danger btn-icon-only" title="Delete Article" onClick={() => onDeleteBlog(blog.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
