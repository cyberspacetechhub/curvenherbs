import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLeaf, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { useRegister } from '@/hooks/auth/useAuth';
import { registerSchema, type RegisterFormData } from '@/lib/schemas';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mutate: register_, isPending, error, isSuccess } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword: _, ...payload } = data;
    register_(payload, { onSuccess: () => {} });
  };

  const apiError = (error as any)?.response?.data?.message;

  if (isSuccess) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.25rem 3rem' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 24, padding: '2.5rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <FaCheckCircle size={32} style={{ color: '#2E7D32' }} />
          </div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>
            Account Created! 🎉
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            Welcome to Curvenherbs! Your account is ready. Sign in to start your curve journey.
          </p>
          <button onClick={() => navigate('/login')} className="btn-pink" style={{ justifyContent: 'center', width: '100%' }}>
            Sign In Now
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 1.25rem 3rem' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 480 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <FaLeaf size={28} style={{ color: '#2E7D32' }} />
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.5rem', fontWeight: 700, color: '#2E7D32' }}>
              Curvenherbs
            </span>
          </Link>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>Start your natural curve journey 🌿</p>
        </div>

        <div style={{ background: '#fff', borderRadius: 24, padding: '2.25rem', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.625rem', fontWeight: 800, color: '#111827', marginBottom: '0.375rem' }}>
            Create Account
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#E91E63', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
          </p>

          {apiError && (
            <div style={{ background: '#FDE8F0', border: '1px solid #F8C1D4', borderRadius: 12, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#C2185B' }}>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>

            {/* Name row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              <Field label="First Name" error={errors.firstName?.message}>
                <div style={{ position: 'relative' }}>
                  <FiUser size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input {...register('firstName')} placeholder="Ada"
                    className={`input-brand${errors.firstName ? ' error' : ''}`}
                    style={{ paddingLeft: '2.375rem' }} />
                </div>
              </Field>
              <Field label="Last Name" error={errors.lastName?.message}>
                <div style={{ position: 'relative' }}>
                  <FiUser size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                  <input {...register('lastName')} placeholder="Okafor"
                    className={`input-brand${errors.lastName ? ' error' : ''}`}
                    style={{ paddingLeft: '2.375rem' }} />
                </div>
              </Field>
            </div>

            {/* Email */}
            <Field label="Email Address" error={errors.email?.message}>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input {...register('email')} type="email" placeholder="your@email.com"
                  className={`input-brand${errors.email ? ' error' : ''}`}
                  style={{ paddingLeft: '2.5rem' }} />
              </div>
            </Field>

            {/* Phone */}
            <Field label="Phone Number" error={errors.phone?.message}>
              <div style={{ position: 'relative' }}>
                <FiPhone size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input {...register('phone')} type="tel" placeholder="08012345678"
                  className={`input-brand${errors.phone ? ' error' : ''}`}
                  style={{ paddingLeft: '2.5rem' }} />
              </div>
            </Field>

            {/* Password */}
            <Field label="Password" error={errors.password?.message}>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters"
                  className={`input-brand${errors.password ? ' error' : ''}`}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 2 }}>
                  {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </Field>

            {/* Confirm Password */}
            <Field label="Confirm Password" error={errors.confirmPassword?.message}>
              <div style={{ position: 'relative' }}>
                <FiLock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input {...register('confirmPassword')} type={showConfirm ? 'text' : 'password'} placeholder="Repeat password"
                  className={`input-brand${errors.confirmPassword ? ' error' : ''}`}
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', padding: 2 }}>
                  {showConfirm ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </Field>

            <button type="submit" disabled={isPending} className="btn-pink" style={{ justifyContent: 'center', marginTop: '0.25rem' }}>
              {isPending ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
              By registering you agree to our{' '}
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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{label}</label>
      {children}
      {error && <p style={{ fontSize: '0.72rem', color: '#E91E63' }}>{error}</p>}
    </div>
  );
}
