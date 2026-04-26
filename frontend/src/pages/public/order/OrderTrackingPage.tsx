import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaLeaf, FaCheckCircle } from 'react-icons/fa';
import { FiPackage, FiArrowLeft } from 'react-icons/fi';
import { MdLocalShipping, MdPayment, MdInventory, MdDoneAll, MdCancel, MdOutlineDeliveryDining } from 'react-icons/md';
import { useOrderTracking, usePublicOrder, useMarkOrderReceived } from '@/hooks/orders/useOrders';
import { formatNaira, formatDateTime, getWhatsAppOrderLink, getMainImage } from '@/lib/utils';
import SEO from '@/components/SEO';
import type { OrderStatus, OrderTracking } from '@/types';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<OrderStatus, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  'Pending':           { icon: <FiPackage size={18} />,              color: '#92400e', bg: '#fef3c7', label: 'Order Placed' },
  'Payment Received':  { icon: <MdPayment size={18} />,              color: '#1e40af', bg: '#dbeafe', label: 'Payment Confirmed' },
  'Processing':        { icon: <MdInventory size={18} />,            color: '#5b21b6', bg: '#ede9fe', label: 'Being Prepared' },
  'Shipped':           { icon: <MdLocalShipping size={18} />,        color: '#1e3a8a', bg: '#e0e7ff', label: 'Shipped' },
  'Out for Delivery':  { icon: <MdOutlineDeliveryDining size={18} />,color: '#9d174d', bg: '#FDE8F0', label: 'Out for Delivery' },
  'Delivered':         { icon: <MdDoneAll size={18} />,              color: '#14532d', bg: '#dcfce7', label: 'Delivered' },
  'Cancelled':         { icon: <MdCancel size={18} />,               color: '#991b1b', bg: '#fee2e2', label: 'Cancelled' },
};

const STATUS_ORDER: OrderStatus[] = [
  'Pending', 'Payment Received', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered',
];

