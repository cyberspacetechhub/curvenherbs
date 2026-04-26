import { Link } from 'react-router-dom';
import { FaWhatsapp, FaInstagram, FaTiktok, FaFacebook, FaLeaf } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdEmail } from 'react-icons/md';
import { MdCheckCircle } from 'react-icons/md';
import { useState } from 'react';
import { useSubscribe } from '@/hooks/newsletter/useNewsletter';

const QUICK_LINKS = [
  ['Home', '/'],
  ['Shop', '/shop'],
  ['About Us', '/about'],
  ['Contact', '/contact'],
  ['Share Your Story', '/testimony'],
  ['Track Order', '/orders/track'],
];

const SOCIAL = [FaInstagram, FaTiktok, FaFacebook, FaWhatsapp];

export default function Footer() {
  const [email, setEmail] = useState('');
  const { mutate: subscribe, isPending, isSuccess } = useSubscribe();

  return (
    <footer style={{ background: '#1B5E20', color: '#fff' }}>

      {/* WhatsApp CTA banner */}
      <div style={{ background: '#E91E63', padding: '1rem 0' }}>
        <div className="container-brand" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#fff' }}>
            <FaLeaf size={15} /> Ready to start your curve journey? Order directly on WhatsApp!
          </p>
          <a href="https://wa.me/2348149838596" target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: '#E91E63', fontWeight: 700, fontSize: '0.875rem', padding: '0.5rem 1.25rem', borderRadius: 9999, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <FaWhatsapp size={17} /> 08149838596
          </a>
        </div>
      </div>

      {/* Main grid */}
      <div className="container-brand footer-grid">

        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <FaLeaf size={20} style={{ color: '#86efac' }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.2rem', fontWeight: 700 }}>
              Curvenherbs
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#bbf7d0', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            100% Natural herbal body enhancement for women. Sourced & formulated in-house in Abakaliki, Ebonyi State.
          </p>
          <div style={{ display: 'flex', gap: '0.625rem' }}>
            {SOCIAL.map((Icon, i) => (
              <a key={i} href="#"
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', color: '#fff', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#E91E63')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}>
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1.25rem' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {QUICK_LINKS.map(([label, to]) => (
              <li key={to}>
                <Link to={to}
                  style={{ fontSize: '0.875rem', color: '#bbf7d0', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#bbf7d0')}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1.25rem' }}>
            Contact Us
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#bbf7d0' }}>
              <MdLocationOn size={17} style={{ color: '#E91E63', flexShrink: 0, marginTop: 2 }} />
              Abakaliki, Ebonyi State, Nigeria
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#bbf7d0' }}>
              <MdPhone size={16} style={{ color: '#E91E63', flexShrink: 0 }} />
              08149838596
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#bbf7d0' }}>
              <MdEmail size={16} style={{ color: '#E91E63', flexShrink: 0 }} />
              hello@curvenherbs.com
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', marginBottom: '1.25rem' }}>
            Stay Updated
          </h4>
          <p style={{ fontSize: '0.875rem', color: '#bbf7d0', marginBottom: '1rem' }}>
            Get tips, offers & new product alerts.
          </p>
          {isSuccess ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MdCheckCircle size={20} style={{ color: '#86efac' }} />
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#86efac' }}>You're subscribed!</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); if (email) subscribe(email); }}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                style={{ padding: '0.625rem 1rem', borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.875rem', outline: 'none', width: '100%' }} />
              <button type="submit" disabled={isPending} className="btn-pink" style={{ justifyContent: 'center' }}>
                {isPending ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0' }}>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#86efac' }}>
          © {new Date().getFullYear()} Curvenherbs. All rights reserved. · 100% Natural · No Side Effects · Proudly Nigerian 🇳🇬
        </p>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          padding-top: 3rem;
          padding-bottom: 3rem;
        }
        @media (min-width: 640px) {
          .footer-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .footer-grid { grid-template-columns: repeat(4, 1fr); gap: 2rem; }
        }
      `}</style>
    </footer>
  );
}
