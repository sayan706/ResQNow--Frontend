'use client';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/Loader';

export default function Register() {
  const container = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.reg-bg-blob', {
      scale: 0.7,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
    })
      .from('.reg-card', {
        y: 70,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      }, '-=0.9')
      .from('.reg-field', {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      }, '-=0.5');
  }, { scope: container });

  const getPasswordStrength = () => {
    if (password.length === 0) return null;
    if (password.length < 6) return { label: 'Weak', color: '#ff3b30', width: '25%' };
    if (password.length < 10) return { label: 'Fair', color: '#FF9933', width: '55%' };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { label: 'Strong', color: '#138808', width: '100%' };
    }
    return { label: 'Good', color: '#4cd964', width: '75%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const pwd = formData.get('password') as string;
    const confirmPwd = formData.get('confirmPassword') as string;

    if (pwd !== confirmPwd) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password: pwd }),
      });

      const data = await response.json();

      if (response.ok) {
        router.replace('/login');
      } else {
        setError(data.detail || data.message || 'Error creating account. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  // Shared input style
  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#ffffff',
  };

  return (
    <div
      ref={container}
      className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #022448 45%, #0b2d1a 100%)' }}
    >
      {/* Animated blobs */}
      <div className="reg-bg-blob absolute top-[-15%] right-[-10%] w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #138808 0%, transparent 70%)' }} />
      <div className="reg-bg-blob absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF9933 0%, transparent 70%)' }} />
      <div className="reg-bg-blob absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #000080 0%, transparent 70%)' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              background: '#138808',
              opacity: 0.3,
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3.5 + i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <main className="w-full max-w-[480px] relative z-10 reg-card">
        {/* Logo — white card */}
        <div className="flex flex-col items-center mb-8 reg-field">
          <div
            className="mb-5 bg-white rounded-2xl px-8 py-5 shadow-2xl border border-white/40 hover-lift"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
          >
            <img
              alt="ResQNow Logo"
              className="h-16 w-auto"
              src="/resq_logo_official.png"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-india-green animate-pulse" />
            <p className="text-sm tracking-wide" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Join the Command Center
            </p>
          </div>
        </div>

        {/* Register Card */}
        <div
          className="rounded-2xl p-8 md:p-10 relative overflow-hidden border border-white/15"
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* India flag accent stripe */}
          <div
            className="absolute top-0 left-0 w-full h-[3px]"
            style={{ background: 'linear-gradient(to right, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)' }}
          />

          <div className="mb-7 reg-field">
            <h2 className="font-headline text-xl font-bold" style={{ color: '#ffffff' }}>
              Create Your Account
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Register to access the emergency intelligence platform.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            {/* Username */}
            <div className="space-y-2 reg-field">
              <label className="block text-sm font-bold" style={{ color: 'rgba(255,255,255,0.8)' }} htmlFor="username">
                Username
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px]"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>badge</span>
                <input
                  className="w-full pl-10 pr-4 py-3.5 outline-none rounded-xl text-sm transition-all duration-300"
                  style={inputStyle}
                  id="username"
                  name="username"
                  placeholder="dispatcher_01"
                  required
                  type="text"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2 reg-field">
              <label className="block text-sm font-bold" style={{ color: 'rgba(255,255,255,0.8)' }} htmlFor="reg-email">
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px]"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>mail</span>
                <input
                  className="w-full pl-10 pr-4 py-3.5 outline-none rounded-xl text-sm transition-all duration-300"
                  style={inputStyle}
                  id="reg-email"
                  name="email"
                  placeholder="agent@resqnow.org"
                  required
                  type="email"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2 reg-field">
              <label className="block text-sm font-bold" style={{ color: 'rgba(255,255,255,0.8)' }} htmlFor="reg-password">
                Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px]"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>lock</span>
                <input
                  className="w-full pl-10 pr-12 py-3.5 outline-none rounded-xl text-sm transition-all duration-300"
                  style={inputStyle}
                  id="reg-password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>

              {/* Password Strength Meter */}
              {strength && (
                <div className="space-y-1">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: strength.width, backgroundColor: strength.color }}
                    />
                  </div>
                  <p className="text-[11px] font-semibold" style={{ color: strength.color }}>
                    Strength: {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2 reg-field">
              <label className="block text-sm font-bold" style={{ color: 'rgba(255,255,255,0.8)' }} htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px]"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>lock_reset</span>
                <input
                  className="w-full pl-10 pr-12 py-3.5 outline-none rounded-xl text-sm transition-all duration-300"
                  style={inputStyle}
                  id="confirm-password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                  style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showConfirm ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 reg-field">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 w-4 h-4 accent-india-green cursor-pointer"
              />
              <label className="text-xs leading-relaxed cursor-pointer" style={{ color: 'rgba(255,255,255,0.55)' }} htmlFor="terms">
                I agree to the{' '}
                <a style={{ color: '#FF9933' }} href="#">Terms of Service</a>
                {' '}and{' '}
                <a style={{ color: '#FF9933' }} href="#">Privacy Policy</a>
              </label>
            </div>

            {/* ── CREATE ACCOUNT BUTTON ─────────────────────────────────── */}
            <div className="reg-field">
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: '700',
                  fontSize: '1rem',
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #138808 0%, #0a6006 100%)',
                  boxShadow: '0 8px 24px rgba(19, 136, 8, 0.5)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
                  opacity: isLoading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(19, 136, 8, 0.65)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(19, 136, 8, 0.5)';
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
              >
                <span style={{ color: '#ffffff', fontWeight: 700 }}>Create Account</span>
                <span className="material-symbols-outlined text-[18px]" style={{ color: '#ffffff' }}>
                  person_add
                </span>
              </button>
            </div>
          </form>

          {isLoading && <Loader fullScreen message="Creating Account..." />}

          {/* Sign In Link */}
          <div
            className="mt-8 pt-6 text-center reg-field"
            style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
          >
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Already have an account?{' '}
              <Link
                href="/login"
                style={{ color: '#FF9933', fontWeight: 700 }}
                className="underline-offset-4 hover:underline transition-all duration-200 ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security Meta */}
        <footer className="mt-6 flex flex-col items-center gap-3 reg-field" style={{ opacity: 0.65 }}>
          <div className="flex items-center gap-5 text-[11px] font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px]">shield</span>
              AES-256 ENCRYPTED
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px]" style={{ color: '#138808' }}>verified_user</span>
              SECURE SIGNUP
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="text-[10px] font-bold tracking-tight" style={{ color: 'rgba(255,255,255,0.6)' }}>MADE IN INDIA 🇮🇳</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
