import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import { FaWhatsapp, FaLeaf } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import { getWhatsAppOrderLink } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home',        to: '/' },
  { label: 'Shop',        to: '/shop' },
  { label: 'About',       to: '/about' },
  { label: 'Share Story', to: '/testimony' },
  { label: 'Contact',     to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location              = useLocation();
  const totalItems            = useCartStore(s => s.totalItems());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location]);

  const navBg     = scrolled ? '#fff'     : 'transparent';
  const shadow    = scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none';
  const py        = scrolled ? '0.75rem'  : '1.25rem';
  const logoColor = scrolled ? '#2E7D32'  : '#fff';
  const iconColor = scrolled ? '#374151'  : '#fff';

  return (
    <>
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: navBg, boxShadow: shadow, transition: 'all 0.3s ease', padding: `${py} 0` }}>
        <div className="container-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <FaLeaf size={22} style={{ color: scrolled ? '#2E7D32' : '#86efac' }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: logoColor, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Curvenherbs
            </span>
          </Link>

          {/* Desktop nav — hidden on mobile via inline media */}
          <nav style={{ display: 'none' }} className="desktop-nav">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize: '0.875rem', fontWeight: 500, color: location.pathname === l.to ? '#E91E63' : iconColor, textDecoration: 'none', transition: 'color 0.2s' }}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

            {/* WhatsApp — desktop only */}
            <a href={getWhatsAppOrderLink()} target="_blank" rel="noreferrer"
              className="desktop-only"
              style={{ display: 'none', alignItems: 'center', gap: '0.5rem', background: '#22c55e', color: '#fff', fontSize: '0.875rem', fontWeight: 600, padding: '0.5rem 1.25rem', borderRadius: 9999, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              <FaWhatsapp size={16} /> Order Now
            </a>

            {/* Cart */}
            <Link to="/checkout" style={{ position: 'relative', padding: '0.5rem', display: 'flex' }}>
              <FiShoppingCart size={22} style={{ color: iconColor }} />
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: 0, right: 0, width: 18, height: 18, background: '#E91E63', color: '#fff', fontSize: '0.6rem', fontWeight: 700, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Hamburger — mobile only */}
            <button onClick={() => setOpen(v => !v)}
              className="mobile-only"
              style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
              {open
                ? <FiX size={24} style={{ color: iconColor }} />
                : <FiMenu size={24} style={{ color: iconColor }} />
              }
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ background: '#fff', borderTop: '1px solid #EDE7D9', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
              {NAV_LINKS.map(l => (
                <Link key={l.to} to={l.to}
                  style={{ fontSize: '1rem', fontWeight: 500, color: location.pathname === l.to ? '#E91E63' : '#374151', textDecoration: 'none', padding: '0.625rem 0', borderBottom: '1px solid #f9fafb' }}>
                  {l.label}
                </Link>
              ))}
              <a href={getWhatsAppOrderLink()} target="_blank" rel="noreferrer"
                className="btn-green"
                style={{ marginTop: '0.875rem', justifyContent: 'center' }}>
                <FaWhatsapp size={16} /> Order on WhatsApp
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Responsive rules */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav   { display: flex !important; align-items: center; gap: 2rem; }
          .desktop-only  { display: inline-flex !important; }
          .mobile-only   { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav  { display: none !important; }
          .desktop-only { display: none !important; }
          .mobile-only  { display: flex !important; }
        }
      `}</style>
    </>
  );
}
