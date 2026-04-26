import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaWhatsapp, FaLeaf, FaCheckCircle, FaMapMarkerAlt, FaClock, FaUsers, FaStar } from 'react-icons/fa';
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { getWhatsAppOrderLink } from '@/lib/utils';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: 'easeOut' },
});

const TRUST_BADGES = [
  { icon: <FaLeaf size={14} />,          label: '100% Natural' },
  { icon: <FaCheckCircle size={14} />,   label: 'No Side Effects' },
  { icon: <FaMapMarkerAlt size={14} />,  label: 'Made in Abakaliki' },
  { icon: <FaClock size={14} />,         label: 'Results in 4–8 Weeks' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-hero-gradient overflow-hidden"
      style={{ display: 'flex', alignItems: 'center' }}>

      {/* Floating leaves */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { size: 80,  top: '8%',  left: '3%',   delay: 0 },
          { size: 55,  top: '15%', right: '5%',  delay: 1 },
          { size: 45,  bottom: '20%', left: '8%', delay: 2 },
          { size: 70,  bottom: '10%', right: '3%', delay: 0.5 },
        ].map((leaf, i) => (
          <motion.div key={i}
            animate={{ y: [0, -14, 0], rotate: [0, 15, -15, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay: leaf.delay }}
            className="absolute"
            style={{
              top: (leaf as any).top, left: (leaf as any).left,
              right: (leaf as any).right, bottom: (leaf as any).bottom,
              color: 'rgba(255,255,255,0.1)',
            }}>
            <FaLeaf size={leaf.size} />
          </motion.div>
        ))}
      </div>

      {/* Glow */}
      <div className="absolute blur-3xl pointer-events-none"
        style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'rgba(233,30,99,0.07)' }} />

      <div className="container-brand relative z-10" style={{ paddingTop: '7rem', paddingBottom: '4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', alignItems: 'center' }}
          className="hero-grid">

          {/* Left */}
          <div>
            <motion.div {...fadeUp(0.1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 9999, padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#E91E63', animation: 'pulse 2s infinite', flexShrink: 0 }} />
              <span style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.03em' }}>
                Sourced & Formulated In-House · Abakaliki, Ebonyi State
              </span>
            </motion.div>

            <motion.h1 {...fadeUp(0.2)}
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Natural Curves.{' '}
              <span style={{ color: '#FF69B4', fontStyle: 'italic' }}>Real</span>{' '}
              Confidence.
            </motion.h1>

            <motion.p {...fadeUp(0.35)}
              style={{ color: '#dcfce7', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem', maxWidth: 480 }}>
              100% herbal body enhancement for women — bum & hips growth, healthy weight gain, and natural curves with{' '}
              <strong style={{ color: '#fff' }}>no side effects</strong>. Visible results in 4–8 weeks.
            </motion.p>

            <motion.div {...fadeUp(0.45)}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <Link to="/shop" className="btn-pink" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
                Shop Now <FiArrowRight size={18} />
              </Link>
              <a href={getWhatsAppOrderLink()} target="_blank" rel="noreferrer"
                className="btn-green" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
                <FaWhatsapp size={20} /> Order on WhatsApp
              </a>
            </motion.div>

            <motion.div {...fadeUp(0.55)}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {TRUST_BADGES.map(b => (
                <div key={b.label}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '0.625rem 0.875rem' }}>
                  <span style={{ color: '#F8C1D4', flexShrink: 0 }}>{b.icon}</span>
                  <span style={{ color: '#fff', fontSize: '0.72rem', fontWeight: 500, lineHeight: 1.3 }}>{b.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — desktop only */}
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ display: 'none', justifyContent: 'center' }}
            className="hero-image-col">
            <div style={{ position: 'relative', width: 420, height: 520 }}>
              <div style={{ width: '100%', height: '100%', borderRadius: 40, overflow: 'hidden', background: 'linear-gradient(135deg,rgba(255,255,255,0.2),rgba(255,255,255,0.05))', border: '1px solid rgba(255,255,255,0.2)' }}>
                <img src="/hero.png" alt="Curvenherbs" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(27,94,32,0.55), transparent 60%)' }} />
              </div>

              {[
                { icon: <FaUsers size={18} style={{ color: '#2E7D32' }} />, val: '500+', sub: 'Happy Customers', bg: '#e8f5e9', pos: { left: -40, top: 64 }, delay: 0 },
                { icon: <FaStar size={18} style={{ color: '#E91E63' }} />, val: '4.9/5', sub: 'Average Rating', bg: '#fde8f0', pos: { right: -40, bottom: 96 }, delay: 1 },
              ].map((card, i) => (
                <motion.div key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
                  style={{ position: 'absolute', ...card.pos, background: '#fff', borderRadius: 16, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', minWidth: 140 }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {card.icon}
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1, color: '#1a1a1a' }}>{card.val}</p>
                    <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: 2 }}>{card.sub}</p>
                  </div>
                </motion.div>
              ))}

              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                style={{ position: 'absolute', right: -24, top: 40, background: '#E91E63', color: '#fff', borderRadius: 16, padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 8px 32px rgba(233,30,99,0.35)' }}>
                <FiTrendingUp size={16} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: 1 }}>4–8 Weeks</p>
                  <p style={{ fontSize: '0.7rem', color: '#fce7f3', marginTop: 2 }}>Visible Results</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            style={{ width: 20, height: 32, borderRadius: 99, border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.6)' }} />
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; }
          .hero-image-col { display: flex !important; }
        }
      `}</style>
    </section>
  );
}
