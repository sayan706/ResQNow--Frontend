'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { ModeToggle } from '@/components/mode-toggle';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero stagger
    gsap.from('.hero-elem', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });

    // Scroll stagger elements
    const splitSections = gsap.utils.toArray('.scroll-section');
    splitSections.forEach((section: any) => {
      gsap.from(section.querySelectorAll('.scroll-elem'), {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="flex min-h-screen bg-surface">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-100 dark:bg-slate-950 flex flex-col py-6 z-50">
        <div className="px-6 mb-10">
          <h1 className="font-manrope font-bold text-[#1e3a5f] dark:text-white text-2xl tracking-tight">
            <img alt="ResQNow Logo" className="h-12 w-auto" src="/logo.png" />
          </h1>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mt-1">Command Center</p>
        </div>
        <nav className="flex-1 space-y-1">
          <a className="flex items-center px-6 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all duration-200 ease-in-out font-inter text-[0.875rem] font-medium" href="/">
            <span className="material-symbols-outlined mr-3">dashboard</span>
            Dashboard
          </a>
          <a className="flex items-center px-6 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all duration-200 ease-in-out font-inter text-[0.875rem] font-medium" href="/predict">
            <span className="material-symbols-outlined mr-3">psychology</span>
            AI Prediction
          </a>
          <a className="flex items-center px-6 py-3 bg-white dark:bg-slate-900 text-[#022448] dark:text-white font-bold rounded-l-none rounded-r-full transition-all duration-200 ease-in-out font-inter text-[0.875rem] border-l-4 border-india-saffron" href="/about">
            <span className="material-symbols-outlined mr-3 text-india-saffron" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            About
          </a>
          <a className="flex items-center px-6 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all duration-200 ease-in-out font-inter text-[0.875rem] font-medium mt-auto" href="/login">
            <span className="material-symbols-outlined mr-3">logout</span>
            Logout
          </a>
        </nav>
      </aside>

      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <header className="w-full h-16 sticky top-0 z-40 bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input className="pl-10 pr-4 py-1.5 bg-slate-100 dark:bg-slate-900 border-none outline-none rounded-full text-sm focus:ring-2 focus:ring-primary-container w-64 transition-all" placeholder="Search incidents..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-slate-500 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <ModeToggle />
            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <span className="font-manrope text-sm font-semibold text-[#1e3a5f] dark:text-blue-400">ResQNow Platform</span>
              <img alt="User profile" className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-800" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASAO_BgLlQ64X0F2QVcfVkgvaFjmNtXc-9HOkvkXKBndkFt2SKyyKJ2b85lj7r48RKveBWbbMZtv-I2AqnOpHNTLf1ltRs8T1_rFGsGO4BQT0mKlZW8P_z_icDbbDnNbN-8xwSJhQgRY-k0B7YS72f-BVRCUM5NqiJTmzQXo1ke9sjiOPmzJJ4GTv3CV_IQhxh45ngqMdxSsvaSCDn6twTWc10-gSk9Fx-xULoJxbjJQ3ar5hwORg_xb7TNzo93TEop4ZWNnEdRYvN" />
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto w-full space-y-24">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 hero-elem">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border-l-4 border-india-saffron text-primary dark:text-white text-xs font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-india-green animate-pulse"></span>
                Real-Time Intelligence
              </div>
              <h2 className="text-6xl font-extrabold tracking-tight text-primary dark:text-white leading-[1.1]">
                The Future of Emergency <span className="text-secondary">Response</span>.
              </h2>
              <p className="text-xl text-on-surface-variant leading-relaxed max-w-2xl text-slate-600 dark:text-slate-400">
                ResQNow isn't just a dashboard. It's a high-performance engine designed to move human action with surgical precision, turning data into life-saving seconds.
              </p>
              <div className="flex items-center gap-4 pt-4 hero-elem">
                <button className="px-8 py-4 bg-primary dark:bg-blue-700 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center gap-2 border-b-4 border-india-green">
                  Start Predicting
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="lg:col-span-5 relative hero-elem">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 bg-surface-container-highest dark:bg-slate-900">
                <img alt="Emergency services" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO8ai9ZmZvc1HRAlMqWpADJY97UrbRdCcxk71T9MFozQCzlNP3rSOCheC7lYxVM5-ZIPxVI3F3DwZwTkRkDg35RoMeMKtVaKtXb9bPTZSYwuxvrVquykp0QIcSX3pNMMS7OHQXmBjNCqGQeVtUmVOoozBHi52NRI1MpJRaQu_BYOBnx834SSQ9xdp91qo0QP0aBbduaD-nt_dC-jeAODtVZW8gzs6RudmSb3vAvQr4peCd0UOgG2b6AtH4kx8RpDwVe99CY9z6Inm-" />
              </div>
            </div>
          </section>

          <section className="space-y-12 scroll-section">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 scroll-elem">
              <div className="space-y-4 max-w-2xl">
                <h3 className="text-4xl font-bold text-primary dark:text-white">Our Mission</h3>
                <p className="text-on-surface-variant text-lg text-slate-600 dark:text-slate-400">We believe that the best way to handle an emergency is to prevent it from reaching a critical state. Our mission is to move from reactive rescue to proactive prevention.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-surface-container-lowest dark:bg-slate-900 shadow-sm border-b-4 border-india-saffron hover:shadow-md transition-shadow group scroll-elem">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/30 flex items-center justify-center text-india-saffron mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>shield_with_heart</span>
                </div>
                <h4 className="text-xl font-bold text-primary dark:text-white mb-3">Accident Prevention</h4>
                <p className="text-on-surface-variant leading-relaxed text-slate-600 dark:text-slate-400">Identifying high-risk zones before incidents occur using historical pattern recognition and environmental sensors.</p>
              </div>
              <div className="p-8 rounded-3xl bg-surface-container-lowest dark:bg-slate-900 shadow-sm border-b-4 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group scroll-elem">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>speed</span>
                </div>
                <h4 className="text-xl font-bold text-primary dark:text-white mb-3">Seconds Matter</h4>
                <p className="text-on-surface-variant leading-relaxed text-slate-600 dark:text-slate-400">Optimizing dispatch routes and unit allocation to cut down transit times by an average of 4 minutes per call.</p>
              </div>
              <div className="p-8 rounded-3xl bg-surface-container-lowest dark:bg-slate-900 shadow-sm border-b-4 border-india-green hover:shadow-md transition-shadow group scroll-elem">
                <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center text-india-green mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
                </div>
                <h4 className="text-xl font-bold text-primary dark:text-white mb-3">Unified Command</h4>
                <p className="text-on-surface-variant leading-relaxed text-slate-600 dark:text-slate-400">Breaking down silos between fire, police, and medical services for a truly integrated response ecosystem.</p>
              </div>
            </div>
          </section>

          {/* Footer Section */}
          <footer className="mt-20 py-12 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2 space-y-4">
                <h4 className="text-xl font-bold text-primary dark:text-white">
                  <img alt="ResQNow Logo" className="h-10 w-auto" src="/logo.png"/>
                </h4>
                <p className="text-sm text-on-surface-variant dark:text-slate-400 max-w-sm">The world's leading predictive intelligence platform for emergency services. Engineered for resilience, designed for action.</p>
              </div>
              <div>
                <h5 className="font-bold text-primary dark:text-white mb-4">Platform</h5>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><a className="hover:text-secondary transition-colors" href="#">Dashboard</a></li>
                  <li><a className="hover:text-secondary transition-colors" href="#">AI Prediction</a></li>
                  <li><a className="hover:text-secondary transition-colors" href="#">Fleet Mgmt</a></li>
                </ul>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
