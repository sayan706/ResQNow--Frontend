'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Login() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.login-card', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
    
    gsap.from('.stagger-item', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.3
    });
  }, { scope: container });

  return (
    <div ref={container} className="bg-surface text-on-background min-h-screen flex items-center justify-center p-6 selection:bg-primary-fixed selection:text-on-primary-fixed">
      <main className="w-full max-w-[440px] login-card">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 bg-surface-container-highest rounded-xl p-3 relative shadow-sm">
            <img alt="ResQNow Logo" className="w-auto h-24" src="/logo.png" />
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-tight text-primary">ResQNow</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-on-surface-variant text-sm">Emergency Command Center</p>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-bold text-india-green uppercase tracking-wider">India</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-lowest login-card-shadow rounded-xl p-8 md:p-10 relative overflow-hidden border border-outline-variant/10" style={{ boxShadow: '0px 12px 32px rgba(25, 28, 29, 0.06)' }}>
          {/* Indian Flag Themed Accent */}
          <div className="absolute top-0 left-0 w-full" style={{ background: 'linear-gradient(to right, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)', height: '3px' }}></div>
          <div className="mb-8 stagger-item">
            <h2 className="font-headline text-xl font-bold text-on-surface">Secure Access</h2>
            <p className="text-on-surface-variant text-sm mt-2">Enter your credentials to monitor active units.</p>
          </div>

          <form className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2 stagger-item">
              <label className="block text-sm font-bold font-label text-on-surface" htmlFor="email">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] transition-colors group-focus-within:text-india-saffron">mail</span>
                <input className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-0 outline-none rounded-lg text-on-surface placeholder:text-outline-variant/60 focus:ring-2 focus:ring-india-saffron/30 transition-all text-sm" id="email" name="email" placeholder="agent@resqnow.org" required type="email" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2 stagger-item">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold font-label text-on-surface" htmlFor="password">Password</label>
                <a className="text-xs font-semibold text-primary-container hover:text-india-saffron transition-colors" href="#">Forgot Access?</a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] transition-colors group-focus-within:text-india-saffron">lock</span>
                <input className="w-full pl-10 pr-10 py-3 bg-surface-container-low border-0 outline-none rounded-lg text-on-surface placeholder:text-outline-variant/60 focus:ring-2 focus:ring-india-saffron/30 transition-all text-sm" id="password" name="password" placeholder="••••••••" required type="password" />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-india-saffron transition-colors" type="button">
                  <span className="material-symbols-outlined text-[20px]">visibility</span>
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center space-x-3 stagger-item">
              <div className="relative inline-flex items-center cursor-pointer">
                <input className="sr-only peer" id="remember" type="checkbox" />
                <div className="w-10 h-5 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-india-green"></div>
              </div>
              <label className="text-xs font-medium text-on-surface-variant select-none" htmlFor="remember">Maintain session for 24 hours</label>
            </div>

            {/* Primary Action */}
            <button className="stagger-item w-full bg-primary text-white font-headline font-bold py-3.5 rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2 shadow-sm border-b-2 border-india-green" style={{ boxShadow: 'inset 0px 1px 0px rgba(255, 255, 255, 0.1)' }} type="submit">
              <span>Sign In</span>
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </button>
          </form>

          {/* Secondary Action */}
          <div className="mt-8 pt-8 border-t border-outline-variant/10 text-center stagger-item">
            <p className="text-sm text-on-surface-variant">
              New to the Command Center? 
              <a className="font-bold text-india-green hover:text-india-saffron transition-colors underline-offset-4 hover:underline ml-1" href="#">Register</a>
            </p>
          </div>
        </div>

        {/* Footer / Security Meta */}
        <footer className="mt-8 flex flex-col items-center gap-4 login-card opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-6 text-outline-variant text-[11px] font-medium tracking-widest uppercase">
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">shield</span> AES-256 ENCRYPTED</span>
            <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px] text-india-green">history</span> UPTIME 99.9%</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full border border-outline-variant/20">
              <span className="text-[10px] font-bold text-on-surface-variant tracking-tighter">MADE IN INDIA</span>
            </div>
            <p className="text-[10px] text-outline-variant text-center max-w-[280px] leading-relaxed">
              Authorized access only. Securely hosted in India for regional emergency response operations.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
