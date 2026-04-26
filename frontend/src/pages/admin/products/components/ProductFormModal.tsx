import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCreateProduct, useUpdateProduct } from '@/hooks/products/useProducts';
import ProductImageUpload from './ProductImageUpload';
import type { Product, ProductCategory, ProductSubCategory } from '@/types';

const CATEGORIES: ProductCategory[] = ['Weight Gain', 'Curve Enhancement', 'Flat Tummy', 'Combo Packs', 'Topical', 'Suppository'];
const SUBCATEGORIES: ProductSubCategory[] = ['Syrup', 'Powder', 'Cream', 'Oil', 'Set'];

interface Props { product: Product | null; onClose: () => void; }

type FormState = {
  name: string; description: string; longDescription: string;
  category: string; subCategory: string; price: string; discountedPrice: string;
  stock: string; isInStock: boolean; isInHouse: boolean; formulationNote: string;
  usageInstructions: string; recommendedFor: string; expectedResults: string;
  sizeVolume: string; packSize: string; tags: string;
  keyBenefits: string[]; ingredients: { name: string; description: string }[];
};

const EMPTY: FormState = {
  name: '', description: '', longDescription: '', category: '', subCategory: '',
  price: '', discountedPrice: '', stock: '0', isInStock: true, isInHouse: true,
  formulationNote: '', usageInstructions: '', recommendedFor: '', expectedResults: '',
  sizeVolume: '', packSize: '', tags: '', keyBenefits: [''], ingredients: [{ name: '', description: '' }],
};

