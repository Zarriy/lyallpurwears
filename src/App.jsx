import { lazy, Suspense, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { StoreProvider } from './sanity/useStore.js';
import { CartProvider } from './context/CartContext.jsx';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';
import { PageTransition } from './components/PageTransition.jsx';
import Home from './pages/Home.jsx';
import Collections from './pages/Collections.jsx';
import Product from './pages/Product.jsx';
import About from './pages/About.jsx';
import CityOfLooms from './pages/CityOfLooms.jsx';
import Sustainability from './pages/Sustainability.jsx';
import Contact from './pages/Contact.jsx';
import FAQ from './pages/FAQ.jsx';
import ShippingReturns from './pages/ShippingReturns.jsx';
import SizeGuide from './pages/SizeGuide.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import TrackOrder from './pages/TrackOrder.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Welcome from './pages/Welcome.jsx';
import NotFound from './pages/NotFound.jsx';

// Code-split — `sanity` (the Studio package) must never land in the
// storefront's main bundle. This dynamic import is the only reference to it
// anywhere in the storefront code, so it gets its own chunk.
const StudioPage = lazy(() => import('./StudioPage.jsx'));

function StudioFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
        fontSize: 13,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#8A8A8A',
      }}
    >
      Loading Studio…
    </div>
  );
}

// Mounted outside all store chrome (no Header/Footer/CartDrawer/ScrollToTop/
// PageTransition/AnimatePresence) — Sanity Studio manages its own full-
// viewport layout and would fight the site's global CSS/animation wrappers.
function StudioRoute() {
  return (
    <Suspense fallback={<StudioFallback />}>
      <StudioPage />
    </Suspense>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/collections" element={<PageTransition><Collections /></PageTransition>} />
        <Route path="/collections/:category" element={<PageTransition><Collections /></PageTransition>} />
        <Route path="/product/:slug" element={<PageTransition><Product /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/city-of-looms" element={<PageTransition><CityOfLooms /></PageTransition>} />
        <Route path="/sustainability" element={<PageTransition><Sustainability /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/shipping-returns" element={<PageTransition><ShippingReturns /></PageTransition>} />
        <Route path="/size-guide" element={<PageTransition><SizeGuide /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/track-order" element={<PageTransition><TrackOrder /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        {/* Brevo's double opt-in confirmation link lands here — see
            BREVO_DOI_REDIRECT_URL and the note atop Welcome.jsx. */}
        <Route path="/welcome" element={<PageTransition><Welcome /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

// Checkout has its own minimal chrome — hide the store header/footer there.
function StorefrontShell() {
  const { pathname } = useLocation();
  const bare = pathname.startsWith('/checkout');
  return (
    <StoreProvider>
      <CartProvider>
        <div className="frame">
          {!bare && <Header />}
          <main>
            <ScrollToTop />
            <AnimatedRoutes />
          </main>
          {!bare && <Footer />}
          {!bare && <CartDrawer />}
        </div>
      </CartProvider>
    </StoreProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* More specific than the storefront's own "/*" wildcard below —
            React Router ranks routes by specificity regardless of
            declaration order, so this always wins for /studio/* URLs. */}
        <Route path="/studio/*" element={<StudioRoute />} />
        <Route path="/*" element={<StorefrontShell />} />
      </Routes>
    </BrowserRouter>
  );
}
