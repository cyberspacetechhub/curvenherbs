import { useState, useMemo } from 'react';
import { FiSearch, FiMail, FiUserX } from 'react-icons/fi';
import { MdEmail, MdCheckCircle, MdCancel } from 'react-icons/md';
import { useAllSubscribers, useUnsubscribe } from '@/hooks/newsletter/useNewsletter';
import { formatDate } from '@/lib/utils';
import type { NewsletterSubscriber } from '@/types';

export default function AdminNewsletterPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { data: subscribers = [], isLoading } = useAllSubscribers();
  const { mutate: unsubscribe, isPending: unsubscribing } = useUnsubscribe();

  const filtered = useMemo(() => {
    return subscribers.filter((s: NewsletterSubscriber) => {
      const matchFilter = filter === 'all' || (filter === 'active' ? s.isSubscribed : !s.isSubscribed);
      const matchSearch = !search || s.email.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [subscribers, filter, search]);

  const active = subscribers.filter((s: NewsletterSubscriber) => s.isSubscribed).length;
  const inactive = subscribers.length - active;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.875rem' }}>
        {[
          { label: 'Total', value: subscribers.length, color: '#2E7D32' },
          { label: 'Active', value: active, color: '#2E7D32' },
          { label: 'Unsubscribed', value: inactive, color: '#9ca3af' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDE7D9', display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <MdEmail size={18} style={{ color: '#2E7D32' }} />
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Subscribers</h3>
          </div>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by email..." className="input-brand"
              style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
          </div>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {(['all', 'active', 'inactive'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '0.35rem 0.875rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize',
                  background: filter === f ? '#2E7D32' : '#F5F0E8',
                  color: filter === f ? '#fff' : '#6b7280',
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F5F0E8' }}>
                {['Email', 'Status', 'Subscribed On', ''].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {[200, 80, 100, 60].map((w, j) => (
                      <td key={j} style={{ padding: '0.875rem 1.25rem' }}>
                        <div className="skeleton" style={{ height: 14, borderRadius: 6, width: w }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub: NewsletterSubscriber) => (
                  <tr key={sub._id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafaf9')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FiMail size={14} style={{ color: '#6b7280' }} />
                        </div>
                        <span style={{ fontWeight: 500, color: '#111827' }}>{sub.email}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      {sub.isSubscribed ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#dcfce7', color: '#14532d', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: 9999 }}>
                          <MdCheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: '#f3f4f6', color: '#6b7280', fontSize: '0.72rem', fontWeight: 700, padding: '0.25rem 0.625rem', borderRadius: 9999 }}>
                          <MdCancel size={12} /> Unsubscribed
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem', color: '#9ca3af', fontSize: '0.82rem' }}>
                      {formatDate(sub.createdAt)}
                    </td>
                    <td style={{ padding: '0.875rem 1.25rem' }}>
                      {sub.isSubscribed && (
                        <button onClick={() => unsubscribe(sub.email)} disabled={unsubscribing}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#FDE8F0', border: 'none', borderRadius: 8, padding: '0.375rem 0.75rem', cursor: 'pointer', color: '#C2185B', fontSize: '0.78rem', fontWeight: 600, transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#F8C1D4')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#FDE8F0')}>
                          <FiUserX size={13} /> Unsubscribe
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid #f9fafb', fontSize: '0.8rem', color: '#9ca3af' }}>
          {filtered.length} of {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