export default function ProductFormModal({ product, onClose }: Props) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { mutate: create, isPending: creating } = useCreateProduct();
  const { mutate: update, isPending: updating } = useUpdateProduct();
  const isPending = creating || updating;

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name, description: product.description,
        longDescription: product.longDescription ?? '',
        category: product.category, subCategory: product.subCategory ?? '',
        price: String(product.price), discountedPrice: String(product.discountedPrice ?? ''),
        stock: String(product.stock), isInStock: product.isInStock, isInHouse: product.isInHouse,
        formulationNote: product.formulationNote, usageInstructions: product.usageInstructions ?? '',
        recommendedFor: product.recommendedFor ?? '', expectedResults: product.expectedResults ?? '',
        sizeVolume: product.sizeVolume ?? '', packSize: product.packSize ?? '',
        tags: product.tags.join(', '),
        keyBenefits: product.keyBenefits.length ? product.keyBenefits : [''],
        ingredients: product.ingredients.length ? product.ingredients : [{ name: '', description: '' }],
      });
      setImagePreview(product.images[0]?.url ?? null);
    } else {
      setForm(EMPTY);
      setImageFile(null);
      setImagePreview(null);
    }
  }, [product]);

  const set = (key: keyof FormState, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    const fields: Record<string, any> = {
      name: form.name, description: form.description, longDescription: form.longDescription,
      category: form.category, subCategory: form.subCategory || undefined,
      price: form.price, discountedPrice: form.discountedPrice || undefined,
      stock: form.stock, isInStock: form.isInStock, isInHouse: form.isInHouse,
      formulationNote: form.formulationNote, usageInstructions: form.usageInstructions,
      recommendedFor: form.recommendedFor, expectedResults: form.expectedResults,
      sizeVolume: form.sizeVolume, packSize: form.packSize,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean).join(','),
    };
    Object.entries(fields).forEach(([k, v]) => { if (v !== undefined && v !== '') fd.append(k, String(v)); });
    form.keyBenefits.filter(Boolean).forEach(b => fd.append('keyBenefits[]', b));
    form.ingredients.filter(i => i.name).forEach((ing, idx) => {
      fd.append(`ingredients[${idx}][name]`, ing.name);
      fd.append(`ingredients[${idx}][description]`, ing.description);
    });
    if (imageFile) fd.append('image', imageFile);

    if (product) {
      update({ id: product._id, data: fd }, { onSuccess: onClose });
    } else {
      create(fd, { onSuccess: onClose });
    }
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
          onClick={e => e.stopPropagation()}
          style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 760, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

          {/* Header */}
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDE7D9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} style={{ background: '#F5F0E8', border: 'none', borderRadius: 8, padding: '0.5rem', cursor: 'pointer', display: 'flex' }}>
              <FiX size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.5rem' }} className="product-form-grid">

              {/* Image */}
              <ProductImageUpload preview={imagePreview} onChange={handleImageChange} onClear={() => { setImageFile(null); setImagePreview(null); }} />

              {/* Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                <Row2>
                  <Field label="Product Name *">
                    <input value={form.name} onChange={e => set('name', e.target.value)} required className="input-brand" placeholder="e.g. Bum & Hips Growth Syrup" />
                  </Field>
                  <Field label="Category *">
                    <select value={form.category} onChange={e => set('category', e.target.value)} required className="input-brand" style={{ cursor: 'pointer' }}>
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                </Row2>

                <Row2>
                  <Field label="Sub-Category">
                    <select value={form.subCategory} onChange={e => set('subCategory', e.target.value)} className="input-brand" style={{ cursor: 'pointer' }}>
                      <option value="">None</option>
                      {SUBCATEGORIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Tags (comma separated)">
                    <input value={form.tags} onChange={e => set('tags', e.target.value)} className="input-brand" placeholder="best-seller, natural" />
                  </Field>
                </Row2>

                <Field label="Short Description *">
                  <textarea value={form.description} onChange={e => set('description', e.target.value)} required className="input-brand" rows={2} style={{ resize: 'vertical' }} placeholder="Marketing description" />
                </Field>

                <Field label="Long Description">
                  <textarea value={form.longDescription} onChange={e => set('longDescription', e.target.value)} className="input-brand" rows={3} style={{ resize: 'vertical' }} placeholder="Detailed product explanation" />
                </Field>

                <Row2>
                  <Field label="Price (₦) *">
                    <input type="number" value={form.price} onChange={e => set('price', e.target.value)} required className="input-brand" placeholder="25000" min={0} />
                  </Field>
                  <Field label="Discounted Price (₦)">
                    <input type="number" value={form.discountedPrice} onChange={e => set('discountedPrice', e.target.value)} className="input-brand" placeholder="22000" min={0} />
                  </Field>
                </Row2>

                <Row2>
                  <Field label="Stock Quantity">
                    <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} className="input-brand" min={0} />
                  </Field>
                  <Field label="Size / Volume">
                    <input value={form.sizeVolume} onChange={e => set('sizeVolume', e.target.value)} className="input-brand" placeholder="500ml" />
                  </Field>
                </Row2>

                <Row2>
                  <Field label="Pack Size">
                    <input value={form.packSize} onChange={e => set('packSize', e.target.value)} className="input-brand" placeholder="Single / Combo" />
                  </Field>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', paddingTop: '1.5rem' }}>
                    <Toggle label="In Stock" checked={form.isInStock} onChange={v => set('isInStock', v)} />
                    <Toggle label="In-House" checked={form.isInHouse} onChange={v => set('isInHouse', v)} />
                  </div>
                </Row2>

                <Field label="Usage Instructions">
                  <textarea value={form.usageInstructions} onChange={e => set('usageInstructions', e.target.value)} className="input-brand" rows={2} style={{ resize: 'vertical' }} />
                </Field>

                <Row2>
                  <Field label="Recommended For">
                    <input value={form.recommendedFor} onChange={e => set('recommendedFor', e.target.value)} className="input-brand" />
                  </Field>
                  <Field label="Expected Results">
                    <input value={form.expectedResults} onChange={e => set('expectedResults', e.target.value)} className="input-brand" />
                  </Field>
                </Row2>

                <Field label="Formulation Note">
                  <input value={form.formulationNote} onChange={e => set('formulationNote', e.target.value)} className="input-brand" />
                </Field>

                {/* Key Benefits */}
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Key Benefits</p>
                  {form.keyBenefits.map((b, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input value={b} onChange={e => { const arr = [...form.keyBenefits]; arr[i] = e.target.value; set('keyBenefits', arr); }}
                        className="input-brand" placeholder={`Benefit ${i + 1}`} style={{ flex: 1 }} />
                      <button type="button" onClick={() => set('keyBenefits', form.keyBenefits.filter((_, j) => j !== i))}
                        style={{ background: '#FDE8F0', border: 'none', borderRadius: 8, padding: '0 0.625rem', cursor: 'pointer', color: '#C2185B', display: 'flex', alignItems: 'center' }}>
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => set('keyBenefits', [...form.keyBenefits, ''])}
                    style={{ background: 'none', border: '1.5px dashed #EDE7D9', borderRadius: 8, padding: '0.375rem 0.875rem', cursor: 'pointer', fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <FiPlus size={13} /> Add Benefit
                  </button>
                </div>

                {/* Ingredients */}
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Ingredients</p>
                  {form.ingredients.map((ing, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input value={ing.name} onChange={e => { const arr = [...form.ingredients]; arr[i] = { ...arr[i], name: e.target.value }; set('ingredients', arr); }}
                        className="input-brand" placeholder="Name" />
                      <input value={ing.description} onChange={e => { const arr = [...form.ingredients]; arr[i] = { ...arr[i], description: e.target.value }; set('ingredients', arr); }}
                        className="input-brand" placeholder="Description" />
                      <button type="button" onClick={() => set('ingredients', form.ingredients.filter((_, j) => j !== i))}
                        style={{ background: '#FDE8F0', border: 'none', borderRadius: 8, padding: '0 0.625rem', cursor: 'pointer', color: '#C2185B', display: 'flex', alignItems: 'center' }}>
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => set('ingredients', [...form.ingredients, { name: '', description: '' }])}
                    style={{ background: 'none', border: '1.5px dashed #EDE7D9', borderRadius: 8, padding: '0.375rem 0.875rem', cursor: 'pointer', fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <FiPlus size={13} /> Add Ingredient
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #EDE7D9', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn-outline-pink" style={{ padding: '0.625rem 1.25rem', fontSize: '0.85rem' }}>Cancel</button>
              <button type="submit" disabled={isPending} className="btn-pink" style={{ padding: '0.625rem 1.5rem', fontSize: '0.85rem' }}>
                {isPending ? 'Saving…' : product ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>

      <style>{`
        @media (max-width: 600px) {
          .product-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>{label}</label>
      {children}
    </div>
  );
}

function Row2({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>{children}</div>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>
      <div onClick={() => onChange(!checked)}
        style={{ width: 36, height: 20, borderRadius: 10, background: checked ? '#2E7D32' : '#e5e7eb', position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 2, left: checked ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
      </div>
      {label}
    </label>
  );
}
