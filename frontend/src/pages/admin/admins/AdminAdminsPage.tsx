import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdAdminPanelSettings, MdToggleOn, MdToggleOff, MdDelete } from 'react-icons/md';
import { z } from 'zod';
import { adminApi } from '@/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate } from '@/lib/utils';
import type { Admin } from '@/types';

// ── hooks ─────────────────────────────────────────────────────────────────────
const ADMIN_KEY = ['admins'] as const;
const useAdmins = () => useQuery({ queryKey: ADMIN_KEY, queryFn: () => adminApi.getAll().then(r => r.data.data) });
const useCreateAdmin = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (d: any) => adminApi.create(d), onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_KEY }) });
};
const useToggleAdmin = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminApi.toggleActive(id), onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_KEY }) });
};
const useDeleteAdmin = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => adminApi.delete(id), onSuccess: () => qc.invalidateQueries({ queryKey: ADMIN_KEY }) });
};

// ── schema ────────────────────────────────────────────────────────────────────
const createAdminSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName:  z.string().min(2, 'Required'),
  email:     z.string().email('Invalid email'),
  phone:     z.string().min(10, 'Invalid phone'),
  password:  z.string().min(6, 'Min 6 characters'),
  role:      z.enum(['superadmin', 'manager', 'support']),
});
type CreateAdminForm = z.infer<typeof createAdminSchema>;

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  superadmin: { bg: '#FDE8F0', color: '#C2185B' },
  manager:    { bg: '#e8f5e9', color: '#1B5E20' },
  support:    { bg: '#e0e7ff', color: '#3730a3' },
};

export default function AdminAdminsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { data: admins = [], isLoading } = useAdmins();
  const { mutate: createAdmin, isPending: creating, error: createError } = useCreateAdmin();
  const { mutate: toggleAdmin } = useToggleAdmin();
  const { mutate: deleteAdmin, isPending: deleting } = useDeleteAdmin();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateAdminForm>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: { role: 'support' },
  });

  const onSubmit = (data: CreateAdminForm) => {
    createAdmin(data, { onSuccess: () => { reset(); setModalOpen(false); } });
  };

  const apiError = (createError as any)?.response?.data?.message;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.875rem' }}>
        {[
          { label: 'Total Admins', value: admins.length, color: '#2E7D32' },
          { label: 'Active', value: admins.filter((a: Admin) => a.isActive).length, color: '#2E7D32' },
          { label: 'Inactive', value: admins.filter((a: Admin) => !a.isActive).length, color: '#9ca3af' },
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
            <MdAdminPanelSettings size={18} style={{ color: '#2E7D32' }} />
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Admin Accounts</h3>
          </div>
          <button onClick={() => setModalOpen(true)} className="btn-pink" style={{ fontSize: '0.82rem', padding: '0.5rem 1.1rem' }}>
            <FiPlus size={14} /> Add Admin
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F5F0E8' }}>
                {['Admin', 'Email', 'Phone', 'Role', 'Status', 'Last Login', ''].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} style={{ padding: '0.875rem 1.25rem' }}>
                      <div className="skeleton" style={{ height: 14, borderRadius: 6, width: j === 0 ? 140 : 80 }} />
                    </td>
                  ))}</tr>
                ))
              ) : admins.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>No admins found.</td></tr>
              ) : (
                admins.map((admin: Admin) => {
                  const rc = ROLE_COLORS[admin.role] ?? { bg: '#f3f4f6', color: '#374151' };
                  return (
                    <tr key={admin._id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#fafaf9')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f5e9, #F8C1D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: '#2E7D32', flexShrink: 0 }}>
                            {admin.firstName.charAt(0)}{admin.lastName.charAt(0)}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: '#111827' }}>{admin.firstName} {admin.lastName}</p>
                            <p style={{ fontSize: '0.72rem', color: '#9ca3af' }}>ID: {admin._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#374151' }}>{admin.email}</td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#374151' }}>{admin.phone}</td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <span style={{ background: rc.bg, color: rc.color, fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: 9999, textTransform: 'capitalize' }}>
                          {admin.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <span style={{ background: admin.isActive ? '#dcfce7' : '#f3f4f6', color: admin.isActive ? '#14532d' : '#6b7280', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: 9999 }}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem', color: '#9ca3af', fontSize: '0.8rem' }}>
                        {admin.lastLogin ? formatDate(admin.lastLogin) : '—'}
                      </td>
                      <td style={{ padding: '0.875rem 1.25rem' }}>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button onClick={() => toggleAdmin(admin._id)} title={admin.isActive ? 'Deactivate' : 'Activate'}
                            style={{ background: admin.isActive ? '#FDE8F0' : '#dcfce7', border: 'none', borderRadius: 8, padding: '0.375rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', color: admin.isActive ? '#C2185B' : '#14532d' }}>
                            {admin.isActive ? <MdToggleOff size={18} /> : <MdToggleOn size={18} />}
                          </button>
                          <button onClick={() => setDeleteTarget(admin)}
                            style={{ background: '#FDE8F0', border: 'none', borderRadius: 8, padding: '0.375rem 0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#C2185B' }}>
                            <MdDelete size={16} />
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

      {/* Create modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDE7D9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>Add New Admin</h2>
                <button onClick={() => setModalOpen(false)} style={{ background: '#F5F0E8', border: 'none', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', display: 'flex' }}>
                  <FiX size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {apiError && (
                  <div style={{ background: '#FDE8F0', border: '1px solid #F8C1D4', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#C2185B' }}>{apiError}</div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                  <Field label="First Name" error={errors.firstName?.message}>
                    <input {...register('firstName')} className={`input-brand${errors.firstName ? ' error' : ''}`} placeholder="Ada" />
                  </Field>
                  <Field label="Last Name" error={errors.lastName?.message}>
                    <input {...register('lastName')} className={`input-brand${errors.lastName ? ' error' : ''}`} placeholder="Okafor" />
                  </Field>
                </div>

                <Field label="Email" error={errors.email?.message}>
                  <input {...register('email')} type="email" className={`input-brand${errors.email ? ' error' : ''}`} placeholder="admin@curvenherbs.com" />
                </Field>

                <Field label="Phone" error={errors.phone?.message}>
                  <input {...register('phone')} className={`input-brand${errors.phone ? ' error' : ''}`} placeholder="08012345678" />
                </Field>

                <Field label="Role" error={errors.role?.message}>
                  <select {...register('role')} className="input-brand" style={{ cursor: 'pointer' }}>
                    <option value="support">Support</option>
                    <option value="manager">Manager</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </Field>

                <Field label="Password" error={errors.password?.message}>
                  <div style={{ position: 'relative' }}>
                    <input {...register('password')} type={showPassword ? 'text' : 'password'}
                      className={`input-brand${errors.password ? ' error' : ''}`} placeholder="Min. 6 characters"
                      style={{ paddingRight: '2.75rem' }} />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex' }}>
                      {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                </Field>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.25rem' }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn-outline-pink" style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}>Cancel</button>
                  <button type="submit" disabled={creating} className="btn-pink" style={{ padding: '0.625rem 1.5rem', fontSize: '0.85rem' }}>
                    {creating ? 'Creating…' : 'Create Admin'}
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
              <MdDelete size={24} style={{ color: '#C2185B' }} />
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '0.5rem' }}>Delete Admin?</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              <strong>{deleteTarget.firstName} {deleteTarget.lastName}</strong> will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setDeleteTarget(null)} className="btn-outline-pink" style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}>Cancel</button>
              <button onClick={() => deleteAdmin(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })} disabled={deleting}
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
