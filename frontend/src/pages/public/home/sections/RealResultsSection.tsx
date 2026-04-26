import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaUsers, FaLeaf, FaMapMarkerAlt } from 'react-icons/fa';
import { FiTrendingUp } from 'react-icons/fi';
import { useTestimonies } from '@/hooks/testimonies/useTestimonies';
import AppSwiper from '@/components/ui/AppSwiper';
import type { Testimony } from '@/types';

function TestimonyCard({ t }: { t: Testimony }) {
  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <FaQuoteLeft size={20} style={{ color: 'rgba(233,30,99,0.2)', marginBottom: '0.75rem' }} />

      {(t.beforeImage || t.afterImage) && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem', borderRadius: 12, overflow: 'hidden' }}>
          {t.beforeImage && (
            <div style={{ position: 'relative', aspectRatio: '1/1', background: '#EDE7D9' }}>
              <img src={t.beforeImage} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: 4 }}>Before</span>
            </div>
          )}
          {t.afterImage && (
            <div style={{ position: 'relative', aspectRatio: '1/1', background: '#EDE7D9' }}>
              <img src={t.afterImage} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(46,125,50,0.85)', color: '#fff', fontSize: '0.6rem', padding: '0.15rem 0.5rem', borderRadius: 4 }}>After</span>
            </div>
          )}
        </div>
      )}

      <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.7, flex: 1, marginBottom: '1rem', fontStyle: 'italic' }}>
        "{t.testimonial}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
        <div>
          <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{t.customerName}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 2 }}>
            {t.location && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: '0.7rem', color: '#9ca3af' }}>
                <FaMapMarkerAlt size={9} /> {t.location}
              </span>
            )}
            {t.timeTaken && <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#2E7D32' }}>· {t.timeTaken}</span>}
          </div>
        </div>
        {t.rating && (
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} size={11} style={{ color: i < t.rating! ? '#facc15' : '#e5e7eb' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const STATIC: Partial<Testimony>[] = [
  { _id: '1', customerName: 'Chioma A.', location: 'Enugu', timeTaken: '6 weeks', testimonial: 'After 6 weeks of using the Bum & Hips Syrup consistently, my jeans stopped fitting the same way. My hips are fuller and I feel so much more confident!', rating: 5 },
  { _id: '2', customerName: 'Blessing O.', location: 'Lagos', timeTaken: '2 months', testimonial: 'I used the combo pack and the results were amazing. I gained weight in the right places — my bum and hips. 100% natural and no side effects at all!', rating: 5 },
  { _id: '3', customerName: 'Ngozi M.', location: 'Abakaliki', timeTaken: '5 weeks', testimonial: 'As someone from Abakaliki I trust this brand completely. The syrup is genuine and the results speak for themselves. My curves are more defined!', rating: 5 },
  { _id: '4', customerName: 'Fatima B.', location: 'Abuja', timeTaken: '8 weeks', testimonial: 'Curvenherbs is different from everything I have tried. You can tell it is made with real herbs. After 8 weeks my bum is noticeably bigger and my confidence is through the roof.', rating: 4 },
];

const STATS = [
  { value: '500+',   label: 'Happy Customers', icon: <FaUsers size={22} style={{ color: '#2E7D32' }} />,    bg: '#e8f5e9' },
  { value: '4.9/5',  label: 'Average Rating',  icon: <FaStar size={22} style={{ color: '#E91E63' }} />,     bg: '#fde8f0' },
  { value: '4–8 Wks',label: 'Visible Results', icon: <FiTrendingUp size={22} style={{ color: '#ca8a04' }} />, bg: '#fefce8' },
  { value: '100%',   label: 'Natural Herbs',   icon: <FaLeaf size={22} style={{ color: '#2E7D32' }} />,     bg: '#e8f5e9' },
];

export default function RealResultsSection() {
  const { data: testimonies, isLoading } = useTestimonies();
  const data = (testimonies?.length ? testimonies : STATIC) as Testimony[];

  return (
    <section className="section-padding" style={{ background: '#F5F0E8' }}>
      <div className="container-brand">

        <div className="section-header centered">
          <span className="badge-pink">Real Transformations</span>
          <h2 className="section-heading">
            Women Are Getting <span className="text-gradient-pink italic">Real Results</span>
          </h2>
          <p className="section-subheading">
            Don't just take our word for it — hear from women who've transformed their bodies naturally.
          </p>
        </div>

        {isLoading ? (
          <div className="grid-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 20, background: '#fff', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="skeleton" style={{ height: 120, borderRadius: 12 }} />
                <div className="skeleton" style={{ height: 10, width: '100%', borderRadius: 99 }} />
                <div className="skeleton" style={{ height: 10, width: '80%', borderRadius: 99 }} />
                <div className="skeleton" style={{ height: 10, width: '60%', borderRadius: 99 }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="hide-mobile-grid grid-4">
              {data.map((t, i) => (
                <motion.div key={t._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <TestimonyCard t={t} />
                </motion.div>
              ))}
            </div>
            <div className="show-mobile">
              <AppSwiper items={data.map(t => <TestimonyCard key={t._id} t={t} />)}
                slidesPerView={1.1} spaceBetween={14} showPagination autoplay autoplayDelay={4000} className="pb-10" />
            </div>
          </>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '3rem' }}
          className="stats-grid">
          {STATS.map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, fontSize: '1.4rem', color: '#1a1a1a' }}>{s.value}</p>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
      <style>{`@media(min-width:768px){ .stats-grid{ grid-template-columns: repeat(4,1fr) !important; } }`}</style>
    </section>
  );
}
