import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf } from 'react-icons/fa';
import {
  MdDashboard, MdInventory, MdShoppingBag, MdStar,
  MdCameraAlt, MdEmail, MdMessage, MdAdminPanelSettings, MdChevronLeft, MdChevronRight,
} from 'react-icons/md';

const NAV = [
  { label: 'Dashboard',   to: '/admin',              icon: <MdDashboard size={20} /> },
  { label: 'Products',    to: '/admin/products',      icon: <MdInventory size={20} /> },
  { label: 'Orders',      to: '/admin/orders',        icon: <MdShoppingBag size={20} /> },
  { label: 'Reviews',     to: '/admin/reviews',       icon: <MdStar size={20} /> },
  { label: 'Testimonies', to: '/admin/testimonies',   icon: <MdCameraAlt size={20} /> },
  { label: 'Newsletter',  to: '/admin/newsletter',    icon: <MdEmail size={20} /> },
  { label: 'Messages',    to: '/admin/messages',      icon: <MdMessage size={20} /> },
  { label: 'Admins',      to: '/admin/admins',        icon: <MdAdminPanelSettings size={20} /> },
];

interface Props { collapsed: boolean; onToggle: () => void; }

export default function AdminSidebar({ collapsed, onToggle }: Props) {
  const { pathname } = useLocation();

  const isActive = (to: string) =>
    to === '/admin' ? pathname === '/admin' : pathname.startsWith(to);

  return (
    <aside style={{
      width: collapsed ? 64 : 240,
      minHeight: '100vh',
      background: '#1B5E20',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Logo */}
      <div style={{ padding: collapsed ? '1.25rem 0' : '1.25rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.625rem', borderBottom: '1px solid rgba(255,255,255,0.08)', minHeight: 64 }}>
        <FaLeaf size={22} style={{ color: '#86efac', flexShrink: 0, marginLeft: collapsed ? 'auto' : 0, marginRight: collapsed ? 'auto' : 0 }} />
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#fff', fontSize: '1.1rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              Curvenherbs
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
        {NAV.map(item => {
          const active = isActive(item.to);
          return (
            <Link key={item.to} to={item.to}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: collapsed ? '0.75rem 0' : '0.75rem 1.25rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                textDecoration: 'none',
                borderRadius: '0 12px 12px 0',
                marginRight: '0.75rem',
                background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                fontWeight: active ? 600 : 400,
                fontSize: '0.875rem',
                transition: 'all 0.18s',
                position: 'relative',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; } }}>
              {active && (
                <span style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: '#86efac', borderRadius: '0 4px 4px 0' }} />
              )}
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }}
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button onClick={onToggle}
        style={{ margin: '0.75rem', padding: '0.625rem', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, cursor: 'pointer', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
        {collapsed ? <MdChevronRight size={18} /> : <MdChevronLeft size={18} />}
      </button>
    </aside>
  );
}
