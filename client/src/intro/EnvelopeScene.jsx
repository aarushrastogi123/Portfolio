import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { soundManager } from './SoundManager';

/**
 * EnvelopeScene
 *
 * Renders the premium 3-D envelope with:
 *   - Gentle floating animation
 *   - Mouse-tracking specular highlight + subtle tilt
 *   - Animated flap opening (CSS 3D rotateX via Framer Motion)
 *   - Paper emerging from envelope
 *   - "Open Letter" CTA
 *
 * Props:
 *   recipientName  — string displayed in the "TO:" field
 *   state          — 'envelope' | 'opening'
 *   onOpenLetter   — called when button is clicked
 *   onOpenComplete — called when entire open animation sequence finishes
 */
export default function EnvelopeScene({ recipientName, state, onOpenLetter, onOpenComplete }) {
  const isOpening = state === 'opening';

  // Internal animation phases during the opening sequence
  const [flapOpen, setFlapOpen]     = useState(false);
  const [paperOut, setPaperOut]     = useState(false);
  const [bodyFade, setBodyFade]     = useState(false);

  // Mouse-tracking for specular highlight + tilt
  const envelopeRef   = useRef(null);
  const mx            = useMotionValue(0.5);  // 0–1, normalized
  const my            = useMotionValue(0.3);
  const rotateY       = useTransform(mx, [0, 1], [-7, 7]);
  const rotateX       = useTransform(my, [0, 1], [5, -5]);

  // Opening sequence: timed phases
  useEffect(() => {
    if (!isOpening) {
      setFlapOpen(false);
      setPaperOut(false);
      setBodyFade(false);
      return;
    }

    // 1. Flap opens (300 ms delay — envelope has already lifted via parent animation)
    const t1 = setTimeout(() => {
      setFlapOpen(true);
      soundManager.playEnvelopeOpen();
    }, 320);

    // 2. Paper slides out
    const t2 = setTimeout(() => {
      setPaperOut(true);
      soundManager.playPaperUnfold();
    }, 960);

    // 3. Envelope body fades out as paper fills screen
    const t3 = setTimeout(() => setBodyFade(true), 1480);

    // 4. Signal parent — transition to LETTER state
    const t4 = setTimeout(() => onOpenComplete?.(), 1900);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [isOpening, onOpenComplete]);

  // Mouse-move handler for 3-D tilt + specular
  const handleMouseMove = useCallback((e) => {
    if (isOpening || !envelopeRef.current) return;
    const rect = envelopeRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top)  / rect.height);
  }, [isOpening, mx, my]);

  const handleMouseLeave = useCallback(() => {
    mx.set(0.5);
    my.set(0.3);
  }, [mx, my]);

  // CSS vars for specular (passed as inline style)
  const mxPct = useTransform(mx, v => v * 100);
  const myPct = useTransform(my, v => v * 100);

  return (
    <motion.div
      className="envelope-scene-wrapper"
      initial={{ opacity: 0, y: 30, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.96, transition: { duration: 0.3, ease: 'easeIn' } }}
      transition={{ type: 'spring', stiffness: 200, damping: 24, mass: 0.9 }}
    >
      {/* ── The envelope ── */}
      <motion.div
        className="envelope-perspective"
        ref={envelopeRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        // Lift + scale during opening
        animate={isOpening
          ? { y: -22, scale: 1.04 }
          : { y: 0,   scale: 1    }
        }
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="envelope"
          style={{ rotateX, rotateY }}
          // Gentle floating (stops when opening begins)
          animate={isOpening
            ? {}
            : { y: [0, -10, 0] }
          }
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* ── Body ── */}
          <motion.div
            className="envelope-body"
            animate={bodyFade ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="env-paper-base" />
            <div className="env-grain" />

            {/* Specular highlight following mouse */}
            <motion.div
              className="env-specular"
              style={{
                '--mx': mxPct,
                '--my': myPct,
              }}
            />

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
              animate={
                paperOut
                  ? { y: '-55%', opacity: 1 }
                  : { y: '100%', opacity: 0 }
              }
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>

          {/* ── Flap ── */}
          <motion.div
            className="envelope-flap-root"
            style={{ transformOrigin: '50% 0%', transformPerspective: '900px' }}
            animate={{ rotateX: flapOpen ? -180 : 0 }}
            transition={{
              duration: 0.85,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div className="env-flap-front" />
            <div className="env-flap-back" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── CTA below envelope ── */}
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
            <p className="envelope-subtitle-text">
              You've received a personal message.
            </p>
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
