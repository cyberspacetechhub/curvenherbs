import { FiSearch, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { formatNaira, getMainImage } from '@/lib/utils';
import type { Product, ProductCategory } from '@/types';

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'All', value: '' },
  { label: 'Weight Gain', value: 'Weight Gain' },
  { label: 'Curve Enhancement', value: 'Curve Enhancement' },
  { label: 'Flat Tummy', value: 'Flat Tummy' },
  { label: 'Combo Packs', value: 'Combo Packs' },
  { label: 'Topical', value: 'Topical' },
  { label: 'Suppository', value: 'Suppository' },
];

interface Props {
  products: Product[];
  isLoading: boolean;
  search: string;
  onSearch: (v: string) => void;
  categoryFilter: string;
  onCategoryFilter: (v: string) => void;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
  onAdd: () => void;
}

export default function ProductsTable({ products, isLoading, search, onSearch, categoryFilter, onCategoryFilter, onEdit, onDelete, onAdd }: Props) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

      {/* Toolbar */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDE7D9', display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', flex: 1 }}>
          <div style={{ position: 'relative', minWidth: 200, flex: 1 }}>
            <FiSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
            <input value={search} onChange={e => onSearch(e.target.value)}
              placeholder="Search products..." className="input-brand" style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {CATEGORIES.map(c => (
              <button key={c.value} onClick={() => onCategoryFilter(c.value)}
                style={{ padding: '0.35rem 0.875rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  background: categoryFilter === c.value ? '#2E7D32' : '#F5F0E8',
                  color: categoryFilter === c.value ? '#fff' : '#6b7280',
                }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <button onClick={onAdd} className="btn-pink" style={{ fontSize: '0.85rem', padding: '0.625rem 1.25rem', flexShrink: 0 }}>
          <FiPlus size={15} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#F5F0E8' }}>
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Rating', ''].map(h => (
                <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} style={{ padding: '0.875rem 1rem' }}>
                      <div className="skeleton" style={{ height: 14, borderRadius: 6, width: j === 0 ? 160 : 70 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                  No products found.
                </td>
              </tr>
            ) : (
              products.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid #f9fafb', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fafaf9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: '#EDE7D9', flexShrink: 0 }}>
                        <img src={getMainImage(p.images)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{p.name}</p>
                        <p style={{ fontSize: '0.72rem', color: '#9ca3af' }}>{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: '#e8f5e9', color: '#1B5E20', fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: 9999 }}>
                      {p.category}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <p style={{ fontWeight: 700, color: '#111827' }}>{formatNaira(p.discountedPrice ?? p.price)}</p>
                    {p.discountedPrice && <p style={{ fontSize: '0.72rem', color: '#9ca3af', textDecoration: 'line-through' }}>{formatNaira(p.price)}</p>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: p.stock < 5 ? '#ef4444' : '#374151', fontWeight: p.stock < 5 ? 700 : 400 }}>
                    {p.stock}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ background: p.isInStock ? '#dcfce7' : '#fee2e2', color: p.isInStock ? '#14532d' : '#991b1b', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.625rem', borderRadius: 9999 }}>
                      {p.isInStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: '#374151' }}>
                    ⭐ {p.rating.toFixed(1)} <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>({p.reviewCount})</span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      <button onClick={() => onEdit(p)}
                        style={{ background: '#e8f5e9', border: 'none', borderRadius: 8, padding: '0.375rem 0.625rem', cursor: 'pointer', color: '#2E7D32', display: 'flex', alignItems: 'center' }}>
                        <FiEdit2 size={13} />
                      </button>
                      <button onClick={() => onDelete(p)}
                        style={{ background: '#FDE8F0', border: 'none', borderRadius: 8, padding: '0.375rem 0.625rem', cursor: 'pointer', color: '#C2185B', display: 'flex', alignItems: 'center' }}>
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid #f9fafb', fontSize: '0.8rem', color: '#9ca3af' }}>
        {products.length} product{products.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
