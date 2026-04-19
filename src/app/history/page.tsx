'use client';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Sidebar, TopBar } from '@/components/sidebar';
import { useRouter } from 'next/navigation';
import { Loader } from '@/components/Loader';
import Footer from '@/components/footer';
import dynamic from 'next/dynamic';
import PredictionDetailOverlay from '@/components/PredictionDetailOverlay';

const MapOverlay = dynamic(() => import('@/components/MapOverlay'), { ssr: false });

export default function HistoryPage() {
  const container = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'predictions'>('projects');
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<any | null>(null);
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
          setProjects(data.projects || []);
          setPredictions(data.predictions || []);
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
      // Small delay to ensure DOM is ready after tab switch
      const ctx = gsap.context(() => {
        gsap.fromTo('.stagger-reveal', 
          { y: 30, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', clearProps: "all" }
        );
      }, container);
      return () => ctx.revert();
    }
  }, { scope: container, dependencies: [isLoading, activeTab] });

  const getRiskColor = (level: string) => {
    const lvl = level?.toLowerCase() || '';
    if (lvl.includes('high')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (lvl.includes('med') || lvl.includes('moderate')) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    return 'text-green-500 bg-green-500/10 border-green-500/20';
  };

  return (
    <div ref={container} className="bg-surface dark:bg-slate-950 text-on-surface dark:text-slate-200 min-h-screen">
      <Sidebar activePage="history" />

      {/* Content offset */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <TopBar title="Historical Analytics" />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full space-y-8">
            
            {/* Tab Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold font-headline text-primary dark:text-white mb-2">My History</h1>
                <p className="text-on-surface-variant dark:text-slate-500 text-sm">Review past deployments and AI risk assessments</p>
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 w-fit self-start">
                <button 
                  onClick={() => setActiveTab('projects')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'projects' 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Deployments
                </button>
                <button 
                  onClick={() => setActiveTab('predictions')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'predictions' 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  Risk Predictions
                </button>
              </div>
            </div>

            <div className="bg-surface-container-lowest dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[500px] flex flex-col">
              
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                   <Loader message="Synthesizing historical data..." />
                </div>
              ) : activeTab === 'projects' ? (
                <>
                  {projects.length === 0 ? (
                    <EmptyState icon="folder_open" title="No Deployments" message="You haven't processed any deployment maps yet." />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map((proj, idx) => (
                        <div key={proj.project_id || idx} className="stagger-reveal bg-surface dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-100 dark:border-white/5 hover:border-india-saffron/40 transition-all group relative overflow-hidden active:scale-95 cursor-pointer" onClick={() => setSelectedProject(proj)}>
                          <div className="flex items-start justify-between mb-5">
                            <div className="w-12 h-12 rounded-xl bg-primary/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-india-saffron/10 transition-colors">
                              <span className="material-symbols-outlined text-primary dark:text-white/60 group-hover:text-india-saffron transition-colors">location_on</span>
                            </div>
                            <span className="text-[0.6rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-india-green/10 text-india-green border border-india-green/20">
                              {proj.status}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-lg text-primary dark:text-white mb-1 line-clamp-1">{proj.name || 'Unnamed Project'}</h3>
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-4">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            {new Date(proj.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>

                          <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-white/5 text-[0.7rem] font-bold">
                            <span className="text-india-saffron flex items-center gap-1">
                              View Map <span className="material-symbols-outlined text-sm">map</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {predictions.length === 0 ? (
                    <EmptyState icon="psychology" title="No Assessments" message="You haven't run any AI risk assessments yet." />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {predictions.map((pred, idx) => (
                        <div key={pred.id || idx} 
                             className="stagger-reveal bg-surface dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-100 dark:border-white/5 hover:border-primary/40 transition-all group relative active:scale-95 cursor-pointer"
                             onClick={() => setSelectedPrediction(pred)}>
                          <div className="flex items-start justify-between mb-5">
                             <div className="w-12 h-12 rounded-xl bg-india-saffron/5 dark:bg-india-saffron/5 flex items-center justify-center group-hover:bg-india-saffron/10 transition-colors">
                              <span className="material-symbols-outlined text-india-saffron transition-colors">analytics</span>
                            </div>
                            <span className={`text-[0.6rem] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${getRiskColor(pred.risk_profile?.level)}`}>
                              {pred.risk_profile?.level} Risk
                            </span>
                          </div>

                          <h3 className="font-bold text-lg text-primary dark:text-white mb-1">{pred.zone_name}</h3>
                          <div className="space-y-1 mb-5">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[0.65rem]">
                              <span className="material-symbols-outlined text-sm">pin_drop</span>
                              {typeof pred.latitude === 'number' && typeof pred.longitude === 'number' 
                                ? `${pred.latitude.toFixed(4)}, ${pred.longitude.toFixed(4)}`
                                : 'Coordinates N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-[0.7rem] uppercase tracking-wide">
                              <span className="material-symbols-outlined text-xs text-india-saffron">location_on</span>
                              {pred.zone_name}
                            </div>
                          </div>

                          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl mb-5">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[0.65rem] text-slate-500 font-bold uppercase tracking-widest">Risk Score</span>
                              <span className="text-sm font-black text-primary dark:text-white">{pred.risk_profile?.probability}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-1000 ${pred.risk_profile?.probability > 70 ? 'bg-red-500' : 'bg-india-saffron'}`} style={{ width: `${pred.risk_profile?.probability}%` }}></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 text-[0.7rem] font-bold">
                            <span className="text-slate-400 uppercase tracking-tighter">{new Date(pred.created_at).toLocaleDateString()}</span>
                            <span className="text-primary dark:text-india-saffron flex items-center gap-1">
                              AI Briefing <span className="material-symbols-outlined text-sm">visibility</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </main>
        <Footer />
      </div>

      {selectedProject && (
        <MapOverlay 
          data={selectedProject} 
          onClose={() => setSelectedProject(null)} 
        />
      )}

      {selectedPrediction && (
        <PredictionDetailOverlay 
          prediction={selectedPrediction} 
          onClose={() => setSelectedPrediction(null)} 
        />
      )}
    </div>
  );
}

function EmptyState({ icon, title, message }: { icon: string, title: string, message: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-primary dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-[250px]">{message}</p>
    </div>
  );
}
