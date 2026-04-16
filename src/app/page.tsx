'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ModeToggle } from '@/components/mode-toggle';

export default function Dashboard() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal animation
    const timeline = gsap.timeline();
    timeline.from('.stagger-reveal', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }, { scope: container });

  return (
    <div ref={container} className="bg-surface dark:bg-slate-950 text-on-surface dark:text-slate-200 min-h-screen flex selection:bg-primary-fixed-dim">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-100 dark:bg-slate-950 flex flex-col py-6 z-50 border-r border-slate-200 dark:border-slate-800">
        <div className="flex flex-col h-full py-6">
          <div className="px-6 mb-10">
            <div className="flex items-center gap-3">
              <img alt="ResQNow Logo" className="h-12 w-auto" src="/logo.png" />
            </div>
          </div>
          <nav className="flex-1 px-0 space-y-1">
            {/* Dashboard Active */}
            <li>
              <a className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 text-[#022448] dark:text-white border-l-4 border-india-saffron font-bold rounded-r-full transition-all duration-200 ease-in-out font-inter text-[0.875rem]" href="/">
                <span className="material-symbols-outlined text-india-saffron" data-icon="dashboard" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                Dashboard
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-6 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all duration-200 ease-in-out font-inter text-[0.875rem] font-medium" href="/predict">
                <span className="material-symbols-outlined" data-icon="psychology">psychology</span>
                AI Prediction
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-6 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all duration-200 ease-in-out font-inter text-[0.875rem] font-medium" href="/about">
                <span className="material-symbols-outlined" data-icon="info">info</span>
                About
              </a>
            </li>
          </nav>
          <div className="mt-auto px-6">
            <button className="w-full flex items-center gap-3 py-3 text-slate-600 dark:text-slate-400 hover:text-secondary transition-colors font-inter text-[0.875rem] font-medium">
              <span className="material-symbols-outlined" data-icon="logout">logout</span>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* TopAppBar */}
        <header className="w-full h-16 sticky top-0 z-40 bg-slate-50/85 dark:bg-slate-950/85 backdrop-blur-md flex items-center justify-between px-6 shadow-sm border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-headline font-bold tracking-tight text-[#022448] dark:text-white">Mission Control</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-india-green/10 rounded-full border border-india-green/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-india-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-india-green"></span>
              </span>
              <span className="text-[0.75rem] font-bold text-india-green uppercase tracking-wider">Live System</span>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors rounded-full">
                <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
              </button>
              <ModeToggle />
            </div>
            <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-india-saffron/30">
              <img alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2erCX_OGMCP0EllWlPQX3Mlng_yDeIv4j94TFSeKU8mcumDGHHsm66DCNpFtW9ACwMN6PUnXf4G42wB_MfY5C0nuE-G8Fv1wMIUXFLIXlIlrbqJ4DTXN2qq75Bp8I-rSQahE1ARw2rGUesGfhhx1OQWj3icmZmiaLM1vjE1b_wN2Iidw_FnHFW1oX7yoq3OS7BxgMAHPDx9egOMNk4JAXhZb1DjQQKcUgh7Eod_HZafV5OmAamhjwMnzSkGNgtDQoCTyeXFQIXLWX" />
            </div>
            <span className="font-headline text-sm font-semibold text-[#1e3a5f] dark:text-blue-400">Dispatcher 01</span>
          </div>
        </header>

        {/* Content Canvas */}
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
          {/* Quick Stats Row */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stagger-reveal bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-secondary hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 font-label uppercase tracking-tight mb-1">Active Emergencies</p>
                  <h3 className="text-4xl font-extrabold text-primary font-headline">24</h3>
                </div>
                <div className="p-3 bg-secondary/5 rounded-lg">
                  <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>emergency_home</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-error font-semibold">
                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                <span>+12% from last hour</span>
              </div>
            </div>
            
            <div className="stagger-reveal bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-india-saffron hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 font-label uppercase tracking-tight mb-1">Predictions Run</p>
                  <h3 className="text-4xl font-extrabold text-primary font-headline">1,402</h3>
                </div>
                <div className="p-3 bg-india-saffron/5 rounded-lg">
                  <span className="material-symbols-outlined text-india-saffron text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-india-green font-semibold">
                <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                <span>All models operational</span>
              </div>
            </div>
            
            <div className="stagger-reveal bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-india-green hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-slate-500 font-label uppercase tracking-tight mb-1">System Status</p>
                  <h3 className="text-4xl font-extrabold text-primary font-headline">99.9%</h3>
                </div>
                <div className="p-3 bg-india-green/5 rounded-lg">
                  <span className="material-symbols-outlined text-india-green text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>memory</span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs text-slate-500 font-semibold">
                <span className="material-symbols-outlined text-sm mr-1 text-primary">lan</span>
                <span>4 Nodes connected</span>
              </div>
            </div>
          </section>

          {/* Main Interaction Area (Bento Style) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* CSV Upload Card */}
            <section className="stagger-reveal lg:col-span-8 space-y-6">
              <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border-t-2 border-india-saffron/10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-primary tracking-tight">Data Ingestion</h2>
                    <p className="text-slate-500 text-sm mt-1">Upload tactical datasets for real-time risk modeling</p>
                  </div>
                  <span className="material-symbols-outlined text-india-saffron/40 text-4xl">upload_file</span>
                </div>
                <div className="cursor-pointer border-2 border-dashed border-outline-variant/40 rounded-2xl p-12 flex flex-col items-center justify-center bg-surface-container-low/30 hover:bg-india-saffron/5 hover:border-india-saffron/40 transition-all group">
                  <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-india-saffron/10 group-hover:scale-110 transition-all">
                    <span className="material-symbols-outlined text-primary group-hover:text-india-saffron text-3xl transition-colors" data-icon="cloud_upload">cloud_upload</span>
                  </div>
                  <p className="text-lg font-semibold text-primary font-headline group-hover:text-india-saffron transition-colors">Drag &amp; Drop CSV Dataset</p>
                  <p className="text-slate-400 text-sm mt-1">or browse files on your computer</p>
                  <div className="mt-8 flex gap-3">
                    <button className="bg-primary text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg hover:shadow-primary/20 hover:bg-india-saffron transition-all active:opacity-80">
                      Upload CSV
                    </button>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-outline-variant/10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Uploads</h4>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-india-green"></div>
                      <span className="text-[0.65rem] text-slate-400 font-bold uppercase">System Healthy</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border-l-4 border-india-green">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl">description</span>
                        <span className="text-sm font-medium text-slate-700">emergency_dispatch_log_v2.csv</span>
                      </div>
                      <span className="text-xs font-bold text-india-green bg-india-green/10 px-2 py-1 rounded">Processed Successfully</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Instructions Panel */}
            <section className="stagger-reveal lg:col-span-4 flex flex-col space-y-6">
              <div className="bg-primary text-white rounded-xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-1 bg-india-saffron opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-1 bg-india-green opacity-50"></div>
                <div className="absolute -right-10 -bottom-10 opacity-10">
                  <span className="material-symbols-outlined text-[10rem]">help</span>
                </div>
                <h2 className="text-xl font-bold font-headline mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-india-saffron">verified_user</span>
                  Instructions
                </h2>
                <div className="space-y-4 relative z-10">
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/5 hover:border-india-saffron/30 transition-colors">
                    <button className="flex items-center justify-between w-full text-left font-bold text-sm">
                      <span>File Specifications</span>
                      <span className="material-symbols-outlined text-sm">expand_less</span>
                    </button>
                    <div className="mt-3 text-sm text-slate-300 space-y-2 font-inter leading-relaxed">
                      <p>Files must be in <strong className="text-india-saffron">UTF-8 CSV</strong> format. Maximum file size is 50MB per ingestion cycle.</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/5">
                    <button className="flex items-center justify-between w-full text-left font-bold text-sm">
                      <span>Required Columns</span>
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                    </button>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/5">
                    <button className="flex items-center justify-between w-full text-left font-bold text-sm">
                      <span>Spatial Reference</span>
                      <span className="material-symbols-outlined text-sm">expand_more</span>
                    </button>
                  </div>
                </div>
                <div className="mt-8 relative z-10">
                  <a className="inline-flex items-center text-india-saffron font-bold text-sm hover:text-white transition-colors" href="#">
                    Download Template CSV
                    <span className="material-symbols-outlined text-sm ml-1">download</span>
                  </a>
                </div>
              </div>
              
              {/* Secondary Visual Card */}
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex-1 min-h-[200px] relative group border-b-4 border-india-green/30">
                <img alt="Geospatial Map" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARo4WRsTCtCgOjNbLRX6F7vsuQyWQ00DphYxJUGw89bSkw-hb-pXD8mVsz679KIc7_KDw_yZWtET75Jc_WM5n_7EPTgoUD0WGTY8tzN3e9zpFuhHnzEbD9P5flk8ASFpA2fsww96f2fSLNWilamKNaZaroFQkFZy5iRuhTHL5f8tXL_wzVMMNyT4GSvGI3Kcyca6PZeRnAahm4P9FmYNorM_51VYZccJemWs_wipVcAYqmwQuFFbg7CCy-9iYm_eXiI6y7Oo-nW6Rt" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex flex-col justify-end p-6 pointer-events-none">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-india-saffron"></span>
                    <h3 className="text-white font-bold text-lg">Predictive Coverage</h3>
                  </div>
                  <p className="text-white/70 text-xs">Current analysis based on the last 24 hours of uploaded telemetry.</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
