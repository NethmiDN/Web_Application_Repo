import React, { useState } from 'react';
import { X, UploadCloud, FileImage, CheckCircle2 } from 'lucide-react';
import { mediaApi } from '../services/api';

export default function MediaUploader({
  isOpen,
  onClose,
  events,
  activeUserId,
  defaultDestinationId,
  onUploadSuccess,
  showToast
}) {
  const [file, setFile] = useState(null);
  const [destinationId, setDestinationId] = useState(defaultDestinationId || '');
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      showToast('Please select a photo file first', 'error');
      return;
    }
    setUploading(true);

    try {
      const res = await mediaApi.uploadPhoto(file, activeUserId, destinationId || null);
      showToast('Image uploaded successfully to Media Microservice!', 'success');
      if (onUploadSuccess) onUploadSuccess(res);
      onClose();
    } catch (err) {
      showToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Upload Media Asset</h3>
          <button className="btn btn-secondary btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleUpload}>
          <div className="modal-body">
            {/* File Dropzone */}
            <div
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.2)',
                cursor: 'pointer',
                marginBottom: '1.25rem',
                transition: 'var(--transition-fast)'
              }}
              onClick={() => document.getElementById('media-file-input').click()}
            >
              <input
                type="file"
                id="media-file-input"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <UploadCloud size={44} color="var(--accent-primary)" style={{ marginBottom: '0.75rem' }} />

              {file ? (
                <div style={{ color: 'var(--accent-emerald)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={18} />
                  <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              ) : (
                <>
                  <p style={{ fontWeight: 600, color: 'white', marginBottom: '0.3rem' }}>
                    Click to select an image file
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Supports JPG, PNG, WEBP up to 10MB (Stored via GCP / Local Disk)
                  </p>
                </>
              )}
            </div>

            {/* Optional Memory Event Link */}
            <div className="form-group">
              <label className="form-label">Link to Event (Optional)</label>
              <select
                className="form-select"
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
              >
                <option value="">General User Photo (No specific event)</option>
                {events.map(evt => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              <UploadCloud size={16} />
              <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
