import { useEffect } from 'react';
import './ResumeModal.css';

const ResumeModal = ({ isOpen, onClose }) => {
  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="resume-backdrop" onClick={onClose}>
      <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="resume-modal-header">
          <span className="resume-modal-title">📄 Aarush Rastogi — Resume</span>
          <div className="resume-modal-actions">
            <a
              href="/Aarush_Rastogi.pdf"
              download="Aarush Rastogi Resume.pdf"
              className="resume-download-btn"
            >
              ⬇ Download
            </a>
            <button className="resume-close-btn" onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="resume-modal-body">
          <iframe
            src="/Aarush_Rastogi.pdf"
            title="Aarush Rastogi Resume"
            width="100%"
            height="100%"
            frameBorder="0"
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
