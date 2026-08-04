// Site header — topbar, nav, SVG logo, actions.
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from './Logo.jsx';
import { SearchOverlay } from './SearchOverlay.jsx';
import { useCart } from '../context/CartContext.jsx';

const navLink = ({ isActive }) => (isActive ? 'active' : undefined);

export function Header() {
  const { count, openDrawer } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <>
      <div className="topbar">
        <div>
          <span className="topbar-pill">COD</span>
          Cash on Delivery available across Pakistan
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <span>Free shipping over Rs. 5,000</span>
          <Link to="/track-order">Track order</Link>
          <span>EN / <span className="urdu" lang="ur">اردو</span></span>
        </div>
      </div>
      <header className="header">
        <nav className="header-nav">
          {/* No `end` — Shop stays lit on every /collections/:category route.
              It used to be exact-match because a sibling Lawn link owned that
              highlight; with the category link gone, nothing else would. */}
          <NavLink to="/collections" className={navLink}>Shop</NavLink>
          <NavLink to="/about" className={navLink}>About</NavLink>
          <NavLink to="/contact" className={navLink}>Contact</NavLink>
        </nav>
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
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
