import { useState, useMemo } from 'react';
import { useProducts, useDeleteProduct } from '@/hooks/products/useProducts';
import ProductsTable from './components/ProductsTable';
import ProductFormModal from './components/ProductFormModal';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editing, setEditing] = useState<Product | null | 'new'>('new' as any);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data: products = [], isLoading } = useProducts();
  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();

  const filtered = useMemo(() => {
    return products.filter((p: Product) => {
      const matchCat = !categoryFilter || p.category === categoryFilter;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, search, categoryFilter]);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: Product) => { setEditing(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.875rem' }}>
        {[
          { label: 'Total', value: products.length, color: '#2E7D32' },
          { label: 'In Stock', value: products.filter((p: Product) => p.isInStock).length, color: '#2E7D32' },
          { label: 'Out of Stock', value: products.filter((p: Product) => !p.isInStock).length, color: '#ef4444' },
          { label: 'In-House', value: products.filter((p: Product) => p.isInHouse).length, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, fontFamily: "'Playfair Display', Georgia, serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      <ProductsTable
        products={filtered}
        isLoading={isLoading}
        search={search}
        onSearch={setSearch}
        categoryFilter={categoryFilter}
        onCategoryFilter={setCategoryFilter}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onAdd={openAdd}
      />

      {/* Product form modal */}
      {modalOpen && (
        <ProductFormModal product={editing as Product | null} onClose={closeModal} />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '2rem', maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FDE8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🗑️</span>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827', marginBottom: '0.5rem' }}>
              Delete Product?
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              <strong>{deleteTarget.name}</strong> will be permanently deleted. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={() => setDeleteTarget(null)} className="btn-outline-pink" style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button onClick={confirmDelete} disabled={deleting} className="btn-pink" style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
