import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaLock, FaLeaf, FaMoneyBillWave } from 'react-icons/fa';
import { FiTrash2, FiPlus, FiMinus, FiTag, FiCreditCard, FiInfo } from 'react-icons/fi';
import { MdPayment, MdAccountBalance } from 'react-icons/md';

// ── Delivery fees by Nigerian state name (lowercase) ──────────────────────────
const NG_DELIVERY_FEES: Record<string, number> = {
  // Ebonyi (home state — cheapest)
  'ebonyi':          1000,
  // South-East
  'enugu':           1500,
  'anambra':         1500,
  'imo':             1500,
  'abia':            1500,
  // South-South
  'rivers':          2000,
  'delta':           2000,
  'cross river':     2000,
  'akwa ibom':       2000,
  'bayelsa':         2000,
  'edo':             2000,
  // South-West
  'lagos':           2500,
  'ogun':            2500,
  'oyo':             2500,
  'osun':            2500,
  'ondo':            2500,
  'ekiti':           2500,
  // North-Central
  'abuja':           2500,
  'fct':             2500,
  'kogi':            2500,
  'benue':           2000,
  'plateau':         2500,
  'nassarawa':       2500,
  'niger':           3000,
  'kwara':           2500,
  // North-West
  'kano':            3000,
  'kaduna':          3000,
  'katsina':         3500,
  'sokoto':          3500,
  'zamfara':         3500,
  'kebbi':           3500,
  'jigawa':          3500,
  // North-East
  'borno':           4000,
  'yobe':            4000,
  'adamawa':         3500,
  'gombe':           3500,
  'bauchi':          3500,
  'taraba':          3000,
};
const DEFAULT_NG_FEE = 3000; // fallback for any unlisted state
const INTL_FEE = 15000;      // flat fee for non-Nigeria

function getDeliveryFee(countryCode: string, stateName: string): number | null {
  if (!countryCode || !stateName) return null;
  if (countryCode !== 'NG') return INTL_FEE;
  const key = stateName.toLowerCase().replace(/\s+state$/i, '').trim();
  return NG_DELIVERY_FEES[key] ?? DEFAULT_NG_FEE;
}

import { useCartStore } from '@/store/cartStore';
import { useCountries, useStates, useCities } from '@/hooks/locations/useLocations';
import { useValidateCoupon, usePlaceOrder } from '@/hooks/orders/useOrders';
import { checkoutSchema, type CheckoutFormData } from '@/lib/schemas';
import { formatNaira, getMainImage, getWhatsAppOrderLink } from '@/lib/utils';
import type { PaymentMethod } from '@/types';
import SEO from '@/components/SEO';

export type PaymentMethodExtended = PaymentMethod | 'Paystack';

