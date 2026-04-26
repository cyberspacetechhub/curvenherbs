import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdShoppingBag, MdPeople, MdInventory, MdEmail,
  MdMessage, MdStar, MdCameraAlt, MdTrendingUp, MdTrendingDown,
} from 'react-icons/md';
import { FaLeaf } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import {
  useOverviewStats, useRevenueComparison, useTopProducts,
  useOrdersByStatus, useRevenueChart,
} from '@/hooks/analytics/useAnalytics';
import { formatNaira } from '@/lib/utils';

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color, href }: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; color: string; href?: string;
}) {
  const inner = (
    <div style={{ background: '#fff', borderRadius: 16, padding: '1.25rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', gap: '1rem', transition: 'box-shadow 0.2s, transform 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 500, marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', lineHeight: 1, fontFamily: "'Playfair Display', Georgia, serif" }}>{value}</p>
        {sub && <p style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '0.25rem' }}>{sub}</p>}
      </div>
    </div>
  );
  return href ? <Link to={href} style={{ textDecoration: 'none' }}>{inner}</Link> : inner;
}

// ── Mini bar chart ────────────────────────────────────────────────────────────
function MiniBar({ data }: { data: { label: string; revenue: number }[] }) {
  const max = Math.max(...data.map(d => d.revenue), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.375rem', height: 80 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', background: i === data.length - 1 ? '#2E7D32' : '#bbf7d0', borderRadius: '4px 4px 0 0', height: `${Math.max((d.revenue / max) * 100, 4)}%`, transition: 'height 0.4s ease' }} />
          <span style={{ fontSize: '0.6rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const PERIOD_OPTIONS = [
  { label: '7 days', value: '7d' },
  { label: '30 days', value: '30d' },
  { label: '90 days', value: '90d' },
];

const STATUS_COLORS: Record<string, string> = {
  'Pending': '#f59e0b', 'Payment Received': '#3b82f6', 'Processing': '#8b5cf6',
  'Shipped': '#6366f1', 'Out for Delivery': '#E91E63', 'Delivered': '#2E7D32', 'Cancelled': '#ef4444',
};

export default function DashboardPage() {
  const [period, setPeriod] = useState('30d');
  const { data: stats, isLoading: loadingStats } = useOverviewStats();
  const { data: comparison } = useRevenueComparison();
  const { data: topProducts } = useTopProducts(5);
  const { data: orderStatus } = useOrdersByStatus();
  const { data: revenueChart } = useRevenueChart(period);

  const monthChange = comparison?.monthly?.changePercent ?? 0;
  const isUp = monthChange >= 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

      {/* Welcome */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
            Good {getGreeting()} 🌿
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            Here's what's happening with Curvenherbs today.
          </p>
        </div>
        <Link to="/admin/orders" className="btn-green" style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}>
          View Orders <FiArrowRight size={13} />
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      {loadingStats ? (
        <div className="stat-grid" style={gridStyle}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 90, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        <motion.div className="stat-grid" style={gridStyle} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <StatCard label="Total Orders"      value={stats?.orders.total ?? 0}          sub={`${stats?.orders.pending ?? 0} pending`}          icon={<MdShoppingBag size={22} />}       color="#E91E63" href="/admin/orders" />
          <StatCard label="Total Revenue"     value={formatNaira(stats?.revenue.total ?? 0)} sub="all time"                                    icon={<FaLeaf size={20} />}              color="#2E7D32" />
          <StatCard label="Products"          value={stats?.products.total ?? 0}         sub={`${stats?.products.outOfStock ?? 0} out of stock`} icon={<MdInventory size={22} />}         color="#8b5cf6" href="/admin/products" />
          <StatCard label="Customers"         value={stats?.customers.total ?? 0}        sub="registered"                                       icon={<MdPeople size={22} />}            color="#3b82f6" href="/admin/customers" />
          <StatCard label="Processing"        value={stats?.orders.processing ?? 0}      sub="orders in progress"                               icon={<MdTrendingUp size={22} />}        color="#f59e0b" href="/admin/orders" />
          <StatCard label="Delivered"         value={stats?.orders.delivered ?? 0}       sub="completed orders"                                 icon={<MdShoppingBag size={22} />}       color="#2E7D32" href="/admin/orders" />
          <StatCard label="Pending Reviews"   value={stats?.moderation.pendingReviews ?? 0}    sub="awaiting approval"                          icon={<MdStar size={22} />}              color="#E91E63" href="/admin/reviews" />
          <StatCard label="Unread Messages"   value={stats?.inbox.unread ?? 0}           sub="in inbox"                                         icon={<MdMessage size={22} />}           color="#6366f1" href="/admin/messages" />
        </motion.div>
      )}

      {/* ── Revenue + Chart ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }} className="dash-mid">

        {/* Revenue comparison */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Revenue Overview</h3>
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              {PERIOD_OPTIONS.map(o => (
                <button key={o.value} onClick={() => setPeriod(o.value)}
                  style={{ padding: '0.3rem 0.75rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: period === o.value ? '#2E7D32' : '#F5F0E8', color: period === o.value ? '#fff' : '#6b7280', transition: 'all 0.15s' }}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comparison pills */}
          {comparison && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 120, background: '#F5F0E8', borderRadius: 12, padding: '0.875rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.25rem' }}>This Month</p>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>{formatNaira(comparison.monthly.current)}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                  {isUp ? <MdTrendingUp size={14} style={{ color: '#2E7D32' }} /> : <MdTrendingDown size={14} style={{ color: '#ef4444' }} />}
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: isUp ? '#2E7D32' : '#ef4444' }}>
                    {isUp ? '+' : ''}{monthChange.toFixed(1)}% vs last month
                  </span>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 120, background: '#F5F0E8', borderRadius: 12, padding: '0.875rem' }}>
                <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Last Month</p>
                <p style={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>{formatNaira(comparison.monthly.previous)}</p>
                <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.25rem' }}>{comparison.lastMonthOrders} orders</p>
              </div>
            </div>
          )}

          {/* Bar chart */}
          {revenueChart?.length > 0 && <MiniBar data={revenueChart.slice(-12)} />}
        </div>

        {/* Order status breakdown */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '1.25rem' }}>
            Orders by Status
          </h3>
          {orderStatus?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {orderStatus.map((s: { status: string; count: number }) => {
                const total = orderStatus.reduce((a: number, b: { count: number }) => a + b.count, 0);
                const pct = total ? Math.round((s.count / total) * 100) : 0;
                const color = STATUS_COLORS[s.status] ?? '#9ca3af';
                return (
                  <div key={s.status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 500, color: '#374151' }}>{s.status}</span>
                      <span style={{ fontWeight: 700, color: '#111827' }}>{s.count} <span style={{ color: '#9ca3af', fontWeight: 400 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: 6, background: '#F5F0E8', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No order data yet.</p>
          )}
        </div>
      </div>

      {/* ── Top Products ── */}
      {topProducts?.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Top Products</h3>
            <Link to="/admin/products" style={{ fontSize: '0.8rem', color: '#2E7D32', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <FiArrowRight size={13} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {topProducts.map((p: { _id: string; name: string; totalSold: number; totalRevenue: number }, i: number) => (
              <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: i < topProducts.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: i === 0 ? '#2E7D32' : '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: i === 0 ? '#fff' : '#6b7280' }}>#{i + 1}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{p.totalSold} sold</p>
                </div>
                <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2E7D32', flexShrink: 0 }}>{formatNaira(p.totalRevenue)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick links ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.875rem' }}>
        {[
          { label: 'Manage Products', to: '/admin/products', icon: <MdInventory size={18} />, color: '#8b5cf6' },
          { label: 'View Orders',     to: '/admin/orders',   icon: <MdShoppingBag size={18} />, color: '#E91E63' },
          { label: 'Testimonies',     to: '/admin/testimonies', icon: <MdCameraAlt size={18} />, color: '#f59e0b' },
          { label: 'Newsletter',      to: '/admin/newsletter',  icon: <MdEmail size={18} />, color: '#3b82f6' },
        ].map(q => (
          <Link key={q.to} to={q.to}
            style={{ background: '#fff', borderRadius: 14, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}>
            <span style={{ color: q.color }}>{q.icon}</span>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{q.label}</span>
          </Link>
        ))}
      </div>

      <style>{`
        .stat-grid { grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        @media (min-width: 640px)  { .stat-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .stat-grid { grid-template-columns: repeat(4, 1fr); } }
        .dash-mid { grid-template-columns: 1fr; }
        @media (min-width: 1024px) { .dash-mid { grid-template-columns: 1.4fr 1fr; } }
      `}</style>
    </div>
  );
}

const gridStyle: React.CSSProperties = { display: 'grid' };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
