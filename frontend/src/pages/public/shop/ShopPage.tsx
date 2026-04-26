import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiX } from 'react-icons/fi';
import { FaWhatsapp, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { useProducts } from '@/hooks/products/useProducts';
import { useCartStore } from '@/store/cartStore';
import { formatNaira, getMainImage, getDiscountPercent, getWhatsAppOrderLink } from '@/lib/utils';
import type { Product, ProductCategory } from '@/types';

const CATEGORIES: { label: string; value: ProductCategory | 'All' }[] = [
  { label: 'All Products', value: 'All' },
  { label: 'Curve Enhancement', value: 'Curve Enhancement' },
  { label: 'Weight Gain', value: 'Weight Gain' },
  { label: 'Flat Tummy', value: 'Flat Tummy' },
  { label: 'Combo Packs', value: 'Combo Packs' },
  { label: 'Topical', value: 'Topical' },
  { label: 'Suppository', value: 'Suppository' },
];

function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem);
  const price = product.discountedPrice ?? product.price;
  const discount = product.discountedPrice ? getDiscountPercent(product.price, product.discountedPrice) : 0;
  const mainImage = getMainImage(product.images);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.4 }}
      className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      <Link to={`/shop/${product.slug}`} style={{ display: 'block', position: 'relative', overflow: 'hidden', aspectRatio: '4/5', background: '#EDE7D9' }}>
        <img src={mainImage} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          onError={e => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />
        <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {discount > 0 && <span className="badge-pink" style={{ marginBottom: 0 }}>-{discount}%</span>}
          {product.tags.includes('best-seller') && <span className="badge-green" style={{ marginBottom: 0 }}>Best Seller</span>}
          {!product.isInStock && (
            <span style={{ background: 'rgba(31,41,55,0.85)', color: '#fff', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.75rem', borderRadius: 9999 }}>
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>
          {product.category}
        </span>
        <Link to={`/shop/${product.slug}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '0.95rem', fontWeight: 700, color: '#111827', lineHeight: 1.35, marginBottom: '0.4rem' }}>
            {product.name}
          </h3>
        </Link>

        {product.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: '0.4rem' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} size={10} style={{ color: i < Math.round(product.rating) ? '#facc15' : '#e5e7eb' }} />
            ))}
            <span style={{ fontSize: '0.68rem', color: '#9ca3af', marginLeft: 3 }}>({product.reviewCount})</span>
          </div>
        )}

        <p style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.55, marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description}
        </p>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#E91E63' }}>{formatNaira(price)}</span>
            {product.discountedPrice && (
              <span style={{ fontSize: '0.78rem', color: '#9ca3af', textDecoration: 'line-through', marginLeft: '0.4rem' }}>{formatNaira(product.price)}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <a href={getWhatsAppOrderLink(product.name)} target="_blank" rel="noreferrer"
              style={{ width: 34, height: 34, background: '#22c55e', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaWhatsapp size={15} />
            </a>
            <button onClick={() => addItem(product)} disabled={!product.isInStock}
              className="btn-pink" style={{ padding: '0.4rem 0.8rem', fontSize: '0.72rem' }}>
              <FiShoppingCart size={12} /> Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [search, setSearch] = useState('');
  const { data: products, isLoading } = useProducts();

  const filtered = useMemo(() => {
    if (!products) return [];
    return products.filter((p: Product) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      <SEO
        title="Shop Natural Herbal Products"
        description="Browse Curvenherbs' full range of 100% natural herbal products for women — Bum & Hips Growth Syrup, Curve Booster Powder, Flat Tummy Mix, Weight Gain Supplements and more. No side effects."
        url="/shop"
        keywords="buy herbal products Nigeria, bum growth syrup, hips enlargement herbs, natural weight gain supplement, flat tummy herbs, curve enhancement Nigeria"
        type="website"
      />

      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)', paddingTop: '7rem', paddingBottom: '3rem' }}>
        <div className="container-brand" style={{ textAlign: 'center' }}>
          <span className="badge-pink" style={{ marginBottom: '1rem' }}>Our Collection</span>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '0.75rem' }}>
            Natural Herbal Products
          </h1>
          <p style={{ color: '#bbf7d0', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
            100% natural, in-house formulated herbal products for women. No side effects. Real results.
          </p>
        </div>
      </div>

      <main style={{ flex: 1, background: '#F5F0E8', paddingTop: '2.5rem', paddingBottom: '4rem' }}>
        <div className="container-brand">

          {/* Search + filters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {/* Search */}
            <div style={{ position: 'relative', maxWidth: 480 }}>
              <FiSearch size={17} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-brand"
                style={{ paddingLeft: '2.5rem', paddingRight: search ? '2.5rem' : '1rem' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                  <FiX size={16} />
                </button>
              )}
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {CATEGORIES.map(cat => (
                <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
                  style={{
                    padding: '0.45rem 1.1rem',
                    borderRadius: 9999,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.2s',
                    background: activeCategory === cat.value ? '#2E7D32' : '#fff',
                    color: activeCategory === cat.value ? '#fff' : '#374151',
                    boxShadow: activeCategory === cat.value ? '0 4px 12px rgba(46,125,50,0.3)' : '0 1px 4px rgba(0,0,0,0.08)',
                  }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          {!isLoading && (
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
              {activeCategory !== 'All' && ` in ${activeCategory}`}
              {search && ` for "${search}"`}
            </p>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="products-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 20, overflow: 'hidden', background: '#fff' }}>
                  <div className="skeleton" style={{ aspectRatio: '4/5' }} />
                  <div style={{ padding: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <div className="skeleton" style={{ height: 9, width: '40%', borderRadius: 99 }} />
                    <div className="skeleton" style={{ height: 13, width: '85%' }} />
                    <div className="skeleton" style={{ height: 9, width: '100%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</p>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', color: '#374151', marginBottom: '0.5rem' }}>No products found</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Try a different category or search term</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="btn-green">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filtered.map((p: Product) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </main>

      <style>{`
        .products-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }
        @media (min-width: 640px)  { .products-grid { grid-template-columns: repeat(3, 1fr); gap: 1.25rem; } }
        @media (min-width: 1024px) { .products-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; } }
      `}</style>
    </div>
  );
}
