import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useUpdateOrderStatus } from '@/hooks/orders/useOrders';
import { formatNaira, formatDateTime, getWhatsAppOrderLink } from '@/lib/utils';
import OrderStatusBadge from './OrderStatusBadge';
import type { Order, OrderStatus } from '@/types';

const STATUSES: OrderStatus[] = [
  'Pending', 'Payment Received', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled',
];

interface Props { order: Order | null; onClose: () => void; }

export default function OrderDetailDrawer({ order, onClose }: Props) {
  const [note, setNote] = useState('');
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handleStatus = (status: OrderStatus) => {
    if (!order) return;
    updateStatus({ id: order._id, data: { status, note: note || undefined } }, {
      onSuccess: () => { setNote(''); onClose(); },
    });
  };

  return (
    <AnimatePresence>
      {order && (
        <>
          {/* Backdrop */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />

          {/* Drawer */}
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 480, background: '#fff', zIndex: 201, display: 'flex', flexDirection: 'column', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)' }}>

            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDE7D9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order</p>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
                  #{order._id.slice(-8).toUpperCase()}
                </h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <OrderStatusBadge status={order.status} />
                <button onClick={onClose} style={{ background: '#F5F0E8', border: 'none', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', display: 'flex' }}>
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Customer */}
              <Section title="Customer">
                <Row label="Name"     value={order.customer.name} />
                <Row label="Phone"    value={order.customer.phone} />
                {order.customer.email && <Row label="Email" value={order.customer.email} />}
                <Row label="Location" value={order.customer.location} />
                <Row label="Address"  value={order.customer.address} />
                <Row label="Payment"  value={order.paymentMethod} />
                <Row label="Source"   value={order.orderSource} />
                <Row label="Date"     value={formatDateTime(order.createdAt)} />
              </Section>

              {/* Items */}
              <Section title="Items">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {order.items.map((item, i) => {
                    const p = item.product as any;
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.625rem', background: '#F5F0E8', borderRadius: 10 }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827' }}>{p?.name ?? 'Product'}</p>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Qty: {item.quantity}</p>
                        </div>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2E7D32' }}>{formatNaira(item.priceAtPurchase * item.quantity)}</p>
                      </div>
                    );
                  })}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '2px solid #EDE7D9' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: '1rem', color: '#E91E63' }}>{formatNaira(order.totalAmount)}</span>
                  </div>
                </div>
              </Section>

              {/* Notes */}
              {order.notes && (
                <Section title="Notes">
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.65 }}>{order.notes}</p>
                </Section>
              )}

              {/* Update Status */}
              <Section title="Update Status">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.875rem' }}>
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => handleStatus(s)} disabled={isPending || s === order.status}
                      style={{ padding: '0.375rem 0.875rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, border: '1.5px solid', cursor: s === order.status ? 'default' : 'pointer', transition: 'all 0.15s',
                        borderColor: s === order.status ? '#2E7D32' : '#EDE7D9',
                        background: s === order.status ? '#2E7D32' : '#fff',
                        color: s === order.status ? '#fff' : '#374151',
                        opacity: isPending ? 0.6 : 1,
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
                <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Optional note for this status update..."
                  className="input-brand" rows={2} style={{ resize: 'none', fontSize: '0.85rem' }} />
              </Section>
            </div>

            {/* Footer actions */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #EDE7D9', display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
              <a href={`https://wa.me/${order.customer.whatsappNumber?.replace(/\D/g, '') || order.customer.phone?.replace(/\D/g, '')}`}
                target="_blank" rel="noreferrer" className="btn-green" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                <FaWhatsapp size={15} /> WhatsApp Customer
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.3rem 0', borderBottom: '1px solid #f9fafb' }}>
      <span style={{ color: '#9ca3af' }}>{label}</span>
      <span style={{ fontWeight: 500, color: '#111827', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
    </div>
  );
}
