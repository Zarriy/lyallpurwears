// Page transition — an ink veil sweeps up to reveal each page, with the
// clocktower monogram held for a beat on a separate non-scaling layer so it
// never distorts. Content drifts in beneath it.
import { motion, useReducedMotion } from 'framer-motion';
import { LogoMark } from './Logo.jsx';

const EASE = [0.22, 1, 0.36, 1];

export function PageTransition({ children }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div style={{ position: 'relative' }}>
      {/* Page content drifts up as the veil lifts */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.35, ease: EASE } }}
        exit={{ opacity: 0, y: -18, transition: { duration: 0.35, ease: EASE } }}
      >
        {children}
      </motion.div>

      {/* Veil in — covers the outgoing page from the bottom */}
      <motion.div
        className="veil"
        style={{ transformOrigin: 'bottom' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.45, ease: EASE } }}
      />

      {/* Veil out — lifts off the incoming page toward the top */}
      <motion.div
        className="veil"
        style={{ transformOrigin: 'top' }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.65, delay: 0.3, ease: EASE } }}
        exit={{ scaleY: 0 }}
      />

      {/* Monogram — own fixed layer, fades without inheriting the veil scale */}
      <motion.div
        className="veil"
        style={{ background: 'transparent' }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0, transition: { duration: 0.25, delay: 0.2 } }}
        exit={{ opacity: 1, transition: { duration: 0.2, delay: 0.25 } }}
      >
        <motion.div
          initial={{ scale: 0.92 }}
          animate={{ scale: 1, transition: { duration: 0.5, ease: EASE } }}
        >
          <LogoMark size={64} color="var(--paper)" accent="var(--gold-soft)" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
