import { useState } from 'react';
import { FiMail, FiTrash2, FiPhone, FiSearch } from 'react-icons/fi';
import { MdMarkEmailRead, MdMarkEmailUnread } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { useAllMessages, useMarkMessageRead, useDeleteMessage } from '@/hooks/contact/useContact';
import { formatDateTime } from '@/lib/utils';
import type { ContactMessage } from '@/types';

export default function AdminMessagesPage() {
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const { data: messages = [], isLoading } = useAllMessages();
  const { mutate: markRead } = useMarkMessageRead();
  const { mutate: deleteMsg, isPending: deleting } = useDeleteMessage();

  const filtered = messages.filter((m: ContactMessage) => {
    const matchFilter = filter === 'all' || (filter === 'unread' ? !m.isRead : m.isRead);
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.message.toLowerCase().includes(search.toLowerCase()) || (m.email ?? '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const unreadCount = messages.filter((m: ContactMessage) => !m.isRead).length;

  const handleSelect = (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.isRead) markRead(msg._id);
  };

  const handleDelete = (id: string) => {
    deleteMsg(id, { onSuccess: () => { if (selected?._id === id) setSelected(null); } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.875rem' }}>
        {[
          { label: 'Total', value: messages.length, color: '#2E7D32' },
          { label: 'Unread', value: unreadCount, color: '#E91E63' },
          { label: 'Read', value: messages.length - unreadCount, color: '#9ca3af' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Inbox layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.25rem', alignItems: 'start' }} className="inbox-layout">

        {/* Message list */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

          {/* Toolbar */}
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #EDE7D9', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
              <FiSearch size={13} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search messages..." className="input-brand"
                style={{ paddingLeft: '2.1rem', fontSize: '0.82rem' }} />
            </div>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {(['all', 'unread', 'read'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '0.3rem 0.75rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, border: 'none', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s',
                    background: filter === f ? '#2E7D32' : '#F5F0E8',
                    color: filter === f ? '#fff' : '#6b7280',
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          {isLoading ? (
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 10 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
              <FiMail size={28} style={{ margin: '0 auto 0.75rem', color: '#e5e7eb' }} />
              <p>No messages found.</p>
            </div>
          ) : (
            <div style={{ maxHeight: 520, overflowY: 'auto' }}>
              {filtered.map((msg: ContactMessage) => (
                <div key={msg._id} onClick={() => handleSelect(msg)}
                  style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f9fafb', cursor: 'pointer', transition: 'background 0.15s', display: 'flex', gap: '0.875rem', alignItems: 'flex-start',
                    background: selected?._id === msg._id ? '#f0fdf4' : !msg.isRead ? '#FAFDE8' : 'transparent',
                  }}
                  onMouseEnter={e => { if (selected?._id !== msg._id) e.currentTarget.style.background = '#fafaf9'; }}
                  onMouseLeave={e => { if (selected?._id !== msg._id) e.currentTarget.style.background = !msg.isRead ? '#FAFDE8' : 'transparent'; }}>

                  {/* Unread dot */}
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: !msg.isRead ? '#E91E63' : 'transparent', flexShrink: 0, marginTop: 6 }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                      <span style={{ fontWeight: !msg.isRead ? 700 : 500, fontSize: '0.875rem', color: '#111827' }}>{msg.name}</span>
                      <span style={{ fontSize: '0.7rem', color: '#9ca3af', flexShrink: 0 }}>{formatDateTime(msg.createdAt)}</span>
                    </div>
                    {msg.email && <p style={{ fontSize: '0.72rem', color: '#9ca3af', marginBottom: '0.2rem' }}>{msg.email}</p>}
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message detail */}
        {selected && (
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #EDE7D9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1rem', color: '#111827' }}>{selected.name}</h3>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.15rem' }}>{formatDateTime(selected.createdAt)}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => markRead(selected._id)}
                  title={selected.isRead ? 'Mark unread' : 'Mark read'}
                  style={{ background: '#F5F0E8', border: 'none', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', display: 'flex', color: '#374151' }}>
                  {selected.isRead ? <MdMarkEmailUnread size={16} /> : <MdMarkEmailRead size={16} />}
                </button>
                <button onClick={() => handleDelete(selected._id)} disabled={deleting}
                  style={{ background: '#FDE8F0', border: 'none', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', display: 'flex', color: '#C2185B' }}>
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>

            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Contact info */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem' }}>
                {selected.email && (
                  <a href={`mailto:${selected.email}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: '#F5F0E8', borderRadius: 8, padding: '0.375rem 0.75rem', fontSize: '0.8rem', color: '#374151', textDecoration: 'none' }}>
                    <FiMail size={13} /> {selected.email}
                  </a>
                )}
                {selected.phone && (
                  <a href={`tel:${selected.phone}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', background: '#F5F0E8', borderRadius: 8, padding: '0.375rem 0.75rem', fontSize: '0.8rem', color: '#374151', textDecoration: 'none' }}>
                    <FiPhone size={13} /> {selected.phone}
                  </a>
                )}
              </div>

              {/* Message body */}
              <div style={{ background: '#F5F0E8', borderRadius: 12, padding: '1.25rem' }}>
                <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{selected.message}</p>
              </div>

              {/* Reply actions */}
              <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                {selected.phone && (
                  <a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                    className="btn-green" style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}>
                    <FaWhatsapp size={14} /> WhatsApp
                  </a>
                )}
                {selected.email && (
                  <a href={`mailto:${selected.email}`} className="btn-outline-pink" style={{ fontSize: '0.82rem', padding: '0.5rem 1rem' }}>
                    <FiMail size={14} /> Reply by Email
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) { .inbox-layout { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
