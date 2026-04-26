import { useState, useMemo } from 'react';
import { useAllOrders } from '@/hooks/orders/useOrders';
import OrdersTable from './components/OrdersTable';
import OrderDetailDrawer from './components/OrderDetailDrawer';
import type { Order } from '@/types';

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  const { data: orders = [], isLoading } = useAllOrders(statusFilter ? { status: statusFilter } : undefined);

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter(o =>
      o.customer.name.toLowerCase().includes(q) ||
      o.customer.phone.includes(q) ||
      o._id.toLowerCase().includes(q)
    );
  }, [orders, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.875rem' }}>
        {[
          { label: 'Total', value: orders.length, color: '#2E7D32' },
          { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, color: '#f59e0b' },
          { label: 'Processing', value: orders.filter(o => o.status === 'Processing').length, color: '#8b5cf6' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: '#2E7D32' },
          { label: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <OrdersTable
        orders={filtered}
        isLoading={isLoading}
        search={search}
        onSearch={setSearch}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        onSelect={setSelected}
      />

      <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
