import { FaStar, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { FiImage } from 'react-icons/fi';
import { MdCameraAlt } from 'react-icons/md';
import { usePendingTestimonies, useApproveTestimony, useDeleteTestimony } from '@/hooks/testimonies/useTestimonies';
import { formatDate } from '@/lib/utils';
import type { Testimony } from '@/types';

export default function AdminTestimoniesPage() {
  const { data: testimonies = [], isLoading } = usePendingTestimonies();
  const { mutate: approve, isPending: approving } = useApproveTestimony();
  const { mutate: deleteTestimony, isPending: deleting } = useDeleteTestimony();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.875rem' }}>
        {[
          { label: 'Pending Approval', value: testimonies.length, color: '#f59e0b' },
          { label: 'With Images', value: testimonies.filter((t: Testimony) => t.beforeImage || t.afterImage).length, color: '#8b5cf6' },
          { label: 'With Rating', value: testimonies.filter((t: Testimony) => t.rating).length, color: '#E91E63' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Testimonies list */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDE7D9', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <MdCameraAlt size={18} style={{ color: '#2E7D32' }} />
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
            Pending Testimonies
          </h3>
          <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#92400e', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.625rem', borderRadius: 9999 }}>
            {testimonies.length} pending
          </span>
        </div>

        {isLoading ? (
          <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 220, borderRadius: 12 }} />
            ))}
          </div>
        ) : testimonies.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#9ca3af' }}>
            <MdCameraAlt size={36} style={{ margin: '0 auto 0.75rem', color: '#e5e7eb' }} />
            <p style={{ fontWeight: 500 }}>No pending testimonies</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>All testimonies have been moderated.</p>
          </div>
        ) : (
          <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {testimonies.map((t: Testimony) => (
              <div key={t._id} style={{ border: '1px solid #EDE7D9', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

                {/* Before / After images */}
                {(t.beforeImage || t.afterImage) && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: 140 }}>
                    {t.beforeImage ? (
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img src={t.beforeImage} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 4 }}>BEFORE</span>
                      </div>
                    ) : (
                      <div style={{ background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiImage size={24} style={{ color: '#9ca3af' }} />
                      </div>
                    )}
                    {t.afterImage ? (
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img src={t.afterImage} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: 6, left: 6, background: 'rgba(46,125,50,0.8)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 4 }}>AFTER</span>
                      </div>
                    ) : (
                      <div style={{ background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiImage size={24} style={{ color: '#9ca3af' }} />
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.375rem' }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{t.customerName}</p>
                      {t.location && <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{t.location}</p>}
                    </div>
                    {t.rating && (
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map(s => (
                          <FaStar key={s} size={11} style={{ color: s <= t.rating! ? '#E91E63' : '#e5e7eb' }} />
                        ))}
                      </div>
                    )}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.65, flex: 1 }}>"{t.testimonial}"</p>

                  <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', fontSize: '0.72rem', color: '#9ca3af' }}>
                    {t.timeTaken && <span style={{ background: '#F5F0E8', padding: '0.15rem 0.5rem', borderRadius: 4 }}>⏱ {t.timeTaken}</span>}
                    {t.productUsed && <span style={{ background: '#e8f5e9', color: '#1B5E20', padding: '0.15rem 0.5rem', borderRadius: 4 }}>🌿 {t.productUsed.name}</span>}
                    <span style={{ marginLeft: 'auto' }}>{formatDate(t.createdAt)}</span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.625rem', borderTop: '1px solid #f9fafb' }}>
                    <button onClick={() => approve(t._id)} disabled={approving}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', background: '#dcfce7', border: 'none', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', color: '#14532d', fontSize: '0.8rem', fontWeight: 600, transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#bbf7d0')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#dcfce7')}>
                      <FaCheckCircle size={12} /> Approve
                    </button>
                    <button onClick={() => deleteTestimony(t._id)} disabled={deleting}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', background: '#FDE8F0', border: 'none', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', color: '#C2185B', fontSize: '0.8rem', fontWeight: 600, transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F8C1D4')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#FDE8F0')}>
                      <FaTrash size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
