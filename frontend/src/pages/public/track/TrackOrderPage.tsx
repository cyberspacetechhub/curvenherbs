import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaLeaf, FaCheckCircle, FaBoxOpen } from 'react-icons/fa';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { useOrderTracking, useOrder, useMarkOrderReceived } from '@/hooks/orders/useOrders';
import { formatNaira, formatDateTime, getWhatsAppOrderLink, getMainImage } from '@/lib/utils';
import type { OrderStatus } from '@/types';
import SEO from '@/components/SEO';

const STATUS_CONFIG: Record<OrderStatus, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  'Pending':           { icon: <FaBoxOpen size={18} />,              color: '#92400e', bg: '#fef3c7', label: 'Order Placed' },
  'Payment Received':  { icon: <FaCheckCircle size={18} />,          color: '#1e40af', bg: '#dbeafe', label: 'Payment Confirmed' },
  'Processing':        { icon: <FaLeaf size={18} />,                color: '#5b21b6', bg: '#ede9fe', label: 'Being Prepared' },
  'Shipped':           { icon: <FaLeaf size={18} />,                color: '#1e3a8a', bg: '#e0e7ff', label: 'Shipped' },
  'Out for Delivery':  { icon: <FaLeaf size={18} />,                color: '#9d174d', bg: '#FDE8F0', label: 'Out for Delivery' },
  'Delivered':         { icon: <FaCheckCircle size={18} />,          color: '#14532d', bg: '#dcfce7', label: 'Delivered' },
  'Cancelled':         { icon: <FaLeaf size={18} />,                color: '#991b1b', bg: '#fee2e2', label: 'Cancelled' },
};

const STATUS_ORDER: OrderStatus[] = [
  'Pending', 'Payment Received', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered',
];

