import { motion } from 'framer-motion';
import { FaLeaf, FaWhatsapp, FaStar, FaHeart } from 'react-icons/fa';
import { MdVerified, MdScience, MdLocalShipping } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useTestimonies } from '@/hooks/testimonies/useTestimonies';
import type { Testimony } from '@/types';
import { getWhatsAppOrderLink } from '@/lib/utils';
import SEO from '@/components/SEO';

const STATS = [
  { value: '500+', label: 'Happy Customers' },
  { value: '100%', label: 'Natural Ingredients' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '3+', label: 'Years Experience' },
];

const VALUES = [
  { icon: <FaLeaf size={24} />, title: 'Purely Natural', body: 'Every product is made from carefully sourced herbs with zero synthetic additives or harmful chemicals.' },
  { icon: <MdScience size={24} />, title: 'In-House Formulated', body: 'Our certified herbal formulator crafts every blend in-house in Abakaliki, Ebonyi State — no outsourcing, no compromise.' },
  { icon: <MdVerified size={24} />, title: 'Proven Results', body: 'Real women, real results. Our products are tested and trusted by hundreds of customers across Nigeria.' },
  { icon: <MdLocalShipping size={24} />, title: 'Nationwide Delivery', body: 'We deliver to all 36 states in Nigeria. Fast, discreet packaging straight to your door.' },
];

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };

export default function AboutPage() {
  const { data: testimonies = [] } = useTestimonies();
  const featured = testimonies.slice(0, 3);

  return (
    <div style={{ background: '#F5F0E8' }}>
      <SEO
        title="About Us — Our Story & Mission"
        description="Learn about Curvenherbs — a Nigerian herbal brand founded in Abakaliki, Ebonyi State. 100% natural, in-house formulated products for women. No side effects, proven results."
        url="/about"
        keywords="about Curvenherbs, Nigerian herbal brand, natural body enhancement brand, Abakaliki herbal products, women herbal supplements Nigeria"
      />

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 60%, #388E3C 100%)', paddingTop: '8rem', paddingBottom: '5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="container-brand" style={{ textAlign: 'center', position: 'relative' }}>
          <motion.div initial="hidden" animate="show" variants={fade} transition={{ duration: 0.5 }}>
            <span className="badge-pink" style={{ marginBottom: '1.25rem' }}>Our Story</span>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Nature's Best,<br />Crafted with Love
            </h1>
            <p style={{ color: '#bbf7d0', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.75 }}>
              Curvenherbs was born from a simple belief — every woman deserves to feel confident in her body, naturally.
            </p>
            <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn-pink">Shop Our Products</Link>
              <a href={getWhatsAppOrderLink()} target="_blank" rel="noreferrer" className="btn-green">
                <FaWhatsapp size={15} /> Chat with Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EDE7D9' }}>
        <div className="container-brand" style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }} className="stats-grid">
            {STATS.map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.1 }}
                style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, color: '#2E7D32', lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.375rem', fontWeight: 500 }}>{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Our Story ── */}
      <div className="container-brand" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="grid-2-lg" style={{ gap: '4rem', alignItems: 'center' }}>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade}>
            <div style={{ aspectRatio: '4/5', borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg, #e8f5e9, #F8C1D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 48px rgba(46,125,50,0.15)' }}>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <FaLeaf size={80} style={{ color: '#2E7D32', opacity: 0.3, marginBottom: '1rem' }} className="leaf-float" />
                <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', color: '#2E7D32', fontWeight: 700 }}>Curvenherbs</p>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>Abakaliki, Ebonyi State 🇳🇬</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ delay: 0.15 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <span className="badge-green">Who We Are</span>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>
                A Brand Built on Trust & Natural Healing
              </h2>
            </div>
            <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Curvenherbs started as a passion project in Abakaliki, Ebonyi State — a small operation with a big dream: to help Nigerian women achieve their body goals safely, without resorting to harmful chemicals or surgeries.
            </p>
            <p style={{ color: '#4b5563', lineHeight: 1.8, fontSize: '0.95rem' }}>
              Our certified herbal formulator spent years studying traditional African herbs and their benefits before developing our signature blends. Every product is mixed, bottled, and quality-checked in-house — because we believe you deserve to know exactly what goes into what you put in your body.
            </p>
            <div style={{ background: '#F8F1E3', borderLeft: '4px solid #2E7D32', padding: '1rem 1.25rem', borderRadius: '0 12px 12px 0', fontSize: '0.9rem', color: '#4b5563', fontStyle: 'italic' }}>
              "We don't just sell products — we sell confidence, naturally."
            </div>
            <a href={getWhatsAppOrderLink()} target="_blank" rel="noreferrer" className="btn-green" style={{ alignSelf: 'flex-start' }}>
              <FaWhatsapp size={15} /> Start Your Journey
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Values ── */}
      <div style={{ background: '#EDE7D9', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-brand">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge-pink">Why Choose Us</span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#111827' }}>
              The Curvenherbs Difference
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {VALUES.map((v, i) => (
              <motion.div key={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.1 }}
                style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32', marginBottom: '1rem' }}>
                  {v.icon}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '0.625rem' }}>{v.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.7 }}>{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonies ── */}
      {featured.length > 0 && (
        <div className="container-brand" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="badge-green">Real Results</span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#111827' }}>
              Stories from Our Customers
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {featured.map((t: Testimony, i: number) => (
              <motion.div key={t._id} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fade} transition={{ delay: i * 0.1 }}
                style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {t.rating && (
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[1,2,3,4,5].map(s => <FaStar key={s} size={14} style={{ color: s <= t.rating! ? '#E91E63' : '#e5e7eb' }} />)}
                  </div>
                )}
                <p style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic', flex: 1 }}>"{t.testimonial}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f5e9, #F8C1D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FaHeart size={14} style={{ color: '#E91E63' }} />
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{t.customerName}</p>
                    {t.location && <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{t.location}{t.timeTaken ? ` · ${t.timeTaken}` : ''}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-brand" style={{ textAlign: 'center' }}>
          <FaLeaf size={40} style={{ color: '#86efac', marginBottom: '1.25rem' }} className="leaf-float" />
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
            Ready to Start Your Journey?
          </h2>
          <p style={{ color: '#bbf7d0', fontSize: '1rem', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.75 }}>
            Join hundreds of women who have transformed their confidence with Curvenherbs.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn-pink">Browse Products</Link>
            <Link to="/contact" className="btn-outline-pink" style={{ borderColor: '#fff', color: '#fff' }}>Contact Us</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 640px) {
          .stats-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
