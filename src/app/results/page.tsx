'use client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ModeToggle } from '@/components/mode-toggle';

export default function ResultsMap() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Map overlays slide in
    gsap.from('.map-overlay-anim', {
      x: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.2
    });
    
    gsap.from('.bottom-timeline', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.5
    });
  }, { scope: container });

  return (
    <div ref={container} className="bg-surface dark:bg-slate-950 font-body text-on-surface dark:text-slate-200 selection:bg-primary-fixed-dim">
      <aside className="h-screen w-64 fixed left-0 top-0 bg-slate-100 dark:bg-slate-950 flex flex-col py-6 z-50 border-r border-slate-200 dark:border-slate-800">
        <div className="px-6 mb-10">
          <div className="flex items-center gap-3">
            <img alt="ResQNow Logo" className="w-10 h-10 object-contain" src="/logo.png" />
            <div>
              <h1 className="font-headline font-bold text-[#1e3a5f] dark:text-white text-lg leading-tight">ResQNow</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Command Center</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-0 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <a className="flex items-center gap-3 px-6 py-3 text-slate-600 hover:bg-slate-200 transition-all duration-200 ease-in-out font-inter text-[0.875rem] font-medium" href="/">
                <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                Dashboard
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 text-[#022448] dark:text-white border-l-4 border-india-saffron font-bold rounded-r-full transition-all duration-200 ease-in-out font-inter text-[0.875rem]" href="/predict">
                <span className="material-symbols-outlined text-india-saffron" data-icon="psychology" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
                AI Prediction
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-6 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all duration-200 ease-in-out font-inter text-[0.875rem] font-medium" href="/about">
                <span className="material-symbols-outlined" data-icon="info">info</span>
                About
              </a>
            </li>
          </ul>
        </nav>
        <div className="mt-auto px-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-white/50 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Made in India</span>
          </div>
          <button className="w-full flex items-center gap-3 py-3 text-slate-600 hover:text-secondary transition-colors font-inter text-[0.875rem] font-medium">
            <span className="material-symbols-outlined" data-icon="logout">logout</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-64 flex flex-col min-h-screen">
        <header className="w-full h-16 sticky top-0 z-40 bg-slate-50/85 dark:bg-slate-900/85 backdrop-blur-md flex items-center justify-between px-6 shadow-sm border-b border-india-saffron/10 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-headline font-bold tracking-tight text-[#022448] dark:text-white">AI Prediction: Step 4</h2>
            <div className="h-1 w-24 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div className="h-full w-1/3 bg-india-saffron"></div>
              <div className="h-full w-1/3 bg-white"></div>
              <div className="h-full w-1/3 bg-india-green"></div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500">
                <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
              </button>
              <ModeToggle />
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-3">
              <img alt="User profile" className="w-8 h-8 rounded-full object-cover border-2 border-india-saffron/20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUlnHiagsyWEqcweLOP3SJZ_VidBrHS4kp3vIPAcsPfP1iYmOPyaFRcSUCWSiKRO4zP5xU6oUYvQxy_lJ5bQm7hPFFyUQLwKOn0NpGDSrWcJDejzR0RawBs1ePkMTQdvSqAOGHjMGB4cbJOcVfOF3f61NkQf0wnNyi3gFmbuuFRodhYnoQb3oX2ukrDvvvC1tBx4jJWEx18i2pYJEaWRdtLodtlNcNSw4EgNkcXNsWXu-klns6wi-mgJaW4Swf58_6fi_r51_576MI" />
              <span className="font-headline text-sm font-semibold text-[#1e3a5f] dark:text-blue-400">Chief Ops</span>
            </div>
          </div>
        </header>

        <div className="flex-1 relative overflow-hidden bg-slate-200 dark:bg-slate-900">
          <div className="absolute inset-0 z-0">
            <img alt="City map satellite view" className="w-full h-full object-cover grayscale opacity-40" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa-yVOjfWsjjyx4AIjLKwgZaiZsdbkfVOPTj-0bl8MhWO2EAmFWRbHTVCIyJcLyTPpxx-EFbxOj-uKUvCoxojjNM7y4uNcTgkw9wYNxZaH9H7A-nSZD-ETLFO2Ea4lR3Qsk7twmpCmYpyjMjyJtx83NtLuo6FP7giK1p9ExPxvpre9lCLvr7pDDPYNWqh-eYOtC4hlffMITLE82P2iwIr0dgHIlELR_0Fngoo193o6G95hPXIznPLRCUv1EKHS_gRXjoBw0KOv16gz" />
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <path d="M400,200 Q550,150 600,300 T450,450 Q300,400 350,250 Z" fill="#db322f" fillOpacity="0.25" stroke="#db322f" strokeWidth="2"></path>
              <path d="M100,400 Q200,350 300,500 T150,650 Q50,600 100,450 Z" fill="#ffddb2" fillOpacity="0.4" stroke="#ffb4ac" strokeWidth="2"></path>
              <circle cx="700" cy="500" fill="#1e3a5f" fillOpacity="0.15" r="180" stroke="#1e3a5f" strokeDasharray="8 4" strokeWidth="1"></circle>
              <path className="animate-pulse" d="M700,500 L480,320" stroke="#022448" strokeDasharray="10 5" strokeLinecap="round" strokeWidth="4"></path>
            </svg>

            <div className="absolute top-[490px] left-[690px] group">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-full animate-ping"></div>
                <div className="relative w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg border-2 border-white">
                  <span className="material-symbols-outlined text-sm" data-icon="ambulance" style={{ fontVariationSettings: "'FILL' 1" }}>ambulance</span>
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface-container-highest px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm border-b-2 border-india-green">
                  UNIT-04 (DISPATCHED)
                </div>
              </div>
            </div>

            <div className="absolute top-[310px] left-[470px]">
              <div className="flex flex-col items-center">
                <span className="material-symbols-outlined text-secondary text-4xl" data-icon="location_on" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse mt-[-8px]"></div>
              </div>
            </div>
          </div>

          <div className="absolute top-6 left-6 z-10 flex flex-col gap-2 map-overlay-anim">
            <div className="bg-surface-container-lowest p-1 rounded-xl shadow-md flex flex-col">
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><span className="material-symbols-outlined" data-icon="add">add</span></button>
              <div className="h-px bg-slate-100 w-full"></div>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><span className="material-symbols-outlined" data-icon="remove">remove</span></button>
            </div>
            <button className="bg-surface-container-lowest p-3 rounded-xl shadow-md text-slate-600 hover:text-primary">
              <span className="material-symbols-outlined" data-icon="my_location">my_location</span>
            </button>
          </div>

          <div className="absolute top-6 right-6 z-10 w-80 map-overlay-anim">
            <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-xl shadow-lg p-6 flex flex-col gap-6 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-primary dark:text-white">Prediction Summary</h3>
                <span className="flex items-center gap-1 text-[10px] font-bold text-secondary-container bg-secondary-fixed dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></span> LIVE
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border-l-4 border-india-saffron">
                  <span className="text-xs font-medium text-slate-500">Confidence Score</span>
                  <span className="text-sm font-bold text-primary">94.2%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border-l-4 border-india-green">
                  <span className="text-xs font-medium text-slate-500">Estimated Arrival</span>
                  <span className="text-sm font-bold text-primary">4.2 min</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Map Legend</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span className="text-xs text-on-surface-variant font-medium">High Risk (Immediate Response)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#ffddb2]"></div>
                    <span className="text-xs text-on-surface-variant font-medium">Medium Risk (Elevated Alert)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary-container/20 border border-primary-container"></div>
                    <span className="text-xs text-on-surface-variant font-medium">15-Min Coverage Radius</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <button className="w-full bg-primary text-white py-3 rounded-lg font-bold text-sm shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 border-b-2 border-india-saffron">
                  <span className="material-symbols-outlined text-sm" data-icon="save">save</span>
                  Save Prediction
                </button>
                <button className="w-full bg-surface-container-high text-primary py-3 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 border-b-2 border-india-green">
                  <span className="material-symbols-outlined text-sm" data-icon="download">download</span>
                  Download Report
                </button>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[600px] bottom-timeline">
            <div className="bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl shadow-lg p-4 border border-white/50">
              <div className="flex items-center justify-between mb-4 px-2">
                <span className="text-xs font-bold text-primary">Predictive Timeline</span>
                <span className="text-xs font-medium text-slate-500">Next 120 Minutes</span>
              </div>
              <div className="relative h-10 flex items-center gap-1">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div className="h-full w-[20%] bg-india-green"></div>
                  <div className="h-full w-[30%] bg-india-saffron"></div>
                  <div className="h-full w-[15%] bg-secondary"></div>
                  <div className="h-full w-[35%] bg-india-saffron"></div>
                </div>
                <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-primary z-10">
                  <div className="absolute -top-1 -left-[3px] w-2 h-2 rounded-full bg-primary border border-white"></div>
                </div>
              </div>
              <div className="flex justify-between px-1 mt-1">
                <span className="text-[10px] text-slate-400 font-bold">14:00</span>
                <span className="text-[10px] text-slate-400 font-bold">15:00</span>
                <span className="text-[10px] text-slate-400 font-bold">16:00</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
