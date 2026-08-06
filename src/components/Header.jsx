// Site header — topbar, nav, SVG logo, actions, mobile menu.
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from './Logo.jsx';
import { SearchOverlay } from './SearchOverlay.jsx';
import { useCart } from '../context/CartContext.jsx';

const EASE = [0.22, 1, 0.36, 1];

const navLink = ({ isActive }) => (isActive ? 'active' : undefined);

// Primary routes mirror the desktop nav; secondary carries the help links a
// phone user would otherwise have to scroll to the footer for.
const PRIMARY_LINKS = [
  { to: '/collections', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];
const SECONDARY_LINKS = [
  { to: '/track-order', label: 'Track Order' },
  { to: '/size-guide', label: 'Size Guide' },
  { to: '/shipping-returns', label: 'Shipping & Returns' },
  { to: '/faq', label: 'FAQ' },
];

function MobileMenu({ open, onClose }) {
  // Lock body scroll + escape-to-close while open, same as CartDrawer.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="menu-scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
          <motion.nav
            className="mobile-menu"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            role="dialog"
            aria-label="Menu"
          >
            <div className="mobile-menu-head">
              <Logo height={34} color="var(--ink)" accent="var(--gold)" />
              <button className="icon-btn" aria-label="Close menu" onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M5 5l14 14M19 5L5 19" />
                </svg>
              </button>
            </div>
            <div className="mobile-menu-primary">
              {PRIMARY_LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className={navLink} onClick={onClose}>
                  {l.label}
                </NavLink>
              ))}
            </div>
            <div className="mobile-menu-secondary">
              {SECONDARY_LINKS.map((l) => (
                <NavLink key={l.to} to={l.to} className={navLink} onClick={onClose}>
                  {l.label}
                </NavLink>
              ))}
            </div>
            <div className="mobile-menu-foot">Cash on Delivery · Pakistan-wide</div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const { count, openDrawer } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Belt and braces alongside the links' own onClick — any navigation
  // (breadcrumb, logo, back button) dismisses the menu.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="topbar">
        <div>
          <span className="topbar-pill">COD</span>
          Cash on Delivery available across Pakistan
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <span>Free shipping nationwide</span>
          <Link to="/track-order">Track order</Link>
          <span>EN / <span className="urdu" lang="ur">اردو</span></span>
        </div>
      </div>
      <header className="header">
        <div className="header-left">
          <button
            className="icon-btn nav-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
          <nav className="header-nav">
            {/* No `end` — Shop stays lit on every /collections/:category route.
                It used to be exact-match because a sibling Lawn link owned that
                highlight; with the category link gone, nothing else would. */}
            <NavLink to="/collections" className={navLink}>Shop</NavLink>
            <NavLink to="/about" className={navLink}>About</NavLink>
            <NavLink to="/contact" className={navLink}>Contact</NavLink>
          </nav>
        </div>
        <Link to="/" aria-label="Lyallpur Wear — home" style={{ display: 'block' }}>
          <Logo height={44} color="var(--ink)" accent="var(--gold)" />
        </Link>
        <div className="header-actions">
          <button
            className="icon-btn"
            title="Search"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(true)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button className="icon-btn" title="Cart" aria-label="Open cart" style={{ position: 'relative' }} onClick={openDrawer}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span className="cart-count" style={{ position: 'absolute', top: -4, right: -4 }}>{count}</span>
            )}
          </button>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
