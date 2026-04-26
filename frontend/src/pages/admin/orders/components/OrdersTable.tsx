import { FiSearch, FiEye } from 'react-icons/fi';
import { formatNaira, formatDate } from '@/lib/utils';
import OrderStatusBadge from './OrderStatusBadge';
import type { Order } from '@/types';

const STATUS_FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Payment Received', value: 'Payment Received' },
  { label: 'Processing', value: 'Processing' },
  { label: 'Shipped', value: 'Shipped' },
  { label: 'Out for Delivery', value: 'Out for Delivery' },
  { label: 'Delivered', value: 'Delivered' },
  { label: 'Cancelled', value: 'Cancelled' },
];

interface Props {
  orders: Order[];
  isLoading: boolean;
  search: string;
  onSearch: (v: string) => void;
  statusFilter: string;
  onStatusFilter: (v: string) => void;
  onSelect: (order: Order) => void;
}

export default function OrdersTable({ orders, isLoading, search, onSearch, statusFilter, onStatusFilter, onSelect }: Props) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

      {/* Toolbar */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDE7D9', display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input value={search} onChange={e => onSearch(e.target.value)}
            placeholder="Search by name, phone, ID..."
            className="input-brand" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {STATUS_FILTERS.map(f => (
            <button key={f.value} onClick={() => onStatusFilter(f.value)}
              style={{ padding: '0.35rem 0.875rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                background: statusFilter === f.value ? '#2E7D32' : '#F5F0E8',
                color: statusFilter === f.value ? '#fff' : '#6b7280',
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#F5F0E8' }}>
              {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} style={{ padding: '0.875rem 1rem' }}>
                      <div className="skeleton" style={{ height: 14, borderRadius: 6, width: j === 1 ? 120 : 70 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id}
                  onClick={() => onSelect(order)}
                  style={{ borderBottom: '1px solid #f9fafb', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafaf9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: '#2E7D32', fontFamily: 'monospace' }}>
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <p style={{ fontWeight: 600, color: '#111827' }}>{order.customer.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{order.customer.phone}</p>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#374151' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: '#111827' }}>{formatNaira(order.totalAmount)}</td>
                  <td style={{ padding: '0.875rem 1rem', color: '#6b7280' }}>{order.paymentMethod}</td>
                  <td style={{ padding: '0.875rem 1rem' }}><OrderStatusBadge status={order.status} /></td>
                  <td style={{ padding: '0.875rem 1rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>{formatDate(order.createdAt)}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <button style={{ background: '#F5F0E8', border: 'none', borderRadius: 8, padding: '0.375rem 0.625rem', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#374151' }}>
                      <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