export default function OrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { data: tracking = [], isLoading: loadingTracking } = useOrderTracking(id!);
  const { data: order, isLoading: loadingOrder } = usePublicOrder(id!);
  const { mutate: markReceived, isPending: marking, isSuccess: marked } = useMarkOrderReceived();

  const isLoading = loadingTracking || loadingOrder;
  const currentStatus = order?.status;
  const cfg = currentStatus ? STATUS_CONFIG[currentStatus as OrderStatus] : null;
  const isDeliverable = currentStatus === 'Shipped' || currentStatus === 'Out for Delivery';
  const isCancelled = currentStatus === 'Cancelled';
  const isDelivered = currentStatus === 'Delivered';

  // Progress index for the stepper (cancelled has no step)
  const progressIdx = currentStatus && !isCancelled ? STATUS_ORDER.indexOf(currentStatus) : -1;

  if (isLoading) return <LoadingSkeleton />;

  if (!order) return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem 1rem' }}>
      <FiPackage size={40} style={{ color: '#e5e7eb' }} />
      <p style={{ color: '#6b7280', fontSize: '1rem' }}>Order not found.</p>
      <Link to="/shop" className="btn-green">Back to Shop</Link>
    </div>
  );

  return (
    <div style={{ background: '#F5F0E8', paddingTop: '5rem', paddingBottom: '5rem' }}>
      <SEO
        title={`Order #${order._id.slice(-8).toUpperCase()} — Tracking`}
        description={`Track your Curvenherbs order #${order._id.slice(-8).toUpperCase()}. Current status: ${order.status}.`}
        noIndex
      />

      {/* Hero banner */}
      <div style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', paddingTop: '3rem', paddingBottom: '3rem', marginTop: '-5rem', paddingLeft: 0, paddingRight: 0 }}>
        <div className="container-brand" style={{ paddingTop: '5rem' }}>
          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#86efac', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '1.25rem' }}>
            <FiArrowLeft size={14} /> Back to Shop
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ color: '#86efac', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Order Tracking</p>
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>
                #{order._id.slice(-10).toUpperCase()}
              </h1>
              <p style={{ color: '#bbf7d0', fontSize: '0.875rem', marginTop: '0.375rem' }}>
                Placed {formatDateTime(order.createdAt)} · {order.paymentMethod}
              </p>
            </div>
            {cfg && (
              <div style={{ background: cfg.bg, color: cfg.color, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.25rem', borderRadius: 9999, fontWeight: 700, fontSize: '0.875rem' }}>
                {cfg.icon} {cfg.label}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-brand" style={{ paddingTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="tracking-layout">

          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Progress stepper */}
            {!isCancelled && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '1.75rem' }}>
                  Delivery Progress
                </h2>
                <div style={{ position: 'relative' }}>
                  {/* Connector line */}
                  <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: '#EDE7D9', zIndex: 0 }} />
                  <div style={{ position: 'absolute', left: 19, top: 20, width: 2, background: '#2E7D32', zIndex: 1, height: `${Math.max(0, (progressIdx / (STATUS_ORDER.length - 1)) * 100)}%`, transition: 'height 0.6s ease' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                    {STATUS_ORDER.map((status, i) => {
                      const done = i <= progressIdx;
                      const active = i === progressIdx;
                      const sc = STATUS_CONFIG[status];
                      return (
                        <motion.div key={status} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                          style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                          {/* Circle */}
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: done ? '#2E7D32' : '#F5F0E8', border: `2px solid ${done ? '#2E7D32' : '#EDE7D9'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: done ? '#fff' : '#9ca3af', transition: 'all 0.3s', boxShadow: active ? '0 0 0 4px rgba(46,125,50,0.15)' : 'none' }}>
                            {done ? <FaCheckCircle size={16} /> : sc.icon}
                          </div>
                          <div style={{ paddingTop: '0.5rem' }}>
                            <p style={{ fontWeight: active ? 700 : done ? 600 : 400, fontSize: '0.9rem', color: done ? '#111827' : '#9ca3af' }}>{sc.label}</p>
                            {active && <p style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600, marginTop: '0.15rem' }}>Current status</p>}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Cancelled state */}
            {isCancelled && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <MdCancel size={32} style={{ color: '#ef4444' }} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '0.5rem' }}>Order Cancelled</h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  This order has been cancelled. If you have questions, contact us on WhatsApp.
                </p>
                <a href={getWhatsAppOrderLink(undefined, order._id)} target="_blank" rel="noreferrer" className="btn-green" style={{ justifyContent: 'center' }}>
                  <FaWhatsapp size={15} /> Contact Support
                </a>
              </div>
            )}

            {/* Tracking history */}
            {tracking.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '1.5rem' }}>
                  Tracking History
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[...tracking].reverse().map((entry: OrderTracking, i: number) => {
                    const sc = STATUS_CONFIG[entry.status] ?? { color: '#6b7280', bg: '#f3f4f6', icon: null };
                    return (
                      <motion.div key={entry._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: sc.bg, color: sc.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {sc.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.25rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{entry.status}</span>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{formatDateTime(entry.createdAt)}</span>
                          </div>
                          {entry.note && <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.2rem' }}>{entry.note}</p>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Mark as received CTA */}
            {isDeliverable && !marked && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', borderRadius: 20, padding: '1.75rem', boxShadow: '0 4px 24px rgba(46,125,50,0.25)' }}>
                <FaLeaf size={28} style={{ color: '#86efac', marginBottom: '0.875rem' }} className="leaf-float" />
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>
                  Received your order?
                </h3>
                <p style={{ color: '#bbf7d0', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.65 }}>
                  Let us know when your package arrives so we can mark it as delivered.
                </p>
                <button onClick={() => markReceived(order._id)} disabled={marking} className="btn-pink" style={{ justifyContent: 'center', width: '100%' }}>
                  {marking ? 'Confirming…' : '✓ Mark as Received'}
                </button>
              </motion.div>
            )}

            {/* Delivered success */}
            {(isDelivered || marked) && (
              <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <FaCheckCircle size={28} style={{ color: '#2E7D32' }} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '0.5rem' }}>
                  Order Delivered! 🎉
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.65 }}>
                  Thank you for your order. Use consistently for best results — visible changes in 4–8 weeks!
                </p>
              </div>
            )}

            {/* Order summary */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '1.25rem' }}>
                Order Summary
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.25rem' }}>
                {order.items.map((item: { product: any; quantity: number; priceAtPurchase: number }, i: number) => {
                  const p = item.product as any;
                  const img = p?.images ? getMainImage(p.images) : '/placeholder-product.jpg';
                  return (
                    <div key={i} style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                      <div style={{ width: 52, height: 52, borderRadius: 10, overflow: 'hidden', background: '#EDE7D9', flexShrink: 0 }}>
                        <img src={img} alt={p?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p?.name ?? 'Product'}</p>
                        <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Qty: {item.quantity}</p>
                      </div>
                      <p style={{ fontWeight: 700, fontSize: '0.875rem', color: '#2E7D32', flexShrink: 0 }}>
                        {formatNaira(item.priceAtPurchase * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div style={{ borderTop: '2px solid #F5F0E8', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, color: '#111827' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#E91E63' }}>{formatNaira(order.totalAmount)}</span>
              </div>
            </div>

            {/* Delivery info */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '1.25rem' }}>
                Delivery Details
              </h2>
              {[
                { label: 'Name',     value: order.customer.name },
                { label: 'Phone',    value: order.customer.phone },
                { label: 'Location', value: order.customer.location },
                { label: 'Address',  value: order.customer.address },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f9fafb', fontSize: '0.875rem' }}>
                  <span style={{ color: '#9ca3af' }}>{r.label}</span>
                  <span style={{ fontWeight: 500, color: '#111827', textAlign: 'right', maxWidth: '60%' }}>{r.value}</span>
                </div>
              ))}
              {order.trackingNumber && (
                <div style={{ marginTop: '0.875rem', background: '#F5F0E8', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#6b7280' }}>Tracking No: </span>
                  <span style={{ fontWeight: 700, color: '#2E7D32', fontFamily: 'monospace' }}>{order.trackingNumber}</span>
                </div>
              )}
            </div>

            {/* WhatsApp support */}
            <a href={getWhatsAppOrderLink(undefined, order._id)} target="_blank" rel="noreferrer"
              style={{ background: '#22c55e', borderRadius: 20, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(34,197,94,0.25)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(34,197,94,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(34,197,94,0.25)'; }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FaWhatsapp size={22} style={{ color: '#fff' }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>Need help with your order?</p>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem' }}>Chat with us on WhatsApp</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .tracking-layout { grid-template-columns: 1fr; }
        @media (min-width: 1024px) { .tracking-layout { grid-template-columns: 1.1fr 1fr; } }
      `}</style>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ background: '#F5F0E8', paddingTop: '8rem', paddingBottom: '5rem' }}>
      <div className="container-brand" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="skeleton" style={{ height: 120, borderRadius: 20 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="skeleton" style={{ height: 400, borderRadius: 20 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ height: 160, borderRadius: 20 }} />
            <div className="skeleton" style={{ height: 200, borderRadius: 20 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
