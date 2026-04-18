'use client';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sidebar, TopBar } from '@/components/sidebar';
import { useRouter } from 'next/navigation';

interface UploadedFile {
  name: string;
  processed: boolean;
  timestamp: string;
}

export default function Dashboard() {
  const container = useRef<HTMLDivElement>(null);
  const mapImageRef = useRef<HTMLImageElement>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
    }
  }, [router]);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.from('.stagger-reveal', {
      y: 24, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
    }, '-=0.3');
  }, { scope: container });

  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapImageRef.current) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    // Shift image in opposite direction of mouse movement to create "look around" effect
    gsap.to(mapImageRef.current, {
      xPercent: -(x - 0.5) * 40,
      yPercent: -(y - 0.5) * 40,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMapMouseLeave = () => {
    if (!mapImageRef.current) return;
    gsap.to(mapImageRef.current, {
      xPercent: 0,
      yPercent: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newFile: UploadedFile = {
        name: file.name,
        processed: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setUploadedFile(newFile);
    }
  };

  const deleteFile = () => {
    setUploadedFile(null);
  };

  const processFile = () => {
    if (uploadedFile) {
      setUploadedFile({ ...uploadedFile, processed: true });
    }
  };

  return (
    <div ref={container} className="bg-surface dark:bg-slate-950 text-on-surface dark:text-slate-200 min-h-screen">
      <Sidebar activePage="dashboard" />

      {/* Content offset — sidebar is fixed so ml-64 shifts block content */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <TopBar title="Mission Control" />

        {/*
         * Single unified grid system:
         * - All sections use the same 12-column grid with gap-6
         * - Bento below: 8 cols + 4 cols = 12
         * This ensures vertical column alignment across all rows.
         */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-6 page-enter">
            {/* ── Row 2: Bento Grid (same 12-col, same gap-6) ──────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Data Ingestion (col-span-8) */}
              <section className="stagger-reveal lg:col-span-8">
                <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl p-6 md:p-8 border-t-2 border-t-india-saffron/30"
                  style={{ boxShadow: '0 4px 20px rgba(2,36,72,0.08)' }}>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-xl font-bold text-primary dark:text-white tracking-tight font-headline">Data Ingestion</h2>
                      <p className="text-on-surface-variant dark:text-slate-500 text-sm mt-1">Upload tactical datasets for real-time risk modeling</p>
                    </div>
                    <span className="material-symbols-outlined text-india-saffron/30 text-4xl animate-float">upload_file</span>
                  </div>

                  <label htmlFor="csv-upload"
                    className="cursor-pointer border-2 border-dashed border-outline-variant dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center bg-surface dark:bg-slate-800/30 hover:bg-india-saffron/5 hover:border-india-saffron/40 dark:hover:border-india-saffron/40 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-primary/5 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-india-saffron/10 group-hover:scale-110 transition-all duration-300">
                      <span className="material-symbols-outlined text-primary dark:text-white/40 group-hover:text-india-saffron text-3xl transition-colors duration-300">cloud_upload</span>
                    </div>
                    <p className="text-lg font-semibold text-primary dark:text-white font-headline group-hover:text-india-saffron transition-colors duration-300">
                      Drag &amp; Drop CSV Dataset
                    </p>
                    <p className="text-on-surface-variant dark:text-slate-500 text-sm mt-1">or browse files on your computer</p>
                    <div className="mt-6">
                      <span className="bg-primary text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg group-hover:bg-india-saffron transition-all duration-300 btn-ripple inline-flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                        Browse Files
                      </span>
                    </div>
                    <input 
                      id="csv-upload" 
                      type="file" 
                      accept=".csv" 
                      className="sr-only" 
                      onChange={handleFileChange}
                    />
                  </label>

                  <div className="mt-8 pt-6 border-t border-outline-variant/20 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[0.68rem] font-bold text-on-surface-variant dark:text-slate-500 uppercase tracking-widest">Recent Uploads</h4>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-india-green animate-pulse" />
                        <span className="text-[0.65rem] text-on-surface-variant dark:text-slate-500 font-bold uppercase">System Healthy</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {!uploadedFile ? (
                        <div className="text-center py-6 border-2 border-dashed border-outline-variant/30 rounded-xl">
                          <p className="text-xs text-on-surface-variant dark:text-slate-500 font-medium italic">No files uploaded yet</p>
                        </div>
                      ) : (
                        <div className={`flex items-center justify-between p-3.5 bg-surface dark:bg-slate-800/50 rounded-xl border-l-4 ${uploadedFile.processed ? 'border-l-india-green' : 'border-l-india-saffron'} group transition-all duration-200 animate-fade-in`}>
                          <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary dark:text-white/60 text-xl">description</span>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-on-surface dark:text-slate-300">
                                {uploadedFile.name}
                              </span>
                              <span className="text-[0.6rem] text-on-surface-variant dark:text-slate-500 font-bold uppercase tracking-tight">
                                Detected at {uploadedFile.timestamp}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {uploadedFile.processed ? (
                              <span className="text-[0.65rem] font-bold text-india-green bg-india-green/10 px-2.5 py-1 rounded-full flex-shrink-0">
                                ✓ Processed
                              </span>
                            ) : (
                              <button 
                                onClick={processFile}
                                className="text-[0.65rem] font-bold text-white bg-primary hover:bg-india-saffron px-4 py-1.5 rounded-full transition-colors btn-ripple shadow-sm"
                              >
                                Process Selection
                              </button>
                            )}
                            
                            <button 
                              onClick={deleteFile}
                              className="p-1.5 text-on-surface-variant hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all duration-200"
                              title="Delete File"
                            >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Instructions + Map (col-span-4) */}
              <section className="stagger-reveal lg:col-span-4 flex flex-col gap-6">

                <div className="bg-primary text-white rounded-2xl p-6 relative overflow-hidden flex-shrink-0"
                  style={{ boxShadow: '0 12px 32px rgba(2,36,72,0.25)' }}>
                  <div className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: 'linear-gradient(to right, #FF9933 33%, #fff 33%, #fff 66%, #138808 66%)' }} />
                  <div className="absolute -right-6 -bottom-6 opacity-[0.07]">
                    <span className="material-symbols-outlined text-[8rem]">help</span>
                  </div>
                  <h2 className="text-base font-bold font-headline mb-4 flex items-center gap-2 relative z-10">
                    <span className="material-symbols-outlined text-india-saffron text-[1.1rem]">verified_user</span>
                    Instructions
                  </h2>
                  <div className="space-y-3 relative z-10">
                    {[
                      { title: 'File Specifications', icon: 'description', detail: 'UTF-8 CSV format. Max 50MB per ingestion cycle.' },
                      { title: 'Required Columns', icon: 'table_rows', detail: 'LONGITUDE, LATITUDE' },
                      { title: 'Spatial Reference', icon: 'map', detail: 'WGS-84 coordinate system required.' },
                    ].map((item) => (
                      <div key={item.title} className="bg-white/10 rounded-xl p-3.5 hover:bg-white/15 transition-colors duration-200">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="material-symbols-outlined text-india-saffron text-[15px]">{item.icon}</span>
                          <span className="font-bold text-sm">{item.title}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 relative z-10">
                    <a 
                      className="inline-flex items-center text-india-saffron font-bold text-sm hover:text-white transition-colors duration-200 gap-1" 
                      href="/synthetic.csv"
                      download="synthetic.csv"
                    >
                      Download Template
                      <span className="material-symbols-outlined text-sm">download</span>
                    </a>
                  </div>
                </div>

                <div 
                  onMouseMove={handleMapMouseMove}
                  onMouseLeave={handleMapMouseLeave}
                  className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl overflow-hidden h-[220px] relative group cursor-crosshair"
                  style={{ boxShadow: '0 4px 20px rgba(2,36,72,0.08)' }}
                >
                  <img
                    ref={mapImageRef}
                    alt="Geospatial Map"
                    className="w-full h-full object-cover scale-[1.6] transition-opacity duration-700"
                    src="/kolkata_neon_20260412_125741.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-india-saffron animate-pulse flex-shrink-0" />
                      <h3 className="text-white font-bold text-sm font-headline">Predictive Coverage</h3>
                    </div>
                    <p className="text-white/60 text-xs">Last 24h telemetry analysis</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
