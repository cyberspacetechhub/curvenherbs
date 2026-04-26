import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiMail, FiLock } from 'react-icons/fi';
import { useLogin } from '@/hooks/auth/useAuth';
import { useAuthStore } from '@/store/authStore';
import { loginSchema, type LoginFormData } from '@/lib/schemas';
import SEO from '@/components/SEO';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/';
  const { mutate: login, isPending, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        const user = useAuthStore.getState().user;
        const dest = user?.type === 'Admin' ? '/admin' : (from === '/login' ? '/' : from);
        navigate(dest, { replace: true });
      },
    });
  };

  const apiError = (error as any)?.response?.data?.message;

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.25rem 3rem' }}>
      <SEO title="Sign In" url="/login" noIndex />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <FaLeaf size={28} style={{ color: '#2E7D32' }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 700, color: '#2E7D32' }}>
              Curvenherbs
            </span>
          </Link>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>Welcome back 🌿</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 24, padding: '2.25rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>
            Sign In
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#E91E63', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
          </p>

          {apiError && (
            <div style={{ background: '#FDE8F0', border: '1px solid #F8C1D4', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#C2185B' }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input {...register('email')} type="email" placeholder="your@email.com"
                  className={`input-brand${errors.email ? ' error' : ''}`}
                  style={{ paddingLeft: '2.5rem' }} />
              </div>
              {errors.email && <p style={{ fontSize: '0.72rem', color: '#E91E63' }}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  className={`input-brand${errors.password ? ' error' : ''}`}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 2 }}>
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
              {errors.password && <p style={{ fontSize: '0.72rem', color: '#E91E63' }}>{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isPending} className="btn-pink" style={{ justifyContent: 'center', marginTop: '0.25rem' }}>
              {isPending ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              By signing in you agree to our{' '}
              <span style={{ color: '#2E7D32', fontWeight: 500 }}>Terms of Service</span>
            </p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <Link to="/" style={{ color: '#2E7D32', fontWeight: 500, textDecoration: 'none' }}>← Back to Home</Link>
        </p>
      </motion.div>
    </div>
  );
}
