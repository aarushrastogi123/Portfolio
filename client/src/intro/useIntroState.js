import { useState, useEffect, useCallback } from 'react';

/**
 * Intro state machine.
 *
 * Flow:
 *  IDLE ──(0.8s)──▶ NOTIFICATION ──(2.6s)──▶ ENVELOPE
 *       ──(button click)──▶ OPENING ──(animation done)──▶ LETTER
 *       ──(Continue / 2s)──▶ TRANSITIONING ──(1.2s)──▶ DONE
 *
 * Skip shortcuts: ESC key or skip button jump directly to DONE.
 * Replay: dispatched via custom window event 'portfolio:replay-intro'.
 * Session persistence: after DONE, sessionStorage prevents re-showing.
 */

export const S = /** @type {const} */ ({
  IDLE: 'idle',
  NOTIFICATION: 'notification',
  ENVELOPE: 'envelope',
  OPENING: 'opening',
  LETTER: 'letter',
  TRANSITIONING: 'transitioning',
  DONE: 'done',
});

const STORAGE_KEY = 'portfolio_intro_v1';

export function useIntroState() {
  const alreadySeen = sessionStorage.getItem(STORAGE_KEY) === '1';
  const [state, setState] = useState(alreadySeen ? S.DONE : S.IDLE);

  // ── Listen for replay event (dispatched from NavDots) ──────────────
  useEffect(() => {
    const handleReplay = () => {
      sessionStorage.removeItem(STORAGE_KEY);
      setState(S.IDLE);
    };
    window.addEventListener('portfolio:replay-intro', handleReplay);
    return () => window.removeEventListener('portfolio:replay-intro', handleReplay);
  }, []);

  // ── IDLE → NOTIFICATION (automatic, 0.8s) ─────────────────────────
  useEffect(() => {
    if (state !== S.IDLE) return;
    const t = setTimeout(() => setState(S.NOTIFICATION), 800);
    return () => clearTimeout(t);
  }, [state]);

  // ── NOTIFICATION → ENVELOPE (automatic, 2.6s after notification) ──
  useEffect(() => {
    if (state !== S.NOTIFICATION) return;
    const t = setTimeout(() => setState(S.ENVELOPE), 2600);
    return () => clearTimeout(t);
  }, [state]);

  // ── Actions exposed to components ─────────────────────────────────

  /** Called when user clicks "Open Letter" */
  const openLetter = useCallback(() => {
    if (state === S.ENVELOPE) setState(S.OPENING);
  }, [state]);

  /** Called when envelope opening animation is fully done */
  const onEnvelopeOpenComplete = useCallback(() => {
    setState(S.LETTER);
  }, []);

  /** Called when user clicks "Continue" (or auto-transition timer fires) */
  const continueToPortfolio = useCallback(() => {
    setState(S.TRANSITIONING);
    const t = setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, '1');
      setState(S.DONE);
    }, 1300);
    return () => clearTimeout(t);
  }, []);

  /** Immediately jumps to DONE — ESC key / skip button */
  const skip = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setState(S.DONE);
  }, []);

  return {
    state,
    openLetter,
    onEnvelopeOpenComplete,
    continueToPortfolio,
    skip,
  };
}
