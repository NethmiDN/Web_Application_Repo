import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          {toast.type === 'success' && <CheckCircle2 size={18} color="var(--accent-emerald)" />}
          {toast.type === 'error' && <AlertCircle size={18} color="var(--accent-rose)" />}
          {toast.type === 'info' && <Info size={18} color="var(--accent-cyan)" />}
          
          <span style={{ flex: 1 }}>{toast.message}</span>

          <button
            onClick={() => onDismiss(toast.id)}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'flex', padding: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
