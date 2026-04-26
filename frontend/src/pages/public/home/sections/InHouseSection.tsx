import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

const POINTS = [
  'Certified herbal formulator with years of experience',
  'Herbs sourced directly from trusted local farmers',
  'Every batch tested for quality and potency',
  'No artificial additives, fillers, or chemicals',
  "Formulated specifically for African women's body types",
  'Transparent ingredient list — nothing hidden',
];

const BARS = [
  { label: 'Natural Purity',        value: 100, color: '#E91E63' },
  { label: 'Customer Satisfaction', value: 98,  color: '#4ade80' },
  { label: 'Visible Results Rate',  value: 94,  color: '#facc15' },
];

export default function InHouseSection() {
  return (
    <section className="section-padding overflow-hidden relative" style={{ background: '#1B5E20' }}>
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '30%', opacity: 0.04, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', pointerEvents: 'none' }}>
        <FaLeaf style={{ fontSize: 360, color: '#fff' }} />
      </div>

      <div className="container-brand relative z-10">
        <div className="grid-2-lg" style={{ alignItems: 'center' }}>

          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <span className="badge-pink">Our Promise</span>
            <h2 className="section-heading" style={{ color: '#fff', marginBottom: '1.25rem' }}>
              Sourced & Formulated{' '}
              <span style={{ color: '#FF69B4', fontStyle: 'italic' }}>In-House</span>{' '}
              in Abakaliki
            </h2>
            <p style={{ fontSize: '1rem', color: '#bbf7d0', lineHeight: 1.8, marginBottom: '2rem' }}>
              Unlike mass-produced supplements, every Curvenherbs product is carefully crafted by our certified herbal formulator right here in Abakaliki, Ebonyi State. We control every step — from sourcing to bottling.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '2.5rem' }}>
              {POINTS.map((p, i) => (
                <motion.li key={p} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', listStyle: 'none' }}>
                  <FiCheckCircle size={17} style={{ color: '#E91E63', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: '0.875rem', color: '#dcfce7', lineHeight: 1.6 }}>{p}</span>
                </motion.li>
              ))}
            </ul>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {['Ashwagandha', 'Shatavari', 'Fenugreek'].map(herb => (
                <div key={herb} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 12, padding: '0.75rem 1.25rem' }}>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{herb}</p>
                  <p style={{ fontSize: '0.7rem', color: '#86efac', marginTop: 2 }}>Key Ingredient</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 28, padding: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <FaLeaf size={36} style={{ color: '#86efac' }} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#fff', fontSize: '1.3rem', fontWeight: 700 }}>
                  The Curvenherbs Difference
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {BARS.map(bar => (
                  <div key={bar.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#bbf7d0' }}>{bar.label}</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff' }}>{bar.value}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${bar.value}%` }}
                        viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }}
                        style={{ height: '100%', borderRadius: 99, background: bar.color }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#86efac', lineHeight: 1.6 }}>
                  "We put our name on every bottle because we believe in what we make."
                </p>
                <p style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 600, marginTop: '0.5rem' }}>
                  — Curvenherbs Formulator, Abakaliki
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
