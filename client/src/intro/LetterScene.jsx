import { motion } from 'framer-motion';

/**
 * LetterScene
 *
 * Renders the luxury paper letter with handcrafted typography.
 * In 'letter' state:  comfortable reading size, Continue button visible.
 * In 'transitioning': paper scales up and fades, revealing portfolio beneath.
 *
 * Props:
 *   recipientName — personalised greeting name
 *   state         — 'letter' | 'transitioning'
 *   onContinue    — called when user clicks "Continue"
 */
export default function LetterScene({ recipientName, state, onContinue }) {
  const isTransitioning = state === 'transitioning';

  // Current date formatted as "July 13, 2026"
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      className="letter-scene-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* ── Paper Sheet ── */}
      <motion.div
        className="paper-sheet"
        initial={{ opacity: 0, scale: 0.88, y: 28 }}
        animate={
          isTransitioning
            ? {
                scale: 9,
                opacity: 0,
                transition: { duration: 0.75, ease: [0.4, 0, 0.8, 1] },
              }
            : {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: 'spring', stiffness: 180, damping: 22 },
              }
        }
      >
        {/* Visual paper texture elements */}
        <div className="paper-margin-line" aria-hidden="true" />
        <div className="paper-ruled-lines" aria-hidden="true" />

        {/* ── Letter Content ── */}
        <div className="paper-content">
          {/* Watermark monogram */}
          <div className="letter-monogram" aria-hidden="true">
            <div className="letter-monogram-text">AR</div>
            <div className="letter-mono-divider" />
          </div>

          <div className="letter-date">{dateStr}</div>

          <div className="letter-greeting">
            Dear {recipientName},
          </div>

          <div className="letter-body">
            <p>
              Thank you for taking the time to visit my portfolio.
            </p>
            <p>
              My name is Aarush Rastogi. I am an AI Engineer and
              Full Stack Developer passionate about building intelligent
              products that solve meaningful real-world problems.
            </p>
            <p>
              Every project inside this portfolio represents curiosity,
              persistence, creativity and countless hours of learning.
            </p>
            <p>
              Rather than simply listing technologies, I prefer letting
              my work tell the story.
            </p>
            <p>
              I hope you enjoy exploring it.
            </p>
          </div>

          <div className="letter-closing">
            <div className="letter-sincerely">Sincerely,</div>
            <div className="letter-signature">Aarush Rastogi</div>
            <div className="letter-sig-line" />
          </div>

          {/* Continue button — hidden during transition */}
          {!isTransitioning && (
            <motion.button
              className="btn-continue"
              onClick={onContinue}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4, ease: 'easeOut' }}
            >
              <span>Continue</span>
              <span className="btn-c-arrow" aria-hidden="true">→</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
