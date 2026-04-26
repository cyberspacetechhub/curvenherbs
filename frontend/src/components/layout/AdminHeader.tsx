import { useLocation, useNavigate } from 'react-router-dom';
import { MdMenu, MdLogout, MdPerson } from 'react-icons/md';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/auth/useAuth';

const TITLES: Record<string, string> = {
  '/admin':             'Dashboard',
  '/admin/products':    'Products',
  '/admin/orders':      'Orders',
  '/admin/reviews':     'Reviews',
  '/admin/testimonies': 'Testimonies',
  '/admin/newsletter':  'Newsletter',
  '/admin/messages':    'Messages',
  '/admin/admins':      'Admins',
};

interface Props { onMenuClick: () => void; }

export default function AdminHeader({ onMenuClick }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const { mutate: logout } = useLogout();

  const title = TITLES[pathname] ?? 'Admin';
  const handleLogout = () => logout(undefined, { onSettled: () => navigate('/login') });

  return (
    <>
      <header style={{ height: 64, background: '#fff', borderBottom: '1px solid #EDE7D9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', flexShrink: 0, position: 'sticky', top: 0, zIndex: 40 }}>

        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Hamburger — mobile only via CSS class */}
          <button onClick={onMenuClick} className="admin-hamburger"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#374151' }}>
            <MdMenu size={22} />
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>
            {title}
          </h1>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f5e9, #F8C1D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdPerson size={18} style={{ color: '#2E7D32' }} />
            </div>
            <div className="hide-mobile">
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#111827', lineHeight: 1.2 }}>
                {user ? `${user.firstName} ${user.lastName}` : 'Admin'}
              </p>
              <p style={{ fontSize: '0.7rem', color: '#9ca3af', lineHeight: 1.2, textTransform: 'capitalize' }}>
                {(user as any)?.role ?? user?.type ?? 'Admin'}
              </p>
            </div>
          </div>

          <button onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#FDE8F0', border: 'none', borderRadius: 8, padding: '0.5rem 0.875rem', cursor: 'pointer', color: '#C2185B', fontSize: '0.8rem', fontWeight: 600, transition: 'background 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F8C1D4')}
            onMouseLeave={e => (e.currentTarget.style.background = '#FDE8F0')}>
            <MdLogout size={16} />
            <span className="hide-mobile">Logout</span>
          </button>
        </div>
      </header>

      <style>{`
        .admin-hamburger { display: none; }
        @media (max-width: 767px) { .admin-hamburger { display: flex; } }
      `}</style>
    </>
  );
}
