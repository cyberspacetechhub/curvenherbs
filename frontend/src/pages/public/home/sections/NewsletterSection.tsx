import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MdEmail, MdCheckCircle } from 'react-icons/md';
import { newsletterSchema, type NewsletterFormData } from '@/lib/schemas';
import { useSubscribe } from '@/hooks/newsletter/useNewsletter';

export default function NewsletterSection() {
  const { mutate: subscribe, isPending, isSuccess } = useSubscribe();
  const { register, handleSubmit, formState: { errors } } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  return (
    <section className="section-padding-sm"
      style={{ background: 'linear-gradient(135deg, #FDE8F0 0%, #fff 50%, #F8C1D4 100%)' }}>
      <div className="container-brand">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#FDE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <MdEmail size={30} style={{ color: '#E91E63' }} />
          </div>

          <h2 className="section-heading" style={{ marginBottom: '0.75rem' }}>
            Get Curve Tips & <span className="text-gradient-pink italic">Exclusive Offers</span>
          </h2>
          <p className="section-subheading" style={{ marginBottom: '2rem' }}>
            Join our community of women on their natural curve journey. Get tips, new product alerts, and exclusive discounts.
          </p>

          {isSuccess ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              style={{ width: '100%', background: 'rgba(46,125,50,0.08)', border: '1px solid rgba(46,125,50,0.2)', borderRadius: 16, padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <MdCheckCircle size={40} style={{ color: '#2E7D32' }} />
              <p style={{ fontWeight: 600, color: '#2E7D32' }}>You're in! Welcome to the Curvenherbs family.</p>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Check your inbox for a welcome gift.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(d => subscribe(d.email))}
              style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
              className="newsletter-form">
              <div style={{ flex: 1 }}>
                <input {...register('email')} type="email" placeholder="Enter your email address"
                  className={`input-brand${errors.email ? ' error' : ''}`} />
                {errors.email && (
                  <p style={{ fontSize: '0.75rem', color: '#E91E63', marginTop: '0.25rem', textAlign: 'left' }}>
                    {errors.email.message}
                  </p>
                )}
              </div>
              <button type="submit" disabled={isPending} className="btn-pink" style={{ justifyContent: 'center' }}>
                {isPending ? 'Joining...' : 'Join Free'}
              </button>
            </form>
          )}

          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '1.25rem' }}>
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
      <style>{`@media(min-width:640px){ .newsletter-form{ flex-direction: row !important; } }`}</style>
    </section>
  );
}
