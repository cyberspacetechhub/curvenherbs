import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaStar, FaLeaf, FaPlus, FaMinus, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { FiArrowLeft, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useProduct } from '@/hooks/products/useProducts';
import { useProductReviews, useAddReview } from '@/hooks/reviews/useReviews';
import { useCartStore } from '@/store/cartStore';
import { formatNaira, getDiscountPercent, getWhatsAppOrderLink, formatDate } from '@/lib/utils';
import SEO from '@/components/SEO';
import type { ProductImage, ProductIngredient, ReviewPayload } from '@/types';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug!);
  const { data: reviews = [] } = useProductReviews(product?._id ?? '');
  const addReview = useAddReview(product?._id ?? '');
  const addItem = useCartStore(s => s.addItem);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('benefits');
  const [reviewForm, setReviewForm] = useState<ReviewPayload>({ customerName: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    await addReview.mutateAsync(reviewForm);
    setReviewSubmitted(true);
    setShowReviewForm(false);
    setReviewForm({ customerName: '', rating: 5, comment: '' });
  };

  const toggleSection = (key: string) =>
    setExpandedSection(prev => (prev === key ? null : key));

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !product) return <ErrorState />;

  const displayPrice = product.discountedPrice ?? product.price;
  const discount = product.discountedPrice ? getDiscountPercent(product.price, product.discountedPrice) : 0;
  const mainImages = product.images.length ? product.images : [{ url: '/placeholder-product.jpg', alt: product.name, isMain: true }];

  const productStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: mainImages[0]?.url,
    brand: { '@type': 'Brand', name: 'Curvenherbs' },
    offers: {
      '@type': 'Offer',
      price: displayPrice,
      priceCurrency: 'NGN',
      availability: product.isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://curvenherbs.com/shop/${product.slug}`,
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toFixed(1),
        reviewCount: product.reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };

  const sections = [
    { key: 'benefits', label: 'Key Benefits', content: (
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {product.keyBenefits.map((b: string, i: number) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
            <span style={{ marginTop: 2, width: 20, height: 20, borderRadius: '50%', background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: '0.65rem' }}>✓</span>
            </span>
            <span style={{ color: '#4b5563', fontSize: '0.9rem' }}>{b}</span>
          </li>
        ))}
      </ul>
    )},
    { key: 'ingredients', label: 'Natural Ingredients', content: (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {product.ingredients.map((ing: ProductIngredient, i: number) => (
          <span key={i} style={{ background: '#F5F0E8', border: '1px solid #EDE7D9', padding: '0.375rem 0.875rem', borderRadius: 9999, fontSize: '0.8rem', color: '#374151' }}>
            🌿 {ing.name}
          </span>
        ))}
      </div>
    )},
    { key: 'usage', label: 'How to Use', content: (
      <p style={{ color: '#4b5563', lineHeight: 1.75, fontSize: '0.9rem' }}>{product.usageInstructions}</p>
    )},
    ...(product.expectedResults ? [{ key: 'results', label: 'Expected Results', content: (
      <p style={{ color: '#4b5563', lineHeight: 1.75, fontSize: '0.9rem' }}>{product.expectedResults}</p>
    )}] : []),
  ];

  return (
    <div style={{ background: '#F5F0E8' }}>
      <SEO
        title={product.name}
        description={`${product.description} — ${product.keyBenefits.slice(0, 3).join(', ')}. Buy now from Curvenherbs, Nigeria's trusted herbal brand.`}
        image={mainImages[0]?.url}
        url={`/shop/${product.slug}`}
        type="product"
        keywords={`${product.name}, ${product.category}, herbal ${product.category.toLowerCase()} Nigeria, buy ${product.name.toLowerCase()}, Curvenherbs`}
        structuredData={productStructuredData}
      />
      <div style={{ paddingTop: '5rem' }}>
        {/* Breadcrumb */}
        <div className="container-brand" style={{ paddingTop: '1.5rem', paddingBottom: '0.5rem' }}>
          <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
            <FiArrowLeft size={14} /> Back to Shop
          </Link>
        </div>

        <div className="container-brand" style={{ paddingTop: '1.5rem', paddingBottom: '5rem' }}>
          <div className="grid-2-lg" style={{ gap: '3rem' }}>

            {/* ── Image Gallery ── */}
            <div>
              <div style={{ position: 'relative', aspectRatio: '1/1', background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={mainImages[selectedImage]?.url}
                    alt={mainImages[selectedImage]?.alt || product.name}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </AnimatePresence>
                {discount > 0 && (
                  <div style={{ position: 'absolute', top: 16, left: 16, background: '#E91E63', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.75rem', borderRadius: 9999 }}>
                    -{discount}%
                  </div>
                )}
                {product.isInHouse && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(46,125,50,0.9)', color: '#fff', fontSize: '0.7rem', fontWeight: 600, padding: '0.3rem 0.75rem', borderRadius: 9999, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FaLeaf size={10} /> In-House
                  </div>
                )}
              </div>

              {mainImages.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(mainImages.length, 4)}, 1fr)`, gap: '0.75rem', marginTop: '0.875rem' }}>
                  {mainImages.map((img: ProductImage, i: number) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      style={{ aspectRatio: '1/1', borderRadius: 14, overflow: 'hidden', border: `2px solid ${selectedImage === i ? '#E91E63' : 'transparent'}`, cursor: 'pointer', padding: 0, transform: selectedImage === i ? 'scale(1.04)' : 'scale(1)', transition: 'all 0.2s' }}>
                      <img src={img.url} alt={img.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product Info ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Category + Name */}
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                  <span className="badge-green"><FaLeaf size={9} style={{ marginRight: 4 }} />{product.category}</span>
                  {product.subCategory && <span className="badge-pink">{product.subCategory}</span>}
                </div>
                <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.15, color: '#111827', marginBottom: '0.625rem' }}>
                  {product.name}
                </h1>
                <p style={{ color: '#6b7280', lineHeight: 1.7, fontSize: '0.95rem' }}>{product.description}</p>
              </div>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[1,2,3,4,5].map(s => (
                    <FaStar key={s} size={16} style={{ color: s <= Math.round(product.rating) ? '#E91E63' : '#e5e7eb' }} />
                  ))}
                </div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.rating.toFixed(1)}</span>
                <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', fontWeight: 800, color: '#111827' }}>
                  {formatNaira(displayPrice)}
                </span>
                {product.discountedPrice && (
                  <span style={{ fontSize: '1.25rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                    {formatNaira(product.price)}
                  </span>
                )}
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: product.isInStock ? '#16a34a' : '#dc2626', background: product.isInStock ? '#dcfce7' : '#fee2e2', padding: '0.2rem 0.625rem', borderRadius: 9999 }}>
                  {product.isInStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              {/* Size / Pack */}
              {(product.sizeVolume || product.packSize) && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {product.sizeVolume && <span style={{ background: '#fff', border: '1px solid #EDE7D9', padding: '0.3rem 0.875rem', borderRadius: 9999, fontSize: '0.8rem', color: '#374151' }}>📦 {product.sizeVolume}</span>}
                  {product.packSize && <span style={{ background: '#fff', border: '1px solid #EDE7D9', padding: '0.3rem 0.875rem', borderRadius: 9999, fontSize: '0.8rem', color: '#374151' }}>🗂 {product.packSize}</span>}
                </div>
              )}

              {/* Formulation Note */}
              {product.formulationNote && (
                <div style={{ background: '#F8F1E3', borderLeft: '4px solid #2E7D32', padding: '0.875rem 1rem', borderRadius: '0 12px 12px 0', fontSize: '0.82rem', color: '#4b5563', fontStyle: 'italic' }}>
                  {product.formulationNote}
                </div>
              )}

              {/* Accordion Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sections.map(({ key, label, content }) => (
                  <div key={key} style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid #EDE7D9' }}>
                    <button onClick={() => toggleSection(key)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.125rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', color: '#111827' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: '#2E7D32' }}>✦</span> {label}
                      </span>
                      {expandedSection === key ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          style={{ overflow: 'hidden' }}>
                          <div style={{ padding: '0 1.125rem 1rem' }}>{content}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Quantity + Actions */}
              <div style={{ borderTop: '1px solid #EDE7D9', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Qty:</span>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #EDE7D9', borderRadius: 9999, overflow: 'hidden' }}>
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#374151' }}>
                      <FaMinus size={12} />
                    </button>
                    <span style={{ width: 40, textAlign: 'center', fontWeight: 700, fontSize: '1rem' }}>{quantity}</span>
                    <button onClick={() => setQuantity(q => q + 1)}
                      style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', color: '#374151' }}>
                      <FaPlus size={12} />
                    </button>
                  </div>
                  <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    Total: <strong style={{ color: '#111827' }}>{formatNaira(displayPrice * quantity)}</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={handleAddToCart} disabled={!product.isInStock}
                    className="btn-pink"
                    style={{ flex: 1, minWidth: 160, gap: '0.5rem' }}>
                    {addedToCart
                      ? <><FaCheckCircle size={15} /> Added!</>
                      : <><FaShoppingCart size={15} /> Add to Cart</>}
                  </button>
                  <a href={getWhatsAppOrderLink(product.name)} target="_blank" rel="noreferrer"
                    className="btn-green"
                    style={{ flex: 1, minWidth: 160 }}>
                    <FaWhatsapp size={15} /> Order via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Reviews Section ── */}
          <div style={{ marginTop: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <span className="badge-pink">Customer Reviews</span>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#111827' }}>
                  What Our Customers Say
                </h2>
              </div>
              <button onClick={() => setShowReviewForm(v => !v)} className="btn-outline-pink" style={{ fontSize: '0.85rem', padding: '0.625rem 1.25rem' }}>
                {showReviewForm ? 'Cancel' : '+ Write a Review'}
              </button>
            </div>

            {/* Review Form */}
            <AnimatePresence>
              {showReviewForm && (
                <motion.form onSubmit={handleSubmitReview}
                  initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  style={{ background: '#fff', borderRadius: 20, padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#111827' }}>Share Your Experience</h3>
                  <input className="input-brand" placeholder="Your name" required
                    value={reviewForm.customerName}
                    onChange={e => setReviewForm(f => ({ ...f, customerName: e.target.value }))} />
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Rating</p>
                    <div style={{ display: 'flex', gap: '0.375rem' }}>
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
                          <FaStar size={24} style={{ color: s <= reviewForm.rating ? '#E91E63' : '#e5e7eb', transition: 'color 0.15s' }} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea className="input-brand" placeholder="Tell us about your experience (optional)" rows={3}
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    style={{ resize: 'vertical' }} />
                  <button type="submit" className="btn-pink" disabled={addReview.isPending} style={{ alignSelf: 'flex-start' }}>
                    {addReview.isPending ? 'Submitting…' : 'Submit Review'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {reviewSubmitted && (
              <div style={{ background: '#dcfce7', border: '1px solid #86efac', borderRadius: 12, padding: '0.875rem 1.25rem', marginBottom: '1.5rem', color: '#166534', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaCheckCircle /> Thank you! Your review is pending approval.
              </div>
            )}

            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', background: '#fff', borderRadius: 20 }}>
                <FaStar size={32} style={{ margin: '0 auto 0.75rem', color: '#e5e7eb' }} />
                <p>No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {reviews.map((review: import('@/types').Review) => (
                  <div key={review._id} style={{ background: '#fff', borderRadius: 20, padding: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[1,2,3,4,5].map(s => (
                          <FaStar key={s} size={13} style={{ color: s <= review.rating ? '#E91E63' : '#e5e7eb' }} />
                        ))}
                      </div>
                      {review.verified && (
                        <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <FaCheckCircle size={10} /> Verified
                        </span>
                      )}
                    </div>
                    {review.comment && <p style={{ color: '#4b5563', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '0.875rem' }}>"{review.comment}"</p>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111827' }}>{review.customerName}</span>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ background: '#F5F0E8', paddingTop: '7rem' }} className="container-brand">
      <div className="grid-2-lg" style={{ gap: '3rem' }}>
        <div className="skeleton" style={{ aspectRatio: '1/1', borderRadius: 24 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[80, 200, 60, 120, 180].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: i === 1 ? 48 : 24, width: `${w}%`, maxWidth: '100%', borderRadius: 8 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div style={{ background: '#F5F0E8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem', padding: '8rem 1rem' }}>
      <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Product not found.</p>
      <Link to="/shop" className="btn-green">Back to Shop</Link>
    </div>
  );
}
