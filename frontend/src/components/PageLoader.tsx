import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#F5F0E8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      gap: '2rem',
    }}>

      {/* Logo mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}
      >
        {/* Animated leaf icon */}
        <div style={{ position: 'relative', width: 64, height: 64 }}>
          {/* Outer ring pulse */}
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(46,125,50,0.2), transparent)',
            }}
          />
          {/* Icon circle */}
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2E7D32, #1B5E20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(46,125,50,0.35)',
          }}>
            {/* Leaf SVG */}
            <motion.svg
              width="32" height="32" viewBox="0 0 24 24" fill="none"
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path
                d="M17 8C8 10 5.9 16.17 3.82 19.34C3.82 19.34 8 20 12 16C12 16 12 20 8 22C8 22 18 22 20 14C22 6 17 8 17 8Z"
                fill="#86efac"
              />
              <path
                d="M12 16C12 16 10 12 12 8"
                stroke="#dcfce7"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </motion.svg>
          </div>
        </div>

        {/* Brand name */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.375rem',
            fontWeight: 700,
            color: '#1B5E20',
            letterSpacing: '-0.01em',
          }}
        >
          Curvenherbs
        </motion.p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ width: 160, height: 3, background: '#EDE7D9', borderRadius: 99, overflow: 'hidden' }}
      >
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '60%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #E91E63, #2E7D32, transparent)',
            borderRadius: 99,
          }}
        />
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0.6, 0] }}
        transition={{ delay: 0.5, duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
        style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Natural Curves. Real Confidence.
      </motion.p>
    </div>
  );
}
