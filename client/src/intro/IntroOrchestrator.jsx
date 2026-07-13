import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntroState, S } from './useIntroState';
import { getRecipientName } from './useUrlParams';
import { soundManager } from './SoundManager';
import IntroBackground from './IntroBackground';
import NotificationToast from './NotificationToast';
import EnvelopeScene from './EnvelopeScene';
import LetterScene from './LetterScene';
import './intro.css';

// Computed once — doesn't change during session
const RECIPIENT = getRecipientName();

/**
 * IntroOrchestrator
 *
 * The top-level wrapper that:
 *   1. Manages the full intro state machine
 *   2. Renders the intro overlay (when applicable)
 *   3. ALWAYS renders the portfolio (children) so data loads in parallel
 *      — it's simply hidden (opacity 0, pointer-events none) during the intro
 *   4. Reveals the portfolio on TRANSITIONING / DONE
 *   5. Handles ESC-to-skip and sound toggle
 *   6. Exposes replay via custom event 'portfolio:replay-intro'
 */
export default function IntroOrchestrator({ children }) {
  const {
    state,
    openLetter,
    onEnvelopeOpenComplete,
    continueToPortfolio,
    skip,
  } = useIntroState();

  const [soundMuted, setSoundMuted] = useState(true);

  const isDone         = state === S.DONE;
  const isTransitioning = state === S.TRANSITIONING;
  const showIntro      = !isDone;

  // Portfolio should start appearing during transition
  const portfolioVisible = isDone || isTransitioning;

  // ── ESC to skip ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isDone) return;
    const onKey = (e) => { if (e.key === 'Escape') skip(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDone, skip]);

  // ── Sound toggle ─────────────────────────────────────────────────────────
  const handleSoundToggle = useCallback(() => {
    const muted = soundManager.toggle();
    setSoundMuted(muted);
  }, []);

  return (
    <>
      {/* ── Portfolio (always mounted — loads data immediately) ── */}
      <div
        style={{
          opacity: portfolioVisible ? 1 : 0,
          pointerEvents: isDone ? 'auto' : 'none',
          transition: 'opacity 0.55s 0.25s ease',
          position: 'relative',
          zIndex: 0,
        }}
      >
        {children}
      </div>

      {/* ── Intro Overlay ── */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="intro-overlay"
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeIn' } }}
          >
            <IntroBackground />

            {/* ── Controls (skip + sound) ── */}
            {state !== S.IDLE && (
              <motion.div
                className="intro-controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <button
                  className="intro-sound-btn"
                  onClick={handleSoundToggle}
                  title={soundMuted ? 'Enable sound' : 'Mute sound'}
                  aria-label={soundMuted ? 'Enable sound' : 'Mute sound'}
                >
                  {soundMuted ? '🔇' : '🔊'}
                </button>
                <button
                  className="intro-skip-btn"
                  onClick={skip}
                  aria-label="Skip intro"
                >
                  Skip intro ↓
                </button>
              </motion.div>
            )}

            {/* ── Animated content (notification → envelope → letter) ── */}
            <AnimatePresence mode="wait">

              {/* Notification */}
              {state === S.NOTIFICATION && (
                <NotificationToast key="notification" />
              )}

              {/* Envelope */}
              {(state === S.ENVELOPE || state === S.OPENING) && (
                <EnvelopeScene
                  key="envelope"
                  recipientName={RECIPIENT}
                  state={state}
                  onOpenLetter={openLetter}
                  onOpenComplete={onEnvelopeOpenComplete}
                />
              )}

              {/* Letter */}
              {(state === S.LETTER || state === S.TRANSITIONING) && (
                <LetterScene
                  key="letter"
                  recipientName={RECIPIENT}
                  state={state}
                  onContinue={continueToPortfolio}
                />
              )}

            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
