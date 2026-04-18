'use client';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/Loader';

export default function Login() {
  const container = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.login-bg-blob', {
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
    })
    .from('.login-card', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.8')
    .from('.login-field', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.09,
      ease: 'power2.out',
    }, '-=0.4');
  }, { scope: container });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access_token || data.token);
        // Save the username or fallback to email prefix if the API doesn't return one
        localStorage.setItem('username', data.username || data.name || email.split('@')[0]);
        router.replace('/');
      } else {
        setError(data.detail || data.message || 'Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={container}
      className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #022448 50%, #0d2d4a 100%)' }}
    >
      {/* Animated background blobs */}
      <div className="login-bg-blob absolute top-[-10%] left-[-10%] w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FF9933 0%, transparent 70%)' }} />
      <div className="login-bg-blob absolute bottom-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #138808 0%, transparent 70%)' }} />
      <div className="login-bg-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #4a90d9 0%, transparent 70%)' }} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              background: '#FF9933',
              opacity: 0.3,
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <main className="w-full max-w-[440px] relative z-10 login-card">
        {/* Logo Section — white card so logo background matches */}
        <div className="flex flex-col items-center mb-8 login-field">
          <div
            className="mb-5 bg-white rounded-2xl px-8 py-5 shadow-2xl border border-white/40 hover-lift"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}
          >
            <img
              alt="ResQNow Logo"
              className="h-16 w-auto"
              src="/logo.png"
            />
          </div>
          <p className="text-white/60 text-sm mt-1 tracking-wide">Emergency Command Center</p>
        </div>

        {/* Login Card */}
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

          <div className="mb-7 login-field">
            <h2
              className="font-headline text-xl font-bold"
              style={{ color: '#ffffff' }}
            >
              Secure Access
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Enter your credentials to monitor active units.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 text-sm text-red-200">
                {error}
              </div>
            )}
            
            {/* Email Input */}
            <div className="space-y-2 login-field">
              <label
                className="block text-sm font-bold"
                style={{ color: 'rgba(255,255,255,0.8)' }}
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] transition-colors group-focus-within:text-india-saffron"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  mail
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3.5 outline-none rounded-xl text-sm transition-all duration-300 backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                  }}
                  id="email"
                  name="email"
                  placeholder="agent@resqnow.org"
                  required
                  type="email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2 login-field">
              <div className="flex justify-between items-center">
                <label
                  className="block text-sm font-bold"
                  style={{ color: 'rgba(255,255,255,0.8)' }}
                  htmlFor="password"
                >
                  Password
                </label>
                <a
                  className="text-xs font-semibold transition-colors duration-200"
                  style={{ color: '#FF9933' }}
                  href="#"
                >
                  Forgot Access?
                </a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] transition-colors group-focus-within:text-india-saffron"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>
                  lock
                </span>
                <input
                  className="w-full pl-10 pr-12 py-3.5 outline-none rounded-xl text-sm transition-all duration-300 backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                  }}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-200 p-1"
                  style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none' }}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-3 login-field">
              <div className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" id="remember" type="checkbox" />
                <div className="w-10 h-5 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-india-green transition-colors duration-300"
                  style={{ background: 'rgba(255,255,255,0.2)' }} />
              </div>
              <label
                className="text-xs font-medium select-none"
                style={{ color: 'rgba(255,255,255,0.55)' }}
                htmlFor="remember"
              >
                Maintain session for 24 hours
              </label>
            </div>

            {/* ── SIGN IN BUTTON ─────────────────────────────────────────── */}
            <div className="login-field">
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
                  background: 'linear-gradient(135deg, #FF9933 0%, #e07820 100%)',
                  boxShadow: '0 8px 24px rgba(255, 153, 51, 0.5)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
                  opacity: isLoading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 32px rgba(255, 153, 51, 0.65)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 24px rgba(255, 153, 51, 0.5)';
                }}
                onMouseDown={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
              >
                <span style={{ color: '#ffffff', fontWeight: 700 }}>Sign In</span>
                <span className="material-symbols-outlined text-[18px]" style={{ color: '#ffffff' }}>
                  verified_user
                </span>
              </button>
            </div>
          </form>

          {isLoading && <Loader fullScreen message="Authenticating..." />}

          {/* Register Link */}
          <div
            className="mt-8 pt-6 text-center login-field"
            style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
          >
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              New to the Command Center?{' '}
              <Link
                href="/register"
                style={{ color: '#FF9933', fontWeight: 700 }}
                className="underline-offset-4 hover:underline transition-all duration-200 ml-1"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Security Meta */}
        <footer className="mt-6 flex flex-col items-center gap-3 login-field" style={{ opacity: 0.65 }}>
          <div className="flex items-center gap-5 text-[11px] font-medium tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px]">shield</span>
              AES-256 ENCRYPTED
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px]" style={{ color: '#138808' }}>history</span>
              UPTIME 99.9%
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
