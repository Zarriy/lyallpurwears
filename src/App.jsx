import { useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext.jsx';
import { Header } from './components/Header.jsx';
import { Footer } from './components/Footer.jsx';
import { CartDrawer } from './components/CartDrawer.jsx';
import { PageTransition } from './components/PageTransition.jsx';
import Home from './pages/Home.jsx';
import Collections from './pages/Collections.jsx';
import Product from './pages/Product.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import NotFound from './pages/NotFound.jsx';

// Pre-launch gate: while true, every route shows the 404 page and the rest of
// the site is unreachable. Set to false when the site is ready to go live.
const SITE_LOCKED = true;

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
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

// Checkout has its own minimal chrome — hide the store header/footer there.
function Shell() {
  const { pathname } = useLocation();
  if (SITE_LOCKED) return <NotFound />;
  const bare = pathname.startsWith('/checkout');
  return (
    <div className="frame">
      {!bare && <Header />}
      <main>
        <ScrollToTop />
        <AnimatedRoutes />
      </main>
      {!bare && <Footer />}
      {!bare && <CartDrawer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Shell />
      </CartProvider>
    </BrowserRouter>
  );
}
