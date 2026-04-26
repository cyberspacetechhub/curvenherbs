import { FaLeaf, FaCheckCircle, FaMapMarkerAlt, FaStar, FaFlag, FaUsers, FaFlask, FaTruck } from 'react-icons/fa';
import AppMarquee from '@/components/ui/AppMarquee';

const ITEMS = [
  { icon: <FaLeaf size={13} />,          text: '100% Natural Herbs' },
  { icon: <FaCheckCircle size={13} />,   text: 'No Side Effects' },
  { icon: <FaMapMarkerAlt size={13} />,  text: 'Formulated In-House · Abakaliki' },
  { icon: <FaStar size={13} />,          text: 'Visible Results in 4–8 Weeks' },
  { icon: <FaFlag size={13} />,          text: 'Proudly Nigerian Brand' },
  { icon: <FaUsers size={13} />,         text: '500+ Happy Customers' },
  { icon: <FaFlask size={13} />,         text: 'Certified Herbal Formulator' },
  { icon: <FaTruck size={13} />,         text: 'Nationwide Delivery' },
];

export default function TrustMarquee() {
  return (
    <div style={{ background: '#2E7D32', padding: '0.875rem 0', overflow: 'hidden' }}>
      <AppMarquee
        items={ITEMS.map(item => (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 500, fontSize: '0.8rem', letterSpacing: '0.03em' }}>
            <span style={{ color: '#F8C1D4' }}>{item.icon}</span>
            {item.text}
          </span>
        ))}
        separator={<span style={{ color: '#86efac', margin: '0 1.25rem' }}>·</span>}
        speed={45}
        gradient={false}
        itemClassName="mx-5"
      />
    </div>
  );
}
