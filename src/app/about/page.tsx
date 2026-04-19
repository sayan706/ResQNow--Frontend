'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Sidebar, TopBar } from '@/components/sidebar';
import Footer from '@/components/footer';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero stagger
    gsap.from('.hero-elem', {
      y: 50,
      opacity: 0,
      duration: 0.85,
      stagger: 0.18,
      ease: 'power3.out',
    });

    // Scroll-triggered sections
    const splitSections = gsap.utils.toArray('.scroll-section');
    splitSections.forEach((section: any) => {
      gsap.from(section.querySelectorAll('.scroll-elem'), {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.65,
        stagger: 0.14,
        ease: 'power2.out',
      });
    });
  }, { scope: container });

  return (
    <div ref={container} className="min-h-screen bg-surface dark:bg-slate-950">
      <Sidebar activePage="about" />

      <div className="md:ml-64 min-h-screen flex flex-col">
        <TopBar title="Mission Briefing" />

        <main className="flex-1">

          <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-20 page-enter">
            {/* Hero */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6 hero-elem">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border-l-4 border-india-saffron text-[#022448] dark:text-white text-xs font-bold tracking-widest uppercase">
                  <span className="w-2 h-2 rounded-full bg-india-green animate-pulse" />
                  Real-Time Intelligence
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#022448] dark:text-white leading-[1.1]">
                  The Future of Emergency{' '}
                  <span className="text-secondary">Response</span>.
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                  ResQNow isn't just a dashboard. It's a high-performance engine designed to move human action with surgical precision, turning data into life-saving seconds.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2 hero-elem">
                  <Link
                    href="/predict"
                    className="group px-8 py-4 bg-[#022448] dark:bg-blue-700 text-white rounded-xl font-bold text-base hover:shadow-xl hover:shadow-[#022448]/20 transition-all duration-300 flex items-center gap-2 border-b-4 border-b-india-green btn-ripple hover:-translate-y-0.5"
                  >
                    Start Predicting
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 relative hero-elem">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-2 group hover:rotate-0 transition-transform duration-500 bg-slate-200 dark:bg-slate-800">
                  <img
                    alt="Emergency services"
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO8ai9ZmZvc1HRAlMqWpADJY97UrbRdCcxk71T9MFozQCzlNP3rSOCheC7lYxVM5-ZIPxVI3F3DwZwTkRkDg35RoMeMKtVaKtXb9bPTZSYwuxvrVquykp0QIcSX3pNMMS7OHQXmBjNCqGQeVtUmVOoozBHi52NRI1MpJRaQu_BYOBnx834SSQ9xdp91qo0QP0aBbduaD-nt_dC-jeAODtVZW8gzs6RudmSb3vAvQr4peCd0UOgG2b6AtH4kx8RpDwVe99CY9z6Inm-"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 animate-float">
                  <span className="w-3 h-3 rounded-full bg-india-green animate-pulse" />
                  <div>
                    <p className="text-xs font-bold text-[#022448] dark:text-white">System Active</p>
                    <p className="text-[10px] text-slate-400">99.9% Uptime</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Mission Cards */}
            <section className="space-y-12 scroll-section">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 scroll-elem">
                <div className="space-y-3 max-w-2xl">
                  <div className="text-xs font-bold text-india-saffron uppercase tracking-widest">Our Purpose</div>
                  <h3 className="text-3xl md:text-4xl font-bold text-[#022448] dark:text-white">Our Mission</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                    We believe that the best way to handle an emergency is to prevent it from reaching a critical state. Moving from reactive rescue to proactive prevention.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {[
                  {
                    icon: 'shield_with_heart',
                    title: 'Accident Prevention',
                    desc: 'Identifying high-risk zones before incidents occur using historical pattern recognition and environmental sensors.',
                    accent: 'border-india-saffron',
                    bg: 'bg-orange-50 dark:bg-orange-950/20',
                    color: 'text-india-saffron',
                  },
                  {
                    icon: 'speed',
                    title: 'Seconds Matter',
                    desc: 'Optimizing dispatch routes and unit allocation to cut down transit times by an average of 4 minutes per call.',
                    accent: 'border-[#022448] dark:border-blue-700',
                    bg: 'bg-blue-50 dark:bg-blue-950/20',
                    color: 'text-[#022448] dark:text-blue-400',
                  },
                  {
                    icon: 'groups',
                    title: 'Unified Command',
                    desc: 'Breaking down silos between fire, police, and medical services for a truly integrated response ecosystem.',
                    accent: 'border-india-green',
                    bg: 'bg-green-50 dark:bg-green-950/20',
                    color: 'text-india-green',
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className={`scroll-elem hover-lift p-8 rounded-3xl bg-surface-container-lowest dark:bg-slate-900 border-b-4 ${card.accent} cursor-pointer group`}
                    style={{ boxShadow: '0 8px 24px rgba(2, 36, 72, 0.07)' }}
                  >
                    <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {card.icon}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-[#022448] dark:text-white mb-3">{card.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{card.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Stats Banner */}
            <section className="scroll-section rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #022448 0%, #0d3868 100%)' }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)' }} />
              <div className="p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
                {[
                  { value: '99.9%', label: 'Uptime SLA', icon: 'memory' },
                  { value: '1,402', label: 'Predictions Run', icon: 'insights' },
                  { value: '4 min', label: 'Avg Time Saved', icon: 'speed' },
                  { value: '24/7', label: 'Active Monitoring', icon: 'emergency_home' },
                ].map((stat) => (
                  <div key={stat.label} className="scroll-elem flex flex-col items-center gap-2 group">
                    <span className="material-symbols-outlined text-india-saffron text-2xl group-hover:scale-125 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {stat.icon}
                    </span>
                    <div className="text-3xl md:text-4xl font-extrabold font-headline text-white">{stat.value}</div>
                    <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
