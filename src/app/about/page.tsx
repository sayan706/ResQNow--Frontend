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
        <TopBar title="System Intelligence" />

        <main className="flex-1">

          <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full space-y-20 page-enter">
            {/* Hero */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6 hero-elem">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border-l-4 border-india-saffron text-[#022448] dark:text-white text-xs font-bold tracking-widest uppercase">
                  <span className="w-2 h-2 rounded-full bg-india-green animate-pulse" />
                  Strategic Dispatch Command
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#022448] dark:text-white leading-[1.1]">
                  Command the Golden Hour. Save Lives with{' '}
                  <span className="text-secondary">Precision</span>.
                </h2>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                  ResQNow empowers Traffic Officials with actionable, real-time intelligence. By dynamically mapping risk zones and optimizing ambulance placement via AI, you can guarantee emergency response within the critical 15-minute window—turning data into life-saving action.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2 hero-elem">
                  <Link
                    href="/predict"
                    className="group px-8 py-4 bg-[#022448] dark:bg-blue-700 text-white rounded-xl font-bold text-base hover:shadow-xl hover:shadow-[#022448]/20 transition-all duration-300 flex items-center gap-2 border-b-4 border-b-india-green btn-ripple hover:-translate-y-0.5"
                  >
                    Try Prediction Model
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform duration-200">arrow_forward</span>
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-5 relative hero-elem">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-2 group hover:rotate-0 transition-transform duration-500 bg-slate-200 dark:bg-slate-800">
                  <img
                    alt="Rural Ambulance Map"
                    className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                    src="/rural_ambulance_map.png"
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3 animate-float">
                  <span className="w-3 h-3 rounded-full bg-india-green animate-pulse" />
                  <div>
                    <p className="text-xs font-bold text-[#022448] dark:text-white">Target Time</p>
                    <p className="text-[10px] text-slate-400">&lt; 15 Minutes</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Implementation Cards */}
            <section className="space-y-12 scroll-section">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 scroll-elem">
                <div className="space-y-3 max-w-2xl">
                  <div className="text-xs font-bold text-india-saffron uppercase tracking-widest">System Architecture</div>
                  <h3 className="text-3xl md:text-4xl font-bold text-[#022448] dark:text-white">Implementation Methodology</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">
                    ResQNow processes historical accident data to dynamically allocate resources and predicts real-time responses, acting as a senior Traffic In-charge.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {[
                  {
                    icon: 'map',
                    title: '1. Dynamic Zoning & Placement',
                    desc: 'Traffic In-charge uploads past incident CSV data. The backend dynamically creates risk zones using DBSCAN (after auto-tuning) and places ambulances strategically using LSCP to cover all zones under 15 minutes.',
                    accent: 'border-india-saffron',
                    bg: 'bg-orange-50 dark:bg-orange-950/20',
                    color: 'text-india-saffron',
                  },
                  {
                    icon: 'query_stats',
                    title: '2. Real-Time Prediction',
                    desc: 'Select a zone from the map and answer 16 situational questions. Gemini AI predicts if an ambulance is available. If not, it calculates and shows a new placement to cover the zone within 15 mins.',
                    accent: 'border-[#022448] dark:border-blue-700',
                    bg: 'bg-blue-50 dark:bg-blue-950/20',
                    color: 'text-[#022448] dark:text-blue-400',
                  },
                  {
                    icon: 'support_agent',
                    title: '3. AI Command Center',
                    desc: 'Acting as a senior Traffic In-charge, the AI provides strategic recommendations on the map interface. It guides users on what actions to take based on real-time spatial and situational predictions.',
                    accent: 'border-india-green',
                    bg: 'bg-green-50 dark:bg-green-950/20',
                    color: 'text-india-green',
                  },
                ].map((card) => (
                  <div
                    key={card.title}
                    className={`scroll-elem hover-lift p-8 rounded-3xl bg-surface-container-lowest dark:bg-slate-900 border-b-4 ${card.accent} cursor-pointer group flex flex-col h-full`}
                    style={{ boxShadow: '0 8px 24px rgba(2, 36, 72, 0.07)' }}
                  >
                    <div className={`w-14 h-14 rounded-2xl ${card.bg} flex items-center justify-center ${card.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {card.icon}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-[#022448] dark:text-white mb-3">{card.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm flex-1">{card.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Core Tech Stack */}
            <section className="scroll-section rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #022448 0%, #0d3868 100%)' }}>
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%)' }} />
              <div className="p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
                {[
                  { value: 'Python', label: 'Core Language', icon: 'terminal' },
                  { value: 'DBSCAN', label: 'Clustering Algorithm', icon: 'scatter_plot' },
                  { value: 'LSCP', label: 'Placement Optimization', icon: 'location_on' },
                  { value: 'Gemini', label: 'AI Prediction Model', icon: 'psychology' },
                ].map((stat) => (
                  <div key={stat.label} className="scroll-elem flex flex-col items-center gap-2 group">
                    <span className="material-symbols-outlined text-india-saffron text-2xl group-hover:scale-125 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {stat.icon}
                    </span>
                    <div className="text-2xl md:text-3xl font-extrabold font-headline text-white">{stat.value}</div>
                    <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* In-Depth Reasoning Sections */}
            <section className="space-y-12 scroll-section pb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* 15 Minutes Justification */}
                <div className="space-y-6 scroll-elem">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold tracking-widest uppercase">
                    <span className="material-symbols-outlined text-sm">timer</span>
                    The Golden Hour
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#022448] dark:text-white">Why 15 Minutes?</h3>
                  <div className="prose dark:prose-invert prose-slate text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    <p>
                      According to peer-reviewed research published in the <strong>IEEE Transactions on Intelligent Transportation Systems</strong> and <strong>IEEE Access</strong>, trauma intervention must occur within 60 minutes.
                    </p>
                    <p>
                      Due to the long transit times back to medical facilities in remote regions, IEEE literature (Abdeen et al., 2022; Lim, 2011) establishes that an ambulance <strong>must arrive at a rural accident site within 14 to 19 minutes</strong> to ensure the patient's survival.
                    </p>
                    <p>
                      To achieve these strict rural timeframes, modern Smart Ambulance systems propose using Deep Learning and AI-based dispatch algorithms to optimize routes and bypass traffic delays.
                    </p>
                  </div>
                </div>

                {/* DBSCAN Justification */}
                <div className="space-y-6 scroll-elem">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase">
                    <span className="material-symbols-outlined text-sm">hub</span>
                    Algorithm Choice
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#022448] dark:text-white">Why DBSCAN?</h3>
                  <div className="prose dark:prose-invert prose-slate text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    <p>
                      For real-life geographical data, <strong>DBSCAN</strong> clusters significantly better than K-Means. K-Means requires predefined clusters, which can lead to critical misclassifications.
                    </p>
                    <p>
                      For instance, if there are 10 severe cases and 5 moderate cases, predefining clusters as Red, Orange, and Green in K-Means could falsely label areas as "Green" (safe) when they are not. DBSCAN organically identifies dense risk zones without arbitrary constraints.
                    </p>
                    <p>
                      Our implementation includes an <strong>auto-tuning loop</strong> that ensures optimal clustering parameters are found before the final mapping executes.
                    </p>
                  </div>
                </div>
              </div>

              {/* 16 Questions Justification */}
              <div className="mt-16 scroll-elem bg-slate-50 dark:bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-widest uppercase mb-6">
                  <span className="material-symbols-outlined text-sm">fact_check</span>
                  Prediction Model Inputs
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#022448] dark:text-white mb-6">The 16 Situational Questions</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 max-w-3xl">
                  Based on a review of recent IEEE journal and conference papers on traffic accident prediction (using ML, DL, and XAI), researchers consistently group critical input variables. Our model collects the following inputs to predict risk and real-time availability:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                    <h4 className="font-bold text-[#022448] dark:text-white mb-3 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-india-saffron text-[18px]">schedule</span>
                      1. Temporal Features
                    </h4>
                    <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                      <li>Time of Day (Rush hour, Late night)</li>
                      <li>Day of the Week</li>
                      <li>Month / Season</li>
                      <li>Lighting Conditions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#022448] dark:text-white mb-3 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-india-saffron text-[18px]">cloud</span>
                      2. Environmental
                    </h4>
                    <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                      <li>Weather (Rain, Snow, Fog)</li>
                      <li>Visibility Distance</li>
                      <li>Temperature & Humidity</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#022448] dark:text-white mb-3 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-india-saffron text-[18px]">edit_road</span>
                      3. Road Characteristics
                    </h4>
                    <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                      <li>Road Type (Highway, Rural)</li>
                      <li>Speed Limit</li>
                      <li>Surface Condition (Wet, Icy)</li>
                      <li>Traffic Controls</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#022448] dark:text-white mb-3 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-india-saffron text-[18px]">directions_car</span>
                      4. Traffic Flow
                    </h4>
                    <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                      <li>Traffic Volume</li>
                      <li>Vehicle Speed vs Limit</li>
                      <li>Distance to Obstacles</li>
                    </ul>
                  </div>
                  <div className="lg:col-span-2">
                    <h4 className="font-bold text-[#022448] dark:text-white mb-3 text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-india-saffron text-[18px]">person</span>
                      5. Vehicle & Driver Profile
                    </h4>
                    <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                      <li>Driver Age Group</li>
                      <li>Vehicle Type (Sedan, Heavy Truck)</li>
                      <li>Engine Capacity & Vehicle Age</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
