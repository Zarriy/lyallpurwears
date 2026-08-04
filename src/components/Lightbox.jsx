// Full-screen image viewer for the PDP gallery.
//
// Opens on the slide the customer was already looking at and keeps its own
// index from there, so paging inside the lightbox doesn't drag the stage
// behind it — the stage is re-synced once, on close.
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { SanityImage } from './SanityImage.jsx';

const EASE = [0.22, 1, 0.36, 1];

// The viewer fills the screen, so it asks for far larger renditions than the
// inline stage does. Sanity's `max` fit never upscales past the original, so
// a small source simply tops out rather than being blown up server-side.
const ZOOM_WIDTHS = [800, 1200, 1600, 2000, 2600];

export function Lightbox({ slides, startIndex = 0, open, onClose }) {
  const [index, setIndex] = useState(startIndex);

  const count = slides.length;
  const go = useCallback(
    (next) => setIndex((i) => (next + count) % count),
    [count]
  );

  useEffect(() => {
    if (open) setIndex(startIndex);
  }, [open, startIndex]);

  useEffect(() => {
    if (!open) return undefined;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(index + 1);
      else if (e.key === 'ArrowLeft') go(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, go, index]);

  const slide = slides[index];

  // Mounted and unmounted outright rather than wrapped in <AnimatePresence>.
  // Presence-tracking an overlay that also lives behind a portal left it
  // stuck on screen after `open` went false — dismissing it fired onClose but
  // the node never left the DOM. A closing fade is not worth that.
  if (!open || !slide) return null;

  // Portalled out of the page, but into #root rather than <body>.
  //
  // Out of the page because PageTransition wraps every route in a motion.div
  // that framer-motion drives with a transform, and a transformed ancestor
  // re-bases `position: fixed` onto itself.
  //
  // Into #root, not <body>, because that is the container React 18 attached
  // its delegated event listeners to — a portal outside it renders fine but
  // never delivers a click to any handler in here.
  return createPortal(
    <motion.div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Product image viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {/* The backdrop takes the click, so a click anywhere except the
          photo or a control closes the viewer. */}
      <div className="lightbox-backdrop" onClick={onClose} />

      <button className="lightbox-close" onClick={onClose} aria-label="Close viewer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>

      {/* The stage sits above the backdrop, so it needs its own close
          handler — otherwise it shows a zoom-out cursor over the photo
          and then swallows the click that cursor promises. */}
      <motion.div
        className="lightbox-stage"
        key={slide.key}
        onClick={onClose}
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <SanityImage
          asset={slide.asset}
          alt={slide.alt}
          ratio="3/4"
          seed={slide.seed}
          label={slide.label}
          objectFit="contain"
          sizes="90vw"
          widths={ZOOM_WIDTHS}
          style={{ width: '100%', height: '100%', aspectRatio: 'auto' }}
        />
      </motion.div>

      {count > 1 && (
        <>
          <button
            className="lightbox-nav"
            style={{ left: 20 }}
            onClick={() => go(index - 1)}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="lightbox-nav"
            style={{ right: 20 }}
            onClick={() => go(index + 1)}
            aria-label="Next image"
          >
            ›
          </button>
          <div className="lightbox-counter">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </div>
        </>
      )}
    </motion.div>,
    document.getElementById('root') || document.body
  );
}
