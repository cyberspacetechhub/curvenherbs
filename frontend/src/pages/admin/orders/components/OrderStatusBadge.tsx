import type { OrderStatus } from '@/types';

const COLORS: Record<OrderStatus, { bg: string; color: string }> = {
  'Pending':           { bg: '#fef3c7', color: '#92400e' },
  'Payment Received':  { bg: '#dbeafe', color: '#1e40af' },
  'Processing':        { bg: '#ede9fe', color: '#5b21b6' },
  'Shipped':           { bg: '#e0e7ff', color: '#3730a3' },
  'Out for Delivery':  { bg: '#FDE8F0', color: '#9d174d' },
  'Delivered':         { bg: '#dcfce7', color: '#14532d' },
  'Cancelled':         { bg: '#fee2e2', color: '#991b1b' },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const c = COLORS[status] ?? { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{ background: c.bg, color: c.color, fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: 9999, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {status}
    </span>
  );
}
