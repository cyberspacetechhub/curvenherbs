import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { FaLeaf } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const location = useLocation();
  const isTestimonyPage = location.pathname === '/testimony';

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />

      {/* Floating testimony button — hidden on testimony page itself */}
      <AnimatePresence>
        {show && !isTestimonyPage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'fixed', bottom: '2rem', right: '1.5rem', zIndex: 40 }}
          >
            <Link to="/testimony"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #E91E63, #C2185B)', color: '#fff', fontWeight: 700, fontSize: '0.8rem', padding: '0.75rem 1.25rem', borderRadius: 9999, textDecoration: 'none', boxShadow: '0 6px 24px rgba(233,30,99,0.4)', whiteSpace: 'nowrap', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(233,30,99,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(233,30,99,0.4)'; }}
            >
              <FaLeaf size={14} />
              Share Your Story
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
