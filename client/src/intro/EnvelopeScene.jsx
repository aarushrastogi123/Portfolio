import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from './SoundManager';

/**
 * EnvelopeScene — perf-optimised version.
 *
 * Mouse tracking now uses a requestAnimationFrame loop that writes
 * CSS custom properties directly to the DOM element — zero React re-renders.
 * Removed useMotionValue / useTransform (they schedule RAF internally but also
 * trigger React reconciliation for every frame on some Framer builds).
 */
export default function EnvelopeScene({ recipientName, state, onOpenLetter, onOpenComplete }) {
  const isOpening = state === 'opening';

  const [flapOpen, setFlapOpen] = useState(false);
  const [paperOut, setPaperOut] = useState(false);
  const [bodyFade, setBodyFade] = useState(false);

  const envelopeRef  = useRef(null);
  const innerRef     = useRef(null);  // the .envelope div we apply rotations to
  const rafRef       = useRef(null);
  const mouseRef     = useRef({ mx: 0.5, my: 0.3, active: false });

  // ── RAF-based tilt + specular (zero re-renders) ───────────────────────────
  useEffect(() => {
    if (isOpening) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      const el = innerRef.current;
      if (!el) return;
      const { mx, my, active } = mouseRef.current;
      if (active) {
        const ry =  (mx - 0.5) * 14;   // -7 … +7 deg
        const rx = -(my - 0.3) * 10;   //  5 … -5 deg
        el.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isOpening]);

  const handleMouseMove = useCallback((e) => {
    if (isOpening || !envelopeRef.current) return;
    const rect = envelopeRef.current.getBoundingClientRect();
    mouseRef.current = {
      mx: (e.clientX - rect.left) / rect.width,
      my: (e.clientY - rect.top)  / rect.height,
      active: true,
    };
  }, [isOpening]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { mx: 0.5, my: 0.3, active: false };
    if (innerRef.current) innerRef.current.style.transform = '';
  }, []);

  // ── Opening sequence ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpening) {
      setFlapOpen(false);
      setPaperOut(false);
      setBodyFade(false);
      return;
    }

    const t1 = setTimeout(() => {
      setFlapOpen(true);
      soundManager.playEnvelopeOpen();
    }, 320);
    const t2 = setTimeout(() => {
      setPaperOut(true);
      soundManager.playPaperUnfold();
    }, 960);
    const t3 = setTimeout(() => setBodyFade(true), 1480);
    const t4 = setTimeout(() => onOpenComplete?.(), 1900);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [isOpening, onOpenComplete]);

  return (
    <motion.div
      className="envelope-scene-wrapper"
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.96, transition: { duration: 0.3, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 0.9 }}
    >
      {/* ── Envelope ── */}
      <motion.div
        className="envelope-perspective"
        ref={envelopeRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={isOpening ? { y: -22, scale: 1.04 } : { y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Floating motion — only while idle */}
        <motion.div
          className="envelope"
          ref={innerRef}
          animate={isOpening ? {} : { y: [0, -10, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* ── Body ── */}
          <motion.div
            className="envelope-body"
            animate={bodyFade ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="env-paper-base" />
            {/* env-grain hidden via CSS — SVG feTurbulence removed for perf */}
            <div className="env-grain" />

            <div className="env-fold-overlay" />
            <div className="env-fold-left" />
            <div className="env-fold-right" />
            <div className="env-fold-bottom" />

            {/* Address */}
            <div className="envelope-content">
              <div className="envelope-address-stack">
                <div className="envelope-address-block">
                  <span className="env-addr-label">To</span>
                  <span className="env-addr-name">{recipientName}</span>
                </div>
                <div className="envelope-address-block">
                  <span className="env-addr-label">From</span>
                  <span className="env-addr-name">Aarush Rastogi</span>
                </div>
              </div>
            </div>

            <div className="envelope-stamp">🖋</div>
            <div className="envelope-bottom-accent" />

            {/* Paper peeking out */}
            <motion.div
              className="paper-peek"
              initial={{ y: '100%', opacity: 0 }}
              animate={paperOut ? { y: '-55%', opacity: 1 } : { y: '100%', opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>

          {/* ── Flap ── */}
          <motion.div
            className="envelope-flap-root"
            style={{ transformOrigin: '50% 0%', transformPerspective: '900px' }}
            animate={{ rotateX: flapOpen ? -180 : 0 }}
            transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="env-flap-front" />
            <div className="env-flap-back" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── CTA ── */}
      <AnimatePresence>
        {state === 'envelope' && (
          <motion.div
            className="envelope-cta"
            key="cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8, transition: { duration: 0.2 } }}
            transition={{ delay: 0.35, duration: 0.45, ease: 'easeOut' }}
          >
            <p className="envelope-subtitle-text">You've received a personal message.</p>
            <button className="btn-open-letter" onClick={onOpenLetter}>
              <span>Open Letter</span>
              <span className="btn-ol-arrow" aria-hidden="true">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
