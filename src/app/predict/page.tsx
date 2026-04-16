'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ModeToggle } from '@/components/mode-toggle';

export default function PredictFactorForm() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from('.form-section', {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: container });

  return (
    <div ref={container} className="bg-surface dark:bg-slate-950 font-body text-on-background dark:text-slate-200 min-h-screen flex">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-100 dark:bg-slate-950 flex flex-col py-6 z-50 border-r border-slate-200/50 dark:border-slate-800">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200">
              <img alt="ResQNow Logo" className="w-full h-full object-contain" src="/logo.png" />
            </div>
            <div>
              <h1 className="font-manrope font-bold text-[#1e3a5f] text-lg leading-tight">ResQNow</h1>
              <p className="text-[0.7rem] uppercase tracking-wider text-slate-500 font-semibold">Command Center</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-0">
          <ul className="space-y-1">
            <li>
              <a className="flex items-center gap-3 px-6 py-3 text-slate-600 dark:text-slate-400 font-inter text-[0.875rem] font-medium hover:bg-slate-200 transition-all duration-200" href="/">
                <span className="material-symbols-outlined">dashboard</span>
                Dashboard
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 text-[#022448] dark:text-white font-bold border-r-4 border-india-saffron rounded-l-none font-inter text-[0.875rem] transition-all duration-200 shadow-sm" href="/predict">
                <span className="material-symbols-outlined text-india-saffron" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                AI Prediction
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-6 py-3 text-slate-600 dark:text-slate-400 font-inter text-[0.875rem] font-medium hover:bg-slate-200 transition-all duration-200" href="/about">
                <span className="material-symbols-outlined">info</span>
                About
              </a>
            </li>
          </ul>
        </nav>
        <div className="px-6 mt-auto">
          <a className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 font-inter text-[0.875rem] font- medium hover:bg-slate-200 rounded-xl transition-all duration-200" href="/login">
            <span className="material-symbols-outlined">logout</span>
            Logout
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        {/* TopAppBar */}
        <header className="w-full h-16 sticky top-0 z-40 bg-slate-50/85 backdrop-blur-md dark:bg-slate-900/85 shadow-sm flex items-center justify-between px-8 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-india-green text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="text-slate-500 dark:text-slate-400 font-manrope text-sm font-semibold">Step 1: Location</span>
              </div>
              <div className="w-8 h-[2px] bg-slate-200 dark:bg-slate-800"></div>
              <span className="text-[#022448] dark:text-blue-400 border-b-2 border-india-saffron font-manrope text-sm font-bold pb-1">Step 2: Factor Input</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-india-saffron/20">
              <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVKdV0xp8843C9YyHSs6IwizO4LyMmOZNrwriH5iHt87AhJE1xjWw8sqMPMuWNK1i7Gtsed3VfFS9nGlH9QWWJHMoSE7LBG9ayDoZde8aljYm9qMTHUkhndJchiyP0wmausN-CKJXdBb6us7mC4DxlMUG-rpx25IgZKinCyre0_Fl3MnHjyGg-cANRvXsnE7xWiq7A1hVVS78UOv4GXPwreoBcDR-IdTuvXUMuFmsT3Yr1eK12BkIMhVQrhWNSxX-EeDjoyk_ech89" />
            </div>
          </div>
        </header>

        <main className="p-8 max-w-6xl mx-auto w-full">
          <div className="mb-10 form-section">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(183,19,26,0.6)]"></span>
              <h2 className="text-xs font-bold uppercase tracking-widest text-secondary">Advanced Neural Analysis</h2>
            </div>
            <h1 className="text-4xl font-headline font-extrabold text-primary dark:text-white tracking-tight">Factor Calibration</h1>
            <p className="text-on-surface-variant dark:text-slate-400 mt-2 max-w-2xl">Refine the environmental and contextual parameters to increase prediction accuracy for the selected zone.</p>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Section 1: Zone & Location */}
              <section className="form-section bg-surface-container-lowest dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-india-saffron">location_on</span>
                  <h3 className="font-headline font-bold text-lg text-primary dark:text-white">Zone &amp; Location</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[0.75rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Latitude</label>
                    <input className="w-full bg-surface-container-low dark:bg-slate-800 border-none outline-none rounded-lg text-slate-600 dark:text-slate-300 font-medium px-4 py-3 focus:ring-0 cursor-not-allowed" readOnly type="text" value="34.0522" />
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Longitude</label>
                    <input className="w-full bg-surface-container-low dark:bg-slate-800 border-none outline-none rounded-lg text-slate-600 dark:text-slate-300 font-medium px-4 py-3 focus:ring-0 cursor-not-allowed" readOnly type="text" value="-118.2437" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[0.75rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Designated Response Zone</label>
                    <div className="w-full bg-primary-container/5 rounded-lg border border-primary/10 px-4 py-3 flex items-center justify-between">
                      <span className="font-bold text-primary">Zone Alpha-09 (Downtown Hub)</span>
                      <span className="material-symbols-outlined text-india-green text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2: Time Settings */}
              <section className="form-section bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-india-saffron">schedule</span>
                  <h3 className="font-headline font-bold text-lg text-primary">Temporal Factors</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-[0.75rem] font-bold text-slate-500 uppercase tracking-wider">Prediction Hour (0-23)</label>
                      <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">14:00</span>
                    </div>
                    <input className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-india-saffron" max="23" min="0" type="range" defaultValue="14" />
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Day of Week</label>
                    <select className="w-full border-none outline-none bg-surface-container-low rounded-lg text-primary font-semibold px-4 py-3 focus:ring-2 focus:ring-india-saffron/20 appearance-none">
                      <option>Monday</option>
                      <option>Tuesday</option>
                      <option defaultValue="Wednesday">Wednesday</option>
                      <option>Thursday</option>
                      <option>Friday</option>
                      <option>Saturday</option>
                      <option>Sunday</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Section 3: Environment */}
              <section className="form-section bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-india-saffron">thermostat</span>
                  <h3 className="font-headline font-bold text-lg text-primary">Environmental Conditions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-[0.75rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Weather</label>
                    <select className="w-full border-none outline-none bg-surface-container-low rounded-lg text-primary font-semibold px-4 py-3 focus:ring-2 focus:ring-india-saffron/20">
                      <option defaultValue="Clear Sky">Clear Sky</option>
                      <option>Partly Cloudy</option>
                      <option>Heavy Rain</option>
                      <option>Fog / Mist</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Lighting</label>
                    <select className="w-full border-none outline-none bg-surface-container-low rounded-lg text-primary font-semibold px-4 py-3 focus:ring-2 focus:ring-india-saffron/20">
                      <option defaultValue="Daylight">Daylight</option>
                      <option>Dawn / Dusk</option>
                      <option>Dark (Lit)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Road Surface</label>
                    <select className="w-full border-none outline-none bg-surface-container-low rounded-lg text-primary font-semibold px-4 py-3 focus:ring-2 focus:ring-india-saffron/20">
                      <option defaultValue="Dry">Dry</option>
                      <option>Wet / Slippery</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.75rem] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Traffic Density</label>
                    <select className="w-full border-none outline-none bg-surface-container-low rounded-lg text-primary font-semibold px-4 py-3 focus:ring-2 focus:ring-india-saffron/20">
                      <option>Low (Free Flow)</option>
                      <option defaultValue="Moderate (Active)">Moderate (Active)</option>
                      <option>High (Congested)</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
            
            {/* Bottom Action */}
            <div className="form-section mt-12 flex items-center justify-between bg-surface-container-high p-8 rounded-2xl border-l-8 border-india-saffron shadow-md">
              <div className="flex flex-col">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">Ready to Process</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xs text-india-green" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                  <span className="font-bold text-primary">All parameters validated for Step 2</span>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="px-8 py-4 bg-transparent text-primary font-bold hover:bg-slate-200/50 rounded-xl transition-all" type="button">
                  Back
                </button>
                <button className="group relative inline-flex items-center gap-3 px-10 py-4 bg-primary text-white font-manrope font-bold rounded-xl overflow-hidden shadow-lg hover:shadow-india-saffron/30 transition-all active:scale-[0.98]" type="submit">
                  <span className="relative z-10">Run AI Prediction</span>
                  <span className="material-symbols-outlined relative z-10 group-hover:translate-x-1 transition-transform">bolt</span>
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