const BASE_PAYMENT_METHODS: { value: PaymentMethodExtended; label: string; icon: React.ReactNode; desc: string; ebonyiOnly?: boolean; disabled?: boolean }[] = [
  { value: 'Bank Transfer',    label: 'Bank Transfer',       icon: <MdAccountBalance size={22} />, desc: 'Transfer to our account, send proof on WhatsApp' },
  { value: 'WhatsApp Order',   label: 'Order via WhatsApp',  icon: <FaWhatsapp size={22} />,       desc: 'Complete your order directly on WhatsApp' },
  { value: 'Cash on Delivery', label: 'Cash on Delivery',    icon: <FaMoneyBillWave size={22} />,  desc: 'Pay when your order arrives — Ebonyi State only', ebonyiOnly: true },
  { value: 'Paystack',         label: 'Pay with Paystack',   icon: <FiCreditCard size={22} />,     desc: 'Coming soon — online card payment', disabled: true },
];

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '0.72rem', color: '#E91E63' }}>{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedStateName, setSelectedStateName] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const { data: countries } = useCountries();
  const { data: states } = useStates(selectedCountry);
  const { data: cities } = useCities(selectedCountry, selectedState);
  const { mutate: validateCoupon, isPending: validatingCoupon } = useValidateCoupon();
  const { mutate: placeOrder, isPending: placingOrder } = usePlaceOrder();

  const subtotal = totalAmount();
  const deliveryFee = useMemo(() => getDeliveryFee(selectedCountry, selectedStateName), [selectedCountry, selectedStateName]);
  const isEbonyi = useMemo(() => {
    const key = selectedStateName.toLowerCase().replace(/\s+state$/i, '').trim();
    return key === 'ebonyi';
  }, [selectedStateName]);
  const PAYMENT_METHODS = BASE_PAYMENT_METHODS.map(pm =>
    pm.ebonyiOnly ? { ...pm, disabled: !isEbonyi } : pm
  );
  const total = Math.max(0, subtotal - discount) + (deliveryFee ?? 0);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'Bank Transfer' },
  });

  const paymentMethod = watch('paymentMethod') as PaymentMethodExtended;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    validateCoupon({ code: couponCode, totalAmount: subtotal }, {
      onSuccess: (data) => {
        setDiscount(data.discount);
        setCouponApplied(couponCode);
      },
      onError: () => alert('Invalid or expired coupon code'),
    });
  };

  const onSubmit = (data: CheckoutFormData) => {
    if (items.length === 0) return;

    const country = countries?.find((c: import('@/types').Country) => c.code === data.country);
    const state = states?.find((s: import('@/types').State) => s.code === data.state);

    const deliveryNote = deliveryFee != null ? `Delivery fee: ${formatNaira(deliveryFee)}` : '';
    placeOrder({
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        whatsappNumber: data.whatsappNumber || data.phone,
        location: `${state?.name || data.state}, ${country?.name || data.country}`,
        address: data.address,
      },
      items: items.map(i => ({ product: i.product._id, quantity: i.quantity })),
      paymentMethod: data.paymentMethod as any,
      notes: [data.notes, deliveryNote].filter(Boolean).join(' | '),
      couponCode: couponApplied || undefined,
    }, {
      onSuccess: (order) => {
        clearCart();
        if ((data.paymentMethod as PaymentMethodExtended) === 'WhatsApp Order') {
          const msg = `Hello Curvenherbs! I'd like to place an order.\n\nOrder ID: #${order._id}\nItems: ${items.map(i => `${i.product.name} x${i.quantity}`).join(', ')}\nTotal: ${formatNaira(total)}\nDelivery: ${data.address}`;
          window.open(`https://wa.me/2348149838596?text=${encodeURIComponent(msg)}`, '_blank');
        }
        setOrderSuccess(order._id);
      },
    });
  };

  // Empty cart
  if (items.length === 0 && !orderSuccess) {
    return (
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0E8', padding: '2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', marginBottom: '0.75rem' }}>Your cart is empty</h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Add some products to get started on your curve journey!</p>
            <button onClick={() => navigate('/shop')} className="btn-pink">Browse Products</button>
          </div>
        </main>
    );
  }

  // Order success
  if (orderSuccess) {
    return (
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F0E8', padding: '2rem' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ background: '#fff', borderRadius: 24, padding: '2.5rem', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <FaLeaf size={32} style={{ color: '#2E7D32' }} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', color: '#1a1a1a', marginBottom: '0.75rem' }}>
              Order Placed! 🎉
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
              Your order <strong style={{ color: '#2E7D32' }}>#{orderSuccess}</strong> has been received.
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '2rem' }}>
              We'll confirm your order and send updates via email. You can also track your order status below.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a href={getWhatsAppOrderLink(undefined, orderSuccess)} target="_blank" rel="noreferrer" className="btn-green" style={{ justifyContent: 'center' }}>
                <FaWhatsapp size={17} /> Chat with Us on WhatsApp
              </a>
              <button onClick={() => navigate(`/orders/${orderSuccess}/tracking`)} className="btn-outline-pink" style={{ justifyContent: 'center' }}>
                Track My Order
              </button>
              <button onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', color: '#6b7280', fontSize: '0.875rem', cursor: 'pointer', marginTop: '0.25rem' }}>
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </main>
    );
  }

  return (
    <>
      <SEO
        title="Checkout"
        description="Complete your Curvenherbs order. Secure checkout with Bank Transfer, WhatsApp Order, or Cash on Delivery (Ebonyi State)."
        url="/checkout"
        noIndex
      />
      <div style={{ background: 'linear-gradient(135deg, #1B5E20, #2E7D32)', paddingTop: '6.5rem', paddingBottom: '2rem' }}>
        <div className="container-brand">
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#fff' }}>
            Checkout
          </h1>
          <p style={{ color: '#bbf7d0', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            {items.length} item{items.length !== 1 ? 's' : ''} · {formatNaira(subtotal)}
          </p>
        </div>
      </div>

      <main style={{ flex: 1, background: '#F5F0E8', padding: '2.5rem 0 4rem' }}>
        <div className="container-brand">
          <form onSubmit={handleSubmit(onSubmit)} className="checkout-layout">

            {/* ── Left: Form ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Delivery info */}
              <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1a1a1a' }}>
                  Delivery Information
                </h3>
                <div className="form-grid">
                  <FormField label="Full Name *" error={errors.name?.message}>
                    <input {...register('name')} className={`input-brand${errors.name ? ' error' : ''}`} placeholder="Your full name" />
                  </FormField>
                  <FormField label="Email Address *" error={errors.email?.message}>
                    <input {...register('email')} type="email" className={`input-brand${errors.email ? ' error' : ''}`} placeholder="your@email.com" />
                  </FormField>
                  <FormField label="Phone Number *" error={errors.phone?.message}>
                    <input {...register('phone')} className={`input-brand${errors.phone ? ' error' : ''}`} placeholder="08012345678" />
                  </FormField>
                  <FormField label="WhatsApp Number" error={errors.whatsappNumber?.message}>
                    <input {...register('whatsappNumber')} className="input-brand" placeholder="Same as phone if same" />
                  </FormField>
                  <FormField label="Country *" error={errors.country?.message}>
                    <select {...register('country')} className={`input-brand${errors.country ? ' error' : ''}`}
                      onChange={e => { setValue('country', e.target.value); setSelectedCountry(e.target.value); setSelectedState(''); setValue('state', ''); setValue('city', ''); }}
                      style={{ cursor: 'pointer' }}>
                      <option value="">Select country</option>
                      {countries?.map((c: import('@/types').Country) => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
                    </select>
                  </FormField>
                  <FormField label="State / Region *" error={errors.state?.message}>
                    <select {...register('state')} className={`input-brand${errors.state ? ' error' : ''}`}
                      disabled={!selectedCountry}
                      onChange={e => { const opt = e.target.options[e.target.selectedIndex]; setValue('state', e.target.value); setSelectedState(e.target.value); setSelectedStateName(opt.text); setValue('city', ''); }}
                      style={{ cursor: selectedCountry ? 'pointer' : 'not-allowed', opacity: selectedCountry ? 1 : 0.6 }}>
                      <option value="">Select state</option>
                      {states?.map((s: import('@/types').State) => <option key={s.code} value={s.code}>{s.name}</option>)}
                    </select>
                  </FormField>
                  <FormField label="City" error={errors.city?.message}>
                    <select {...register('city')} className="input-brand"
                      disabled={!selectedState}
                      style={{ cursor: selectedState ? 'pointer' : 'not-allowed', opacity: selectedState ? 1 : 0.6 }}>
                      <option value="">Select city (optional)</option>
                      {cities?.map((c: import('@/types').City) => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Delivery Address *" error={errors.address?.message}>
                    <input {...register('address')} className={`input-brand${errors.address ? ' error' : ''}`} placeholder="Street address, landmark..." />
                  </FormField>
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <FormField label="Order Notes (optional)" error={errors.notes?.message}>
                    <textarea {...register('notes')} className="input-brand" rows={3}
                      placeholder="Any special instructions for your order..."
                      style={{ resize: 'vertical', minHeight: 80 }} />
                  </FormField>
                </div>
              </div>

              {/* Payment method */}
              <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1a1a1a' }}>
                  Payment Method
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {PAYMENT_METHODS.map(pm => (
                    <label key={pm.value}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem',
                        borderRadius: 14, cursor: pm.disabled ? 'not-allowed' : 'pointer',
                        border: `2px solid ${paymentMethod === pm.value ? '#2E7D32' : '#f3f4f6'}`,
                        background: paymentMethod === pm.value ? '#f0fdf4' : pm.disabled ? '#fafafa' : '#fff',
                        opacity: pm.disabled ? 0.6 : 1,
                        transition: 'all 0.2s',
                      }}>
                      <input type="radio" {...register('paymentMethod')} value={pm.value}
                        disabled={pm.disabled} style={{ display: 'none' }} />
                      <span style={{ flexShrink: 0, color: paymentMethod === pm.value ? '#2E7D32' : '#6b7280', display: 'flex' }}>{pm.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a' }}>{pm.label}</p>
                          {pm.disabled && (
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, background: '#FDE8F0', color: '#C2185B', padding: '0.15rem 0.5rem', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.15rem' }}>{pm.desc}</p>
                      </div>
                      {paymentMethod === pm.value && (
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                        </div>
                      )}
                    </label>
                  ))}
                </div>

                {/* Paystack placeholder */}
                <AnimatePresence>
                  {paymentMethod === 'Paystack' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #FDE8F0, #fff)', border: '1px dashed #E91E63', borderRadius: 14, padding: '1.5rem', textAlign: 'center' }}>
                      <MdPayment size={36} style={{ color: '#E91E63', marginBottom: '0.75rem' }} />
                      <h4 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>
                        Paystack Integration Coming Soon
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
                        We're working on bringing you seamless card payments. For now, please use Bank Transfer or WhatsApp Order.
                      </p>
                      <button type="button" onClick={() => setValue('paymentMethod', 'Bank Transfer')} className="btn-pink" style={{ fontSize: '0.8rem', padding: '0.5rem 1.25rem' }}>
                        Switch to Bank Transfer
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bank transfer details */}
                <AnimatePresence>
                  {paymentMethod === 'Bank Transfer' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      style={{ marginTop: '1rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '1.25rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#1B5E20', marginBottom: '0.75rem' }}>Bank Transfer Details:</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {[['Bank', 'First Bank Nigeria'], ['Account Name', 'Curvenherbs Ltd'], ['Account Number', '1234567890']].map(([k, v]) => (
                          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                            <span style={{ color: '#6b7280' }}>{k}:</span>
                            <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#2E7D32', marginTop: '0.75rem' }}>
                        After transfer, send proof of payment to WhatsApp: 08149838596
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Cart items */}
              <div style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#1a1a1a' }}>
                  Order Summary ({items.length})
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: 320, overflowY: 'auto' }}>
                  {items.map(item => (
                    <div key={item.product._id} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
                      <div style={{ width: 64, height: 64, borderRadius: 12, overflow: 'hidden', flexShrink: 0, background: '#EDE7D9' }}>
                        <img src={getMainImage(item.product.images)} alt={item.product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a1a', lineHeight: 1.3, marginBottom: '0.25rem' }}>
                          {item.product.name}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: '#E91E63', fontWeight: 700 }}>
                          {formatNaira((item.product.discountedPrice ?? item.product.price) * item.quantity)}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
                          <button type="button" onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiMinus size={11} />
                          </button>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FiPlus size={11} />
                          </button>
                          <button type="button" onClick={() => removeItem(item.product._id)}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '0.25rem' }}>
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <FiTag size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                      <input value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon code" className="input-brand"
                        style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
                    </div>
                    <button type="button" onClick={handleApplyCoupon} disabled={validatingCoupon || !couponCode}
                      className="btn-green" style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', flexShrink: 0 }}>
                      {validatingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponApplied && (
                    <p style={{ fontSize: '0.78rem', color: '#2E7D32', fontWeight: 600, marginTop: '0.4rem' }}>
                      ✓ Coupon applied — you save {formatNaira(discount)}!
                    </p>
                  )}
                </div>

                {/* Totals */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                    <span>Subtotal</span><span>{formatNaira(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#2E7D32', fontWeight: 600 }}>
                      <span>Discount</span><span>-{formatNaira(discount)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>Delivery</span>
                    <span style={{ color: '#2E7D32', fontWeight: 600 }}>
                      {deliveryFee == null ? 'Select state first' : formatNaira(deliveryFee)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#1a1a1a', paddingTop: '0.5rem', borderTop: '2px solid #f3f4f6' }}>
                    <span>Total</span><span style={{ color: '#E91E63' }}>{formatNaira(total)}</span>
                  </div>
                </div>
              </div>

              {/* COD restriction notice */}
              {paymentMethod === 'Cash on Delivery' && !isEbonyi && (
                <div style={{ background: '#FDE8F0', border: '1px solid #F8C1D4', borderRadius: 12, padding: '0.75rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: '#C2185B' }}>
                  <FiInfo size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                  Cash on Delivery is only available within Ebonyi State. Please select a different payment method.
                </div>
              )}

              {/* Place order button */}
              <button type="submit" disabled={placingOrder || paymentMethod === 'Paystack' || (paymentMethod === 'Cash on Delivery' && !isEbonyi)}
                className="btn-pink" style={{ justifyContent: 'center', padding: '1rem', fontSize: '1rem', width: '100%' }}>
                {placingOrder ? 'Placing Order...' : (paymentMethod as PaymentMethodExtended) === 'WhatsApp Order' ? <><FaWhatsapp size={18} /> Order via WhatsApp</> : <><FaLock size={15} /> Place Order — {formatNaira(total)}{deliveryFee == null ? ' + delivery' : ''}</>}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <FaLock size={11} style={{ color: '#9ca3af' }} />
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Secure checkout · Your data is protected</p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <style>{`
        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .form-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .checkout-layout { grid-template-columns: 1fr 420px; gap: 2rem; }
        }
      `}</style>
    </>
  );
}
