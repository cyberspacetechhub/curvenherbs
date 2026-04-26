import { FaStar, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { FiMessageSquare } from 'react-icons/fi';
import { usePendingReviews, useApproveReview, useDeleteReview } from '@/hooks/reviews/useReviews';
import { formatDate } from '@/lib/utils';
import type { Review } from '@/types';

export default function AdminReviewsPage() {
  const { data: reviews = [], isLoading } = usePendingReviews();
  const { mutate: approve, isPending: approving } = useApproveReview();
  const { mutate: deleteReview, isPending: deleting } = useDeleteReview();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.875rem' }}>
        {[
          { label: 'Pending Approval', value: reviews.length, color: '#f59e0b' },
          { label: 'With Comments', value: reviews.filter((r: Review) => r.comment).length, color: '#2E7D32' },
          { label: 'Avg Rating', value: reviews.length ? (reviews.reduce((s: number, r: Review) => s + r.rating, 0) / reviews.length).toFixed(1) : '—', color: '#E91E63' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Reviews list */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDE7D9', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <FiMessageSquare size={16} style={{ color: '#2E7D32' }} />
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
            Pending Reviews
          </h3>
          <span style={{ marginLeft: 'auto', background: '#fef3c7', color: '#92400e', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.625rem', borderRadius: 9999 }}>
            {reviews.length} pending
          </span>
        </div>

        {isLoading ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 90, borderRadius: 12 }} />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#9ca3af' }}>
            <FaStar size={32} style={{ margin: '0 auto 0.75rem', color: '#e5e7eb' }} />
            <p style={{ fontWeight: 500 }}>No pending reviews</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>All reviews have been moderated.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {reviews.map((review: Review, i: number) => (
              <div key={review._id}
                style={{ padding: '1.25rem 1.5rem', borderBottom: i < reviews.length - 1 ? '1px solid #f9fafb' : 'none', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>

                {/* Avatar */}
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #e8f5e9, #F8C1D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 700, fontSize: '0.875rem', color: '#2E7D32' }}>
                  {review.customerName.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.375rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{review.customerName}</span>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(s => (
                        <FaStar key={s} size={12} style={{ color: s <= review.rating ? '#E91E63' : '#e5e7eb' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{formatDate(review.createdAt)}</span>
                  </div>
                  {review.comment && (
                    <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.65, marginBottom: '0.5rem' }}>"{review.comment}"</p>
                  )}
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Product ID: <span style={{ fontFamily: 'monospace', color: '#6b7280' }}>{review.product}</span>
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => approve(review._id)} disabled={approving}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#dcfce7', border: 'none', borderRadius: 8, padding: '0.5rem 0.875rem', cursor: 'pointer', color: '#14532d', fontSize: '0.8rem', fontWeight: 600, transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#bbf7d0')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#dcfce7')}>
                    <FaCheckCircle size={13} /> Approve
                  </button>
                  <button onClick={() => deleteReview(review._id)} disabled={deleting}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#FDE8F0', border: 'none', borderRadius: 8, padding: '0.5rem 0.875rem', cursor: 'pointer', color: '#C2185B', fontSize: '0.8rem', fontWeight: 600, transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F8C1D4')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#FDE8F0')}>
                    <FaTrash size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
