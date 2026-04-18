'use client';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sidebar, TopBar } from '@/components/sidebar';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/Loader';
import dynamic from 'next/dynamic';

const MapOverlay = dynamic(() => import('@/components/MapOverlay'), { ssr: false });

export default function HistoryPage() {
  const container = useRef<HTMLDivElement>(null);
  const [historyDocs, setHistoryDocs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/projects/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Assuming data is an array or { history: [] }
          setHistoryDocs(Array.isArray(data) ? data : data.history || data.data || []);
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          router.replace('/login');
        }
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  useGSAP(() => {
    if (!isLoading) {
      const tl = gsap.timeline();
      tl.from('.stagger-reveal', {
        y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      });
    }
  }, { scope: container, dependencies: [isLoading] });

  return (
    <div ref={container} className="bg-surface dark:bg-slate-950 text-on-surface dark:text-slate-200 min-h-screen">
      <Sidebar activePage="history" />

      {/* Content offset */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <TopBar title="Project History" />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-6 page-enter">
            
            <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-2xl p-6 md:p-8 border-t-2 border-t-india-saffron/30"
                 style={{ boxShadow: '0 4px 20px rgba(2,36,72,0.08)' }}>
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-primary dark:text-white tracking-tight font-headline">Past Deployments</h2>
                  <p className="text-on-surface-variant dark:text-slate-500 text-sm mt-1">Review historical risk assessments and responses</p>
                </div>
                <span className="material-symbols-outlined text-india-saffron/30 text-4xl animate-float">history</span>
              </div>

              {isLoading ? (
                <Loader message="Loading historical records..." />
              ) : historyDocs.length === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-outline-variant/30 dark:border-slate-800 rounded-xl bg-surface dark:bg-slate-800/30">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 dark:text-slate-600 mb-4">folder_open</span>
                  <p className="text-sm font-bold text-on-surface-variant dark:text-slate-500 mb-2">No history found</p>
                  <p className="text-xs text-on-surface-variant/70 dark:text-slate-600">You haven't processed any risk models yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {historyDocs.map((doc, idx) => (
                    <div key={doc.id || idx} className="stagger-reveal bg-surface dark:bg-slate-800/50 rounded-xl p-5 border border-outline-variant/20 dark:border-slate-700/50 hover:border-india-saffron/50 transition-colors group relative overflow-hidden">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-india-saffron/10 transition-colors">
                            <span className="material-symbols-outlined text-primary dark:text-white/60 group-hover:text-india-saffron transition-colors">analytics</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-primary dark:text-white truncate max-w-[150px]">{doc.name || doc.project_name || `Project ${idx + 1}`}</h3>
                            <p className="text-[0.65rem] font-bold text-on-surface-variant dark:text-slate-500 uppercase tracking-wider mt-0.5">
                              {new Date(doc.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        {doc.status && (
                          <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${doc.status === 'completed' || doc.status === 'success' ? 'bg-india-green/10 text-india-green border border-india-green/20' : 'bg-india-saffron/10 text-india-saffron border border-india-saffron/20'}`}>
                            {doc.status}
                          </span>
                        )}
                      </div>
                      
                      {doc.zone_name && (
                         <div className="mt-3 text-xs text-on-surface-variant dark:text-slate-400">
                           <span className="font-semibold block">Zone:</span> {doc.zone_name}
                         </div>
                      )}
                      {doc.prediction && (
                        <div className="mt-2 flex gap-2 text-xs">
                          <span className="bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md text-on-surface-variant dark:text-slate-400">Result: <strong className="text-primary dark:text-white">{doc.prediction}</strong></span>
                        </div>
                      )}

                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <button 
                          onClick={() => setSelectedProject(doc)}
                          className="text-[0.75rem] font-bold text-india-saffron hover:text-primary dark:hover:text-white transition-colors flex items-center gap-1 group/btn"
                        >
                          View Details
                          <span className="material-symbols-outlined text-[14px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      {selectedProject && (
        <MapOverlay 
          data={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
}
