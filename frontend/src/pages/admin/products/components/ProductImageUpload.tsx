import { useRef } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

interface Props {
  preview: string | null;
  onChange: (file: File) => void;
  onClear: () => void;
}

export default function ProductImageUpload({ preview, onChange, onClear }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Product Image</p>
      {preview ? (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden', border: '2px solid #EDE7D9' }}>
          <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button type="button" onClick={onClear}
            style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <FiX size={14} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()}
          style={{ width: '100%', aspectRatio: '1/1', border: '2px dashed #EDE7D9', borderRadius: 12, background: '#F5F0E8', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#9ca3af', transition: 'border-color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#2E7D32')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#EDE7D9')}>
          <FiUpload size={24} />
          <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Click to upload</span>
          <span style={{ fontSize: '0.72rem' }}>JPG, PNG, WEBP</span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onChange(f); }} />
    </div>
  );
}
