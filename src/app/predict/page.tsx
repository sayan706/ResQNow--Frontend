'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sidebar, TopBar } from '@/components/sidebar';

export default function PredictFactorForm() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.form-section', {
      y: 40,
      opacity: 0,
      duration: 0.65,
      stagger: 0.12,
      ease: 'power3.out',
    });
  }, { scope: container });

  return (
    <div ref={container} className="bg-surface dark:bg-slate-950 font-body text-on-surface dark:text-slate-200 min-h-screen">
      <Sidebar activePage="predict" />

      {/* Main Content */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <TopBar>
          {/* Step indicator overrides title slot */}
          <nav className="flex items-center gap-4 ml-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-india-green text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <span className="text-slate-400 dark:text-slate-500 text-sm font-semibold hidden sm:inline">Step 1: Location</span>
            </div>
            <div className="w-8 h-[2px] bg-slate-200 dark:bg-slate-700 rounded" />
            <span className="text-[#022448] dark:text-white border-b-2 border-india-saffron text-sm font-bold pb-0.5">
              Step 2: Factors
            </span>
          </nav>
        </TopBar>

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full page-enter">
          {/* Header */}
          <div className="mb-8 form-section">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(183,19,26,0.6)]" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Advanced Neural Analysis</h2>
            </div>
            <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-[#022448] dark:text-white tracking-tight">
              Factor Calibration
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl text-sm md:text-base">
              Refine environmental and contextual parameters to increase prediction accuracy for the selected zone.
            </p>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Zone & Location */}
              <section className="form-section bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-india-saffron hover-lift transition-shadow"
                style={{ boxShadow: '0 8px 24px rgba(2,36,72,0.07)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-india-saffron/10 rounded-lg">
                    <span className="material-symbols-outlined text-india-saffron">location_on</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-[#022448] dark:text-white">Zone &amp; Location</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.7rem] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Latitude</label>
                    <input
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none rounded-xl text-slate-500 dark:text-slate-400 font-mono text-sm px-4 py-3 cursor-not-allowed"
                      readOnly type="text" value="34.0522"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Longitude</label>
                    <input
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 outline-none rounded-xl text-slate-500 dark:text-slate-400 font-mono text-sm px-4 py-3 cursor-not-allowed"
                      readOnly type="text" value="-118.2437"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[0.7rem] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                      Designated Response Zone
                    </label>
                    <div className="w-full bg-[#022448]/5 dark:bg-white/5 rounded-xl border border-[#022448]/10 dark:border-white/10 px-4 py-3 flex items-center justify-between">
                      <span className="font-bold text-[#022448] dark:text-white text-sm">Zone Alpha-09 (Downtown Hub)</span>
                      <span className="material-symbols-outlined text-india-green text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Temporal Factors */}
              <section className="form-section bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-india-saffron hover-lift transition-shadow"
                style={{ boxShadow: '0 8px 24px rgba(2,36,72,0.07)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-india-saffron/10 rounded-lg">
                    <span className="material-symbols-outlined text-india-saffron">schedule</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-[#022448] dark:text-white">Temporal Factors</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-[0.7rem] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Prediction Hour (0–23)</label>
                      <span className="bg-[#022448] dark:bg-blue-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg">14:00</span>
                    </div>
                    <input
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-india-saffron"
                      max="23" min="0" type="range" defaultValue="14"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>00:00</span><span>12:00</span><span>23:00</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[0.7rem] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Day of Week</label>
                    <select className="w-full border border-slate-100 dark:border-slate-700 outline-none bg-slate-50 dark:bg-slate-800 rounded-xl text-[#022448] dark:text-white font-semibold px-4 py-3 focus:ring-2 focus:ring-india-saffron/30 appearance-none text-sm transition-all">
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option selected>Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Environmental Conditions — full width */}
              <section className="form-section bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-2xl border-l-4 border-primary md:col-span-2 hover-lift transition-shadow"
                style={{ boxShadow: '0 8px 24px rgba(2,36,72,0.07)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-india-saffron/10 rounded-lg">
                    <span className="material-symbols-outlined text-india-saffron">thermostat</span>
                  </div>
                  <h3 className="font-headline font-bold text-lg text-[#022448] dark:text-white">Environmental Conditions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    { label: 'Weather', options: ['Clear Sky', 'Partly Cloudy', 'Heavy Rain', 'Fog / Mist'] },
                    { label: 'Lighting', options: ['Daylight', 'Dawn / Dusk', 'Dark (Lit)'] },
                    { label: 'Road Surface', options: ['Dry', 'Wet / Slippery'] },
                    { label: 'Traffic Density', options: ['Low (Free Flow)', 'Moderate (Active)', 'High (Congested)'] },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-[0.7rem] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                        {field.label}
                      </label>
                      <select className="w-full border border-slate-100 dark:border-slate-700 outline-none bg-slate-50 dark:bg-slate-800 rounded-xl text-[#022448] dark:text-white font-semibold px-4 py-3 focus:ring-2 focus:ring-india-saffron/30 appearance-none text-sm transition-all">
                        {field.options.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Bottom Action Bar */}
            <div className="form-section flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-surface-container-lowest dark:bg-slate-900 p-6 md:p-8 rounded-2xl border-l-[6px] border-l-india-saffron"
              style={{ boxShadow: '0 8px 24px rgba(2,36,72,0.07)' }}>
              <div className="flex flex-col gap-1">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Ready to Process
                </span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-india-green text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    security
                  </span>
                  <span className="font-bold text-[#022448] dark:text-white text-sm">All parameters validated for Step 2</span>
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  className="flex-1 sm:flex-none px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 text-sm"
                  type="button"
                >
                  Back
                </button>
                <button
                  className="flex-1 sm:flex-none group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#022448] dark:bg-blue-700 text-white font-headline font-bold rounded-xl overflow-hidden shadow-lg hover:shadow-india-saffron/30 transition-all duration-300 active:scale-[0.97] btn-ripple text-sm"
                  type="submit"
                >
                  <span className="relative z-10">Run AI Prediction</span>
                  <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform duration-200">bolt</span>
                  <span className="absolute inset-0 bg-india-saffron opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