export default function TrackOrderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inputId, setInputId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  // If we have an id in the URL, fetch the order
  const { data: tracking = [], isLoading: loadingTracking } = useOrderTracking(id!);
  const { data: order, isLoading: loadingOrder } = useOrder(id!);
  const { mutate: markReceived, isPending: marking, isSuccess: marked } = useMarkOrderReceived();

  const isLoading = loadingTracking || loadingOrder;

  // Enable scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const savedScrollPos = sessionStorage.getItem(`scroll-pos-${window.location.pathname}`);
    if (savedScrollPos) {
      const pos = parseInt(savedScrollPos, 10);
      window.scrollTo({ top: pos, behavior: 'auto' });
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem(`scroll-pos-${window.location.pathname}`, window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Restore scroll position when navigating between tracked/non-tracked states
  useEffect(() => {
    if (id) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  const handleSearch = () => {
    const trimmed = inputId.trim();
    if (!trimmed) {
      setError('Please enter an order ID');
      return;
    }
    setIsSearching(true);
    setError('');
    navigate(`/orders/${trimmed}/tracking`);
    setTimeout(() => setIsSearching(false), 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  // If we have an ID but no matching order
  if (id && !isLoading && !order) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '4rem 1rem' }}>
        <FaBoxOpen size={50} style={{ color: '#e5e7eb' }} />
        <p style={{ color: '#6b7280', fontSize: '1rem', textAlign: 'center' }}>Order not found.</p>
        <Link to="/orders/track" style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', borderRadius: 10, background: '#2E7D32', color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Track Another Order</Link>
      </div>
    );
  }

  // If we have an ID and an order, show the tracking display
  if (id && order) {
    return <OrderTrackingDisplay 
      order={order} 
      tracking={tracking} 
      isLoading={isLoading}
      marking={marking}
      marked={marked}
      markReceived={markReceived}
    />;
  }

  // Otherwise, show the tracking form
  return (
    <div style={{ background: '#F5F0E8', paddingTop: '5rem', paddingBottom: '5rem', minHeight: '60vh' }}>
      <SEO
        title="Track Your Order"
        description="Track your Curvenherbs order status in real time. Enter your order ID to see delivery progress."
        url="/orders/track"
        noIndex
      />
      <div className="container-brand">
        {/* Back link */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#86efac', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '1.5rem' }}>
          <FiArrowLeft size={14} /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(46,125,50,0.1)', borderRadius: 9999, padding: '0.4rem 1rem', marginBottom: '1.25rem' }}>
              <FaLeaf size={14} style={{ color: '#2E7D32' }} />
              <span style={{ color: '#2E7D32', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order Tracking</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#111827', marginBottom: '0.75rem' }}>
              Track Your Order
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.6, maxWidth: 520, margin: '0 auto' }}>
              Enter your order ID below to check the status and delivery progress. Found in your order confirmation.
            </p>
          </div>
        </motion.div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ maxWidth: 560, margin: '0 auto 3rem' }}
        >
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '1.1rem' }} />
              <input
                type="text"
                value={inputId}
                onChange={(e) => {
                  setInputId(e.target.value);
                  setError('');
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter your order ID (e.g., 507f1f77bcf86cd799439011)"
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem 0.9rem 2.75rem',
                  borderRadius: 12,
                  border: error ? '2px solid #ef4444' : '2px solid #EDE7D9',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#2E7D32';
                  e.currentTarget.style.boxShadow = '0 0 0 4px rgba(46,125,50,0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = error ? '#ef4444' : '#EDE7D9';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="btn-green"
              style={{ padding: '0 1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: 12, fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              {isSearching ? (
                <>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid #fff', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                  Searching...
                </>
              ) : (
                <>
                  <FiSearch size={16} />
                  Track
                </>
              )}
            </button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem', marginLeft: '0.25rem' }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recent order hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ textAlign: 'center', padding: '1.5rem', background: '#fff', borderRadius: 20, maxWidth: 560, margin: '0 auto' }}
        >
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
            Just placed an order?
          </p>
          <Link to="/checkout" className="btn-outline-pink" style={{ padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: 10, fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', color: '#E91E63', border: '2px solid #FDE8F0', background: '#fff' }}>
            View Recent Orders
          </Link>
        </motion.div>

        {/* Need help section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: '2rem', padding: '1.5rem', background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', borderRadius: 20, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}
        >
          <FaLeaf size={28} style={{ color: '#86efac', marginBottom: '0.75rem' }} />
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>
            Can't find your order?
          </h3>
          <p style={{ color: '#bbf7d0', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Contact us on WhatsApp — we'll help you locate it.
          </p>
          <a href={getWhatsAppOrderLink()} target="_blank" rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fff', color: '#E91E63', fontWeight: 700, fontSize: '0.875rem', padding: '0.625rem 1.25rem', borderRadius: 9999, textDecoration: 'none' }}>
            <FaWhatsapp size={16} />
            Chat with Support
          </a>
        </motion.div>
      </div>
    </div>
  );
};

// Extracted display component to keep the main component cleaner
interface OrderTrackingDisplayProps {
  order: any;
  tracking: any[];
  isLoading: boolean;
  marking: boolean;
  marked: boolean;
  markReceived: (id: string) => void;
}

function OrderTrackingDisplay({ order, tracking, isLoading, marking, marked, markReceived }: OrderTrackingDisplayProps) {
  const currentStatus = order?.status;
  const cfg = currentStatus ? STATUS_CONFIG[currentStatus as OrderStatus] : null;
  const isDeliverable = currentStatus === 'Shipped' || currentStatus === 'Out for Delivery';
  const isCancelled = currentStatus === 'Cancelled';
  const isDelivered = currentStatus === 'Delivered';
  const progressIdx = currentStatus && !isCancelled ? STATUS_ORDER.indexOf(currentStatus) : -1;

  if (isLoading) {
    return (
      <div style={{ background: '#F5F0E8', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container-brand">
          <div className="skeleton" style={{ height: 120, borderRadius: 20 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
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

  return (
    <div style={{ background: '#F5F0E8', paddingTop: '5rem', paddingBottom: '5rem' }}>
      <div className="container-brand">
        {/* Hero banner */}
        <div style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', paddingTop: '3rem', paddingBottom: '3rem', marginTop: '-5rem', paddingLeft: 0, paddingRight: 0 }}>
          <div className="container-brand" style={{ paddingTop: '5rem' }}>
            <Link to="/orders/track" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#86efac', fontSize: '0.875rem', textDecoration: 'none', marginBottom: '1.25rem' }}>
              <FiArrowLeft size={14} /> Back to Track Order
            </Link>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ color: '#86efac', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>Order Tracking</p>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: '#fff', lineHeight: 1.2 }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Progress stepper */}
              {!isCancelled && (
                <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '1.75rem' }}>
                    Delivery Progress
                  </h2>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 2, background: '#EDE7D9', zIndex: 0 }} />
                    <div style={{ position: 'absolute', left: 19, top: 20, width: 2, background: '#2E7D32', zIndex: 1, height: `${Math.max(0, (progressIdx / (STATUS_ORDER.length - 1)) * 100)}%`, transition: 'height 0.6s ease' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                      {STATUS_ORDER.map((status, i) => {
                        const done = i <= progressIdx;
                        const active = i === progressIdx;
                        const sc = STATUS_CONFIG[status];
                        return (
                          <div key={status} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: done ? '#2E7D32' : '#F5F0E8', border: `2px solid ${done ? '#2E7D32' : '#EDE7D9'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: done ? '#fff' : '#9ca3af', transition: 'all 0.3s', boxShadow: active ? '0 0 0 4px rgba(46,125,50,0.15)' : 'none' }}>
                              {done ? <FaCheckCircle size={16} /> : sc.icon}
                            </div>
                            <div style={{ paddingTop: '0.5rem' }}>
                              <p style={{ fontWeight: active ? 700 : done ? 600 : 400, fontSize: '0.9rem', color: done ? '#111827' : '#9ca3af' }}>{sc.label}</p>
                              {active && <p style={{ fontSize: '0.75rem', color: '#2E7D32', fontWeight: 600, marginTop: '0.15rem' }}>Current status</p>}
                            </div>
                          </div>
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
                    <FaLeaf size={32} style={{ color: '#ef4444' }} />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '0.5rem' }}>Order Cancelled</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                    This order has been cancelled. If you have questions, contact us on WhatsApp.
                  </p>
                  <a href={getWhatsAppOrderLink(undefined, order._id)} target="_blank" rel="noreferrer" className="btn-green" style={{ justifyContent: 'center', padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', borderRadius: 10, fontWeight: 600, background: '#2E7D32', color: '#fff', textDecoration: 'none' }}>
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
                    {[...tracking].reverse().map((entry) => {
                      const sc = STATUS_CONFIG[entry.status as OrderStatus] ?? { color: '#6b7280', bg: '#f3f4f6', icon: <FaLeaf size={14} /> };
                      return (
                        <div key={entry._id} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
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
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Mark as received CTA */}
              {isDeliverable && !marked && (
                <div style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', borderRadius: 20, padding: '1.75rem', boxShadow: '0 4px 24px rgba(46,125,50,0.25)' }}>
                  <FaLeaf size={28} style={{ color: '#86efac', marginBottom: '0.875rem' }} />
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>
                    Received your order?
                  </h3>
                  <p style={{ color: '#bbf7d0', fontSize: '0.875rem', marginBottom: '1.25rem', lineHeight: 1.65 }}>
                    Let us know when your package arrives so we can mark it as delivered.
                  </p>
                  <button onClick={() => markReceived(order._id)} disabled={marking} style={{ justifyContent: 'center', width: '100%', padding: '0.75rem 1.5rem', borderRadius: 10, fontWeight: 600, background: '#fff', color: '#E91E63', border: 'none', cursor: 'pointer' }}>
                    {marking ? 'Confirming…' : '✓ Mark as Received'}
                  </button>
                </div>
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
                    const p = item.product;
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
                  { label: 'Name',     value: order?.customer?.name },
                  { label: 'Phone',    value: order?.customer?.phone },
                  { label: 'Location', value: order?.customer?.location },
                  { label: 'Address',  value: order?.customer?.address },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f9fafb', fontSize: '0.875rem' }}>
                    <span style={{ color: '#9ca3af' }}>{r.label}</span>
                    <span style={{ fontWeight: 500, color: '#111827', textAlign: 'right', maxWidth: '60%' }}>{r.value}</span>
                  </div>
                ))}
                {order?.trackingNumber && (
                  <div style={{ marginTop: '0.875rem', background: '#F5F0E8', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#6b7280' }}>Tracking No: </span>
                    <span style={{ fontWeight: 700, color: '#2E7D32', fontFamily: 'monospace' }}>{order.trackingNumber}</span>
                  </div>
                )}
              </div>

              {/* WhatsApp support */}
              <a href={getWhatsAppOrderLink(undefined, order?._id)} target="_blank" rel="noreferrer"
                style={{ background: '#22c55e', borderRadius: 20, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(34,197,94,0.25)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
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
      </div>
    </div>
  );
}
