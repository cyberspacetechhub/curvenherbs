import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaInstagram, FaTiktok, FaLeaf, FaCheckCircle } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useSendMessage } from '@/hooks/contact/useContact';
import { contactSchema, type ContactFormData } from '@/lib/schemas';
import { getWhatsAppOrderLink } from '@/lib/utils';

const CONTACT_INFO = [
  { icon: <FaWhatsapp size={20} />, label: 'WhatsApp', value: '08149838596', href: 'https://wa.me/2348149838596', color: '#22c55e' },
  { icon: <MdPhone size={20} />, label: 'Phone', value: '08149838596', href: 'tel:+2348149838596', color: '#2E7D32' },
  { icon: <MdEmail size={20} />, label: 'Email', value: 'hello@curvenherbs.com', href: 'mailto:hello@curvenherbs.com', color: '#E91E63' },
  { icon: <MdLocationOn size={20} />, label: 'Location', value: 'Abakaliki, Ebonyi State, Nigeria', href: null, color: '#f59e0b' },
];

const SOCIALS = [
  { icon: <FaInstagram size={18} />, label: 'Instagram', href: '#', color: '#E91E63' },
  { icon: <FaTiktok size={18} />, label: 'TikTok', href: '#', color: '#111827' },
  { icon: <FaWhatsapp size={18} />, label: 'WhatsApp', href: 'https://wa.me/2348149838596', color: '#22c55e' },
];

const FAQS = [
  { q: 'How long before I see results?', a: 'Most customers notice visible changes within 4–8 weeks of consistent use, combined with a calorie surplus diet and light exercise.' },
  { q: 'Are your products safe with no side effects?', a: 'Yes. All our products are 100% natural with no synthetic additives. However, if you are pregnant, breastfeeding, or on medication, please consult your doctor first.' },
  { q: 'How do I place an order?', a: 'You can order directly through our website by adding products to your cart and checking out, or simply message us on WhatsApp at 08149838596.' },
  { q: 'Do you deliver nationwide?', a: 'Yes! We deliver to all 36 states in Nigeria. Delivery typically takes 2–5 business days depending on your location.' },
  { q: 'Can I use multiple products together?', a: 'Yes, our products are formulated to complement each other. Our combo packs are specifically designed for maximum results.' },
];

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { mutate: sendMessage, isPending, isSuccess } = useSendMessage();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormData) => {
    sendMessage(data, { onSuccess: () => reset() });
  };

  return (
    <div style={{ background: '#F5F0E8' }}>

      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)', paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="container-brand" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge-pink" style={{ marginBottom: '1rem' }}>Get in Touch</span>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
              We'd Love to Hear from You
            </h1>
            <p style={{ color: '#bbf7d0', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Have a question about our products? Want to place a bulk order? We're here to help.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-brand" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
        <div className="contact-layout">

          {/* ── Left: Form ── */}
          <div>
            <div style={{ background: '#fff', borderRadius: 24, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>
                Send Us a Message
              </h2>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
                We typically respond within a few hours on WhatsApp.
              </p>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    style={{ textAlign: 'center', padding: '2.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FaCheckCircle size={28} style={{ color: '#2E7D32' }} />
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Message Sent!</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: 300 }}>
                      Thank you for reaching out. We'll get back to you shortly. For faster response, chat us on WhatsApp.
                    </p>
                    <a href={getWhatsAppOrderLink()} target="_blank" rel="noreferrer" className="btn-green">
                      <FaWhatsapp size={15} /> Chat on WhatsApp
                    </a>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit(onSubmit)}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                    <Field label="Your Name *" error={errors.name?.message}>
                      <input {...register('name')} className={`input-brand${errors.name ? ' error' : ''}`} placeholder="Full name" />
                    </Field>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                      <Field label="Phone" error={errors.phone?.message}>
                        <input {...register('phone')} className="input-brand" placeholder="08012345678" />
                      </Field>
                      <Field label="Email" error={errors.email?.message}>
                        <input {...register('email')} type="email" className={`input-brand${errors.email ? ' error' : ''}`} placeholder="your@email.com" />
                      </Field>
                    </div>
                    <Field label="Message *" error={errors.message?.message}>
                      <textarea {...register('message')} className={`input-brand${errors.message ? ' error' : ''}`}
                        placeholder="Tell us how we can help you..." rows={5} style={{ resize: 'vertical' }} />
                    </Field>
                    <button type="submit" disabled={isPending} className="btn-pink" style={{ justifyContent: 'center' }}>
                      {isPending ? 'Sending…' : 'Send Message'}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: Info + Socials ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Contact info */}
            <div style={{ background: '#fff', borderRadius: 24, padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', fontWeight: 700, color: '#111827', marginBottom: '1.5rem' }}>
                Contact Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
                {CONTACT_INFO.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, flexShrink: 0 }}>
                      {c.icon}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</p>
                      {c.href ? (
                        <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                          style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', textDecoration: 'none' }}
                          onMouseEnter={e => (e.currentTarget.style.color = c.color)}
                          onMouseLeave={e => (e.currentTarget.style.color = '#111827')}>
                          {c.value}
                        </a>
                      ) : (
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827' }}>{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social links */}
            <div style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', borderRadius: 24, padding: '2rem' }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                Follow Us
              </h3>
              <p style={{ color: '#bbf7d0', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Stay updated with tips, results & new products.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {SOCIALS.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '0.5rem 1rem', borderRadius: 9999, fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.22)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}>
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a href={getWhatsAppOrderLink()} target="_blank" rel="noreferrer"
              style={{ background: '#22c55e', borderRadius: 24, padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(34,197,94,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.3)'; }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FaWhatsapp size={24} style={{ color: '#fff' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>Chat on WhatsApp</p>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>Fastest way to reach us · Usually replies in minutes</p>
              </div>
            </a>
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginTop: '5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge-green">FAQ</span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, color: '#111827' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #EDE7D9' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.125rem 1.375rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111827', lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{ flexShrink: 0, color: '#2E7D32' }}>
                    {openFaq === i ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} style={{ overflow: 'hidden' }}>
                      <p style={{ padding: '0 1.375rem 1.125rem', color: '#4b5563', fontSize: '0.875rem', lineHeight: 1.75 }}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .contact-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: start;
        }
        @media (min-width: 1024px) {
          .contact-layout { grid-template-columns: 1fr 400px; gap: 3rem; }
        }
        @media (max-width: 480px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '0.72rem', color: '#E91E63' }}>{error}</p>}
    </div>
  );
}
