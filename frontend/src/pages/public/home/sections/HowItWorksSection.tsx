import { motion } from 'framer-motion';
import { FaShoppingBag, FaWhatsapp, FaStar } from 'react-icons/fa';

const STEPS = [
  { step: '01', icon: <FaShoppingBag size={28} />, title: 'Choose Your Product', desc: 'Browse our range of 100% natural herbal products — syrups, powders, and combo packs designed for your body goals.', bg: '#FDE8F0', iconColor: '#E91E63' },
  { step: '02', icon: <FaWhatsapp size={28} />,    title: 'Order via WhatsApp',   desc: 'Place your order directly on WhatsApp or through our website. We confirm and dispatch within 24 hours.',              bg: '#f0fdf4', iconColor: '#2E7D32' },
  { step: '03', icon: <FaStar size={28} />,        title: 'See Real Results',     desc: 'Use consistently with a calorie surplus. Visible bum, hips & weight gain results in just 4–8 weeks.',                bg: '#fefce8', iconColor: '#ca8a04' },
];

export default function HowItWorksSection() {
  return (
    <section className="section-padding bg-section-alt">
      <div className="container-brand">

        <div className="section-header centered">
          <span className="badge-green">Simple Process</span>
          <h2 className="section-heading">
            How It <span className="text-gradient-green italic">Works</span>
          </h2>
          <p className="section-subheading">
            Getting your natural curves has never been easier. Three simple steps to your transformation.
          </p>
        </div>

        <div className="grid-3" style={{ position: 'relative' }}>
          {/* Connector line */}
          <div style={{ display: 'none', position: 'absolute', top: '3rem', left: 'calc(16.67% + 3.5rem)', right: 'calc(16.67% + 3.5rem)', height: 1, background: 'linear-gradient(to right, #E91E63, #2E7D32, #ca8a04)', opacity: 0.2 }}
            className="hide-mobile" />

          {STEPS.map((s, i) => (
            <motion.div key={s.step}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 1.5rem' }}>
              <div style={{ position: 'relative', width: 96, height: 96, borderRadius: '50%', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <span style={{ color: s.iconColor }}>{s.icon}</span>
                <span style={{ position: 'absolute', top: -8, right: -8, width: 32, height: 32, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: s.iconColor, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                  {s.step}
                </span>
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.7 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginTop: '3.5rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Join 500+ women already on their curve journey</p>
          <a href="https://wa.me/2348149838596" target="_blank" rel="noreferrer" className="btn-green">
            <FaWhatsapp size={17} /> Start Your Journey Today
          </a>
        </motion.div>
      </div>
    </section>
  );
}
