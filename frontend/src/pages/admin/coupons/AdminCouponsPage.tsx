import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi';
import { MdLocalOffer } from 'react-icons/md';
import { useCoupons, useCreateCoupon, useUpdateCoupon, useToggleCoupon, useDeleteCoupon } from '@/hooks/coupons/useCoupons';
import { formatDate } from '@/lib/utils';
import type { Coupon, CouponPayload, CouponType } from '@/types';

type FormData = {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxUses: number;
  expiresAt: string;
};

export default function AdminCouponsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [copied, setCopied] = useState('');

  const { data: coupons = [], isLoading } = useCoupons();
  const { mutate: create, isPending: creating, error: createError } = useCreateCoupon();
  const { mutate: update, isPending: updating } = useUpdateCoupon();
  const { mutate: toggle } = useToggleCoupon();
  const { mutate: deleteCoupon, isPending: deleting } = useDeleteCoupon();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: { type: 'percentage', value: 10, minOrderAmount: 0, maxUses: 0 },
  });

  const openAdd = () => { setEditing(null); reset({ type: 'percentage', value: 10, minOrderAmount: 0, maxUses: 0, code: '', expiresAt: '' }); setModalOpen(true); };
  const openEdit = (c: Coupon) => {
    setEditing(c);
    reset({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrderAmount: c.minOrderAmount ?? 0,
      maxUses: c.maxUses ?? 0,
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
    });
    setModalOpen(true);
  };

  const onSubmit = (data: FormData) => {
    const payload: CouponPayload = {
      code: data.code.toUpperCase().trim(),
      type: data.type,
      value: Number(data.value),
      minOrderAmount: data.minOrderAmount ? Number(data.minOrderAmount) : undefined,
      maxUses: data.maxUses ? Number(data.maxUses) : undefined,
      expiresAt: data.expiresAt || undefined,
    };
    if (editing) {
      update({ id: editing._id, data: payload }, { onSuccess: () => { reset(); setModalOpen(false); setEditing(null); } });
    } else {
      create(payload, { onSuccess: () => { reset(); setModalOpen(false); } });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  };

  const apiError = (createError as any)?.response?.data?.message;
  const active = coupons.filter((c: Coupon) => c.isActive).length;
  const expired = coupons.filter((c: Coupon) => c.expiresAt && new Date(c.expiresAt) < new Date()).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.875rem' }}>
        {[
          { label: 'Total Coupons', value: coupons.length, color: '#2E7D32' },
          { label: 'Active', value: active, color: '#2E7D32' },
          { label: 'Inactive', value: coupons.length - active, color: '#9ca3af' },
          { label: 'Expired', value: expired, color: '#ef4444' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDE7D9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <MdLocalOffer size={18} style={{ color: '#2E7D32' }} />
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Coupon Codes</h3>
          </div>
          <button onClick={openAdd} className="btn-pink" style={{ fontSize: '0.82rem', padding: '0.5rem 1.1rem' }}>
            <FiPlus size={14} /> Add Coupon
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F5F0E8' }}>
                {['Code', 'Type', 'Value', 'Min Order', 'Uses', 'Expires', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} style={{ padding: '0.875rem 1.25rem' }}>
                      <div className="skeleton" style={{ height: 14, borderRadius: 6, width: j === 0 ? 100 : 60 }} />
                    </td>
                  ))}</tr>
                ))
              ) : coupons.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No coupons yet. Create your first one!</td></tr>
              ) : (
                coupons.map((coupon: Coupon) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  return (
                    <tr key={coupon._id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fafaf9')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#2E7D32', fontSize: '0.9rem' }}>{coupon.code}</span>
                          <button onClick={() => copyCode(coupon.code)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === coupon.code ? '#2E7D32' : '#9ca3af', padding: 2 }}>
                            <FiCopy size={13} />
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <span style={{ background: coupon.type === 'percentage' ? '#e8f5e9' : '#e0e7ff', color: coupon.type === 'percentage' ? '#1B5E20' : '#3730a3', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.625rem', borderRadius: 9999, textTransform: 'capitalize' }}>
                          {coupon.type}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700, color: '#E91E63' }}>
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `₦${coupon.value.toLocaleString()}`}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#374151' }}>
                        {coupon.minOrderAmount ? `₦${coupon.minOrderAmount.toLocaleString()}` : '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#374151' }}>
                        {coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ''}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: isExpired ? '#ef4444' : '#374151', fontSize: '0.8rem' }}>
                        {coupon.expiresAt ? formatDate(coupon.expiresAt) : '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <span style={{ background: coupon.isActive && !isExpired ? '#dcfce7' : '#f3f4f6', color: coupon.isActive && !isExpired ? '#14532d' : '#6b7280', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: 9999 }}>
                          {isExpired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button onClick={() => toggle(coupon._id)} title={coupon.isActive ? 'Deactivate' : 'Activate'}
                            style={{ background: coupon.isActive ? '#FDE8F0' : '#dcfce7', border: 'none', borderRadius: 8, padding: '0.375rem 0.625rem', cursor: 'pointer', color: coupon.isActive ? '#C2185B' : '#14532d', fontSize: '0.72rem', fontWeight: 700 }}>
                            {coupon.isActive ? 'Off' : 'On'}
                          </button>
                          <button onClick={() => openEdit(coupon)}
                            style={{ background: '#e8f5e9', border: 'none', borderRadius: 8, padding: '0.375rem 0.625rem', cursor: 'pointer', color: '#2E7D32', display: 'flex', alignItems: 'center' }}>
                            <FiEdit2 size={13} />
                          </button>
                          <button onClick={() => setDeleteTarget(coupon)}
                            style={{ background: '#FDE8F0', border: 'none', borderRadius: 8, padding: '0.375rem 0.625rem', cursor: 'pointer', color: '#C2185B', display: 'flex', alignItems: 'center' }}>
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 500, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDE7D9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>
                  {editing ? 'Edit Coupon' : 'Create Coupon'}
                </h2>
                <button onClick={() => setModalOpen(false)} style={{ background: '#F5F0E8', border: 'none', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', display: 'flex' }}>
                  <FiX size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {apiError && (
                  <div style={{ background: '#FDE8F0', border: '1px solid #F8C1D4', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#C2185B' }}>{apiError}</div>
                )}

                <Field label="Coupon Code *" error={errors.code?.message}>
                  <input {...register('code', { required: 'Code is required' })}
                    className={`input-brand${errors.code ? ' error' : ''}`}
                    placeholder="e.g. SAVE20"
                    style={{ textTransform: 'uppercase' }} />
                </Field>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <Field label="Discount Type *" error={errors.type?.message}>
                    <select {...register('type')} className="input-brand" style={{ cursor: 'pointer' }}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₦)</option>
                    </select>
                  </Field>
                  <Field label="Value *" error={errors.value?.message}>
                    <input {...register('value', { required: 'Value is required', min: { value: 1, message: 'Min 1' } })}
                      type="number" className={`input-brand${errors.value ? ' error' : ''}`} placeholder="e.g. 20" />
                  </Field>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <Field label="Min Order Amount (₦)">
                    <input {...register('minOrderAmount')} type="number" className="input-brand" placeholder="0 = no minimum" />
                  </Field>
                  <Field label="Max Uses">
                    <input {...register('maxUses')} type="number" className="input-brand" placeholder="0 = unlimited" />
                  </Field>
                </div>

                <Field label="Expiry Date">
                  <input {...register('expiresAt')} type="date" className="input-brand" />
                </Field>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-outline-pink" style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}>Cancel</button>
                  <button type="submit" disabled={creating || updating} className="btn-pink" style={{ padding: '0.625rem 1.5rem', fontSize: '0.85rem' }}>
                    {creating || updating ? 'Saving…' : editing ? 'Save Changes' : 'Create Coupon'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', maxWidth: 380, width: '100%', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#FDE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <FiTrash2 size={22} style={{ color: '#C2185B' }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '0.5rem' }}>Delete Coupon?</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Coupon <strong style={{ fontFamily: 'monospace', color: '#2E7D32' }}>{deleteTarget.code}</strong> will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setDeleteTarget(null)} className="btn-outline-pink" style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}>Cancel</button>
              <button onClick={() => deleteCoupon(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })} disabled={deleting}
                className="btn-pink" style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '0.72rem', color: '#E91E63' }}>{error}</p>}
    </div>
  );
}
