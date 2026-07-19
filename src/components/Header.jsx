// Site header — topbar, nav, SVG logo, actions.
import { Link, NavLink } from 'react-router-dom';
import { Logo } from './Logo.jsx';
import { useCart } from '../context/CartContext.jsx';

const navLink = ({ isActive }) => (isActive ? 'active' : undefined);

export function Header() {
  const { count, openDrawer } = useCart();
  return (
    <>
      <div className="topbar">
        <div>
          <span className="topbar-pill">COD</span>
          Cash on Delivery available across Pakistan
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <span>Free shipping over Rs. 5,000</span>
          <span>Track order</span>
          <span>EN / اردو</span>
        </div>
      </div>
      <header className="header">
        <nav className="header-nav">
          <NavLink to="/collections" className={navLink} end>Shop</NavLink>
          <NavLink to="/collections/lawn" className={navLink}>
            Lawn <span className="urdu" style={{ marginLeft: 4, color: 'var(--gold)' }}>لان</span>
          </NavLink>
          <NavLink to="/collections/khaddar" className={navLink}>Khaddar</NavLink>
          <NavLink to="/about" className={navLink}>About</NavLink>
          <NavLink to="/contact" className={navLink}>Contact</NavLink>
        </nav>
        <Link to="/" aria-label="Lyallpurwears — home" style={{ display: 'block' }}>
          <Logo height={44} color="var(--ink)" accent="var(--gold)" />
        </Link>
        <div className="header-actions">
          <button className="icon-btn" title="Search" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button className="icon-btn" title="Account" aria-label="Account">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </button>
          <button className="icon-btn" title="Wishlist" aria-label="Wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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
    </>
  );
}
