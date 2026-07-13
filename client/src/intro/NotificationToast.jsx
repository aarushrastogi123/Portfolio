import { motion } from 'framer-motion';

/**
 * NotificationToast — appears at top-right of screen.
 * Mimics a premium iOS/macOS notification.
 * Exits smoothly before the envelope appears.
 */
export default function NotificationToast() {
  return (
    <motion.div
      className="notification-positioner"
      initial={{ opacity: 0, y: -28, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.94, transition: { duration: 0.28, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.8 }}
    >
      <div className="notification-card">
        {/* Header row */}
        <div className="notification-header">
          <div className="notification-icon-box">📩</div>
          <div className="notification-title-group">
            <span className="notification-title">New Message</span>
            <span className="notification-app-name">Portfolio · Just now</span>
          </div>
          <div className="notification-live-dot" />
        </div>

        <div className="notification-divider" />

        {/* From / Subject rows */}
        <div className="notification-row">
          <span className="notification-label">From</span>
          <span className="notification-value">Aarush Rastogi</span>
        </div>
        <div className="notification-row">
          <span className="notification-label">Subject</span>
          <span className="notification-value">A Letter of Introduction</span>
        </div>
      </div>
    </motion.div>
  );
}
