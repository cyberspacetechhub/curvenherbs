import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { FaWhatsapp, FaStar } from 'react-icons/fa';
import { useProducts } from '@/hooks/products/useProducts';
import { useCartStore } from '@/store/cartStore';
import { formatNaira, getMainImage, getDiscountPercent, getWhatsAppOrderLink } from '@/lib/utils';
import AppSwiper from '@/components/ui/AppSwiper';
import type { Product } from '@/types';

function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore(s => s.addItem);
  const mainImage = getMainImage(product.images);
  const price = product.discountedPrice ?? product.price;
  const discount = product.discountedPrice ? getDiscountPercent(product.price, product.discountedPrice) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      <div className="relative overflow-hidden aspect-product" style={{ background: '#EDE7D9' }}>
        <img src={mainImage} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onError={e => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }} />

        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {discount > 0 && <span className="badge-pink" style={{ marginBottom: 0 }}>-{discount}%</span>}
          {product.tags.includes('best-seller') && <span className="badge-green" style={{ marginBottom: 0 }}>Best Seller</span>}
          {!product.isInStock && (
            <span style={{ background: 'rgba(31,41,55,0.85)', color: '#fff', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.75rem', borderRadius: 9999 }}>
              Out of Stock
            </span>
          )}
        </div>

        <a href={getWhatsAppOrderLink(product.name)} target="_blank" rel="noreferrer"
          style={{ position: 'absolute', bottom: 12, right: 12, width: 40, height: 40, background: '#22c55e', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0')}>
          <FaWhatsapp size={18} />
        </a>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2E7D32', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
          {product.category}
        </span>
        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1rem', fontWeight: 700, color: '#111827', lineHeight: 1.35, marginBottom: '0.5rem' }}
          className="line-clamp-2">
          {product.name}
        </h3>

        {product.rating > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: '0.5rem' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} size={11} style={{ color: i < Math.round(product.rating) ? '#facc15' : '#e5e7eb' }} />
            ))}
            <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginLeft: 4 }}>({product.reviewCount})</span>
          </div>
        )}

        <p style={{ fontSize: '0.8rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '0.75rem' }} className="line-clamp-2">
          {product.description}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '0.75rem' }}>
          {product.keyBenefits.slice(0, 2).map(b => (
            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2E7D32', flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', color: '#4b5563' }}>{b}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#E91E63' }}>{formatNaira(price)}</span>
            {product.discountedPrice && (
              <span style={{ fontSize: '0.8rem', color: '#9ca3af', textDecoration: 'line-through' }}>{formatNaira(product.price)}</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <a href={getWhatsAppOrderLink(product.name)} target="_blank" rel="noreferrer"
              style={{ flex: 1, height: 36, background: '#22c55e', color: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}>
              <FaWhatsapp size={14} /> WhatsApp
            </a>
            <button onClick={() => addItem(product)} disabled={!product.isInStock}
              style={{ flex: 1, height: 36, background: product.isInStock ? 'linear-gradient(135deg,#E91E63,#C2185B)' : '#e5e7eb', color: product.isInStock ? '#fff' : '#9ca3af', border: 'none', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 600, cursor: product.isInStock ? 'pointer' : 'not-allowed' }}>
              <FiShoppingCart size={13} /> Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function BestSellersSection() {
  const { data: products, isLoading } = useProducts({ tag: 'best-seller' });

  return (
    <section className="section-padding" style={{ background: '#F5F0E8' }}>
      <div className="container-brand">

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3rem' }}>
          <div>
            <span className="badge-pink">Our Products</span>
            <h2 className="section-heading">
              Best Selling <span className="text-gradient-pink italic">Herbal</span> Products
            </h2>
            <p className="section-subheading">
              Trusted by hundreds of women across Nigeria for natural, visible results.
            </p>
          </div>
          <div style={{ flexShrink: 0, paddingTop: '0.25rem' }}>
            <Link to="/shop" className="btn-outline-pink">
              View All <FiArrowRight size={15} />
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 20, overflow: 'hidden', background: '#fff' }}>
                <div className="skeleton aspect-product" />
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="skeleton" style={{ height: 10, width: '40%', borderRadius: 99 }} />
                  <div className="skeleton" style={{ height: 14, width: '80%' }} />
                  <div className="skeleton" style={{ height: 10, width: '100%' }} />
                  <div className="skeleton" style={{ height: 10, width: '65%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="hide-mobile-grid grid-4">
              {products?.map((p: Product, i: number) => <ProductCard key={p._id} product={p} index={i} />)}
            </div>
            <div className="show-mobile">
              <AppSwiper
                items={(products ?? []).map((p: Product, i: number) => <ProductCard key={p._id} product={p} index={i} />)}
                slidesPerView={1.15} spaceBetween={14} showPagination className="pb-10" />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
