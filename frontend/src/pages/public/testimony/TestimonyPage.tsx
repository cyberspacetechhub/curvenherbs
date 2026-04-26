import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaWhatsapp, FaStar, FaCheckCircle } from 'react-icons/fa';
import { FiUpload, FiX } from 'react-icons/fi';
import { useSubmitTestimony } from '@/hooks/testimonies/useTestimonies';
import { useProducts } from '@/hooks/products/useProducts';
import SEO from '@/components/SEO';
import type { Product } from '@/types';

export default function TestimonyPage() {
  const { mutate: submit, isPending, isSuccess } = useSubmitTestimony();
  const { data: products = [] } = useProducts();

  const [form, setForm] = useState({
    customerName: '',
    location: '',
    timeTaken: '',
    testimonial: '',
    productUsed: '',
    rating: 5,
  });
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState('');
  const [afterPreview, setAfterPreview] = useState('');
  const [error, setError] = useState('');

  const handleFile = (type: 'before' | 'after', file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'before') { setBeforeFile(file); setBeforePreview(url); }
    else { setAfterFile(file); setAfterPreview(url); }
  };

  const clearFile = (type: 'before' | 'after') => {
    if (type === 'before') { setBeforeFile(null); setBeforePreview(''); }
    else { setAfterFile(null); setAfterPreview(''); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.testimonial.trim()) {
      setError('Name and testimonial are required.');
      return;
    }
    setError('');
    const fd = new FormData();
    fd.append('customerName', form.customerName);
    fd.append('testimonial', form.testimonial);
    if (form.location) fd.append('location', form.location);
    if (form.timeTaken) fd.append('timeTaken', form.timeTaken);
    if (form.productUsed) fd.append('productUsed', form.productUsed);
    fd.append('rating', String(form.rating));
    if (beforeFile) fd.append('beforeImage', beforeFile);
    if (afterFile) fd.append('afterImage', afterFile);
    submit(fd);
  };

  if (isSuccess) {
    return (
      <div style={{ background: '#F5F0E8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ background: '#fff', borderRadius: 24, padding: '3rem 2rem', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <FaCheckCircle size={32} style={{ color: '#2E7D32' }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', color: '#111827', marginBottom: '0.75rem' }}>
            Thank You! 🌿
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Your testimony has been submitted and is pending review. We'll publish it once approved. Thank you for sharing your journey!
          </p>
          <a href="https://wa.me/2348149838596" target="_blank" rel="noreferrer" className="btn-green" style={{ justifyContent: 'center' }}>
            <FaWhatsapp size={16} /> Chat with Us
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F5F0E8' }}>
      <SEO
        title="Share Your Story"
        description="Share your Curvenherbs transformation journey. Submit your before & after photos and testimony to inspire other women across Nigeria."
        url="/testimony"
        keywords="Curvenherbs results, herbal transformation story, before after herbal products Nigeria, share testimony Curvenherbs"
      />
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)', paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div className="container-brand" style={{ textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge-pink" style={{ marginBottom: '1rem' }}>Share Your Story</span>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
              Your Results Inspire Others
            </h1>
            <p style={{ color: '#bbf7d0', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Share your transformation journey and help other women discover the power of natural herbs.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-brand" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{ background: '#fff', borderRadius: 24, padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaLeaf size={20} style={{ color: '#2E7D32' }} />
              </div>
              <div>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>Submit Your Testimony</h2>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>All submissions are reviewed before publishing</p>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FDE8F0', border: '1px solid #F8C1D4', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#C2185B', marginBottom: '1.25rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                <Field label="Your Name *">
                  <input className="input-brand" placeholder="e.g. Chioma A." value={form.customerName}
                    onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} required />
                </Field>
                <Field label="Location">
                  <input className="input-brand" placeholder="e.g. Lagos, Nigeria" value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                <Field label="Product Used">
                  <select className="input-brand" value={form.productUsed}
                    onChange={e => setForm(f => ({ ...f, productUsed: e.target.value }))} style={{ cursor: 'pointer' }}>
                    <option value="">Select a product</option>
                    {products.map((p: Product) => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </Field>
                <Field label="Time to See Results">
                  <input className="input-brand" placeholder="e.g. 6 weeks" value={form.timeTaken}
                    onChange={e => setForm(f => ({ ...f, timeTaken: e.target.value }))} />
                </Field>
              </div>

              <Field label="Your Rating">
                <div style={{ display: 'flex', gap: '0.375rem' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                      <FaStar size={28} style={{ color: s <= form.rating ? '#E91E63' : '#e5e7eb', transition: 'color 0.15s' }} />
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Your Testimony *">
                <textarea className="input-brand" rows={5}
                  placeholder="Tell us about your experience with Curvenherbs products. How did it change your life?"
                  value={form.testimonial} onChange={e => setForm(f => ({ ...f, testimonial: e.target.value }))}
                  style={{ resize: 'vertical' }} required />
              </Field>

              {/* Before / After images */}
              <div>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                  Before & After Photos <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional but encouraged)</span>
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {(['before', 'after'] as const).map(type => {
                    const preview = type === 'before' ? beforePreview : afterPreview;
                    return (
                      <div key={type}>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                          {type} photo
                        </p>
                        {preview ? (
                          <div style={{ position: 'relative', aspectRatio: '1/1', borderRadius: 14, overflow: 'hidden' }}>
                            <img src={preview} alt={type} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button type="button" onClick={() => clearFile(type)}
                              style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                              <FiX size={14} />
                            </button>
                          </div>
                        ) : (
                          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', aspectRatio: '1/1', borderRadius: 14, border: '2px dashed #EDE7D9', background: '#F5F0E8', cursor: 'pointer', transition: 'border-color 0.2s' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = '#2E7D32')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#EDE7D9')}>
                            <FiUpload size={22} style={{ color: '#9ca3af' }} />
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Upload {type}</span>
                            <input type="file" accept="image/*" style={{ display: 'none' }}
                              onChange={e => handleFile(type, e.target.files?.[0] ?? null)} />
                          </label>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button type="submit" disabled={isPending} className="btn-pink" style={{ justifyContent: 'center', padding: '0.875rem', fontSize: '0.95rem' }}>
                {isPending ? 'Submitting…' : '🌿 Submit My Testimony'}
              </button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', borderRadius: 20, padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <FaLeaf size={24} style={{ color: '#86efac', flexShrink: 0 }} />
            <div>
              <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Your privacy is protected</p>
              <p style={{ color: '#bbf7d0', fontSize: '0.8rem', lineHeight: 1.6 }}>
                We only publish your first name and location. Photos are optional and shown only with your consent.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) { .form-row { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{label}</label>
      {children}
    </div>
  );
}
