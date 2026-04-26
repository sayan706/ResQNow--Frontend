'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import { Loader } from './Loader';
import PredictionDetailOverlay from './PredictionDetailOverlay';
import { buildMultiLayerMap } from '@/utils/mapBuilder';

const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), { ssr: false });
const TacticalMap = dynamic(() => import('./TacticalMap'), { ssr: false });

interface PredictWorkflowProps {
  projectId: string;
  projectName: string;
  onClose: () => void;
}

type Stage = 'PROMPT' | 'MAP' | 'QUESTIONS' | 'PROCESSING' | 'RESULT';

export default function PredictWorkflow({ projectId, projectName, onClose }: PredictWorkflowProps) {
  const [stage, setStage] = useState<Stage>('PROMPT');
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isFetchingProject, setIsFetchingProject] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const workflowRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<any>({
    hour: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
    day_of_week: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()),
    weather: 'clear',
    lighting_condition: 'daylight',
    visibility_level: 'good',
    road_surface_condition: 'dry',
    traffic_density: 'low',
    road_type: 'urban',
    speed_limit: 40,
    traffic_control_presence: 'signals',
    number_of_lanes: 2,
    sharp_turn_or_blind_curve: false,
    road_construction_present: false,
    is_festival_day: false,
    is_hotspot: false,
    severity_trend: 'stable',
    crowd_level: 'low',
    special_traffic_diversion: false
  });

  const questions = [
    // Temporal Context
    { key: 'hour', label: 'Prediction Hub Time?', type: 'time', icon: 'schedule', group: 'Temporal' },
    { key: 'day_of_week', label: 'Operational Day?', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], icon: 'calendar_today', group: 'Temporal' },
    
    // Environmental
    { key: 'weather', label: 'Current Weather?', options: ['clear', 'rainy', 'heavy rain', 'foggy', 'misty'], icon: 'cloud', group: 'Atmospheric' },
    { key: 'lighting_condition', label: 'Lighting Condition?', options: ['daylight', 'streetlights', 'dark_no_streetlights', 'dawn_dusk'], icon: 'light_mode', group: 'Atmospheric' },
    { key: 'visibility_level', label: 'Visibility level?', options: ['good', 'moderate', 'poor', 'blind'], icon: 'visibility', group: 'Atmospheric' },
    
    // Infrastructure
    { key: 'road_type', label: 'Road Classification?', options: ['urban', 'highway', 'rural', 'residential'], icon: 'edit_road', group: 'Infrastructure' },
    { key: 'road_surface_condition', label: 'Surface Condition?', options: ['dry', 'wet', 'damaged', 'oil_spill', 'icy'], icon: 'road', group: 'Infrastructure' },
    { key: 'speed_limit', label: 'Approx Speed Limit (km/h)?', options: [20, 40, 60, 80, 100], icon: 'speed', group: 'Infrastructure' },
    { key: 'number_of_lanes', label: 'How many lanes?', options: [1, 2, 4, 6], icon: 'lanes', group: 'Infrastructure' },
    { key: 'traffic_control_presence', label: 'Traffic Controls?', options: ['signals', 'signs', 'none', 'police_directed'], icon: 'traffic', group: 'Infrastructure' },
    
    // Safety Risk
    { key: 'sharp_turn_or_blind_curve', label: 'Sharp turn or blind curve?', type: 'boolean', icon: 'turn_right', group: 'Risk Factors' },
    { key: 'road_construction_present', label: 'Active construction?', type: 'boolean', icon: 'construction', group: 'Risk Factors' },
    { key: 'is_hotspot', label: 'Known accident hotspot?', type: 'boolean', icon: 'priority_high', group: 'Risk Factors' },
    
    // Traffic & Dynamics
    { key: 'traffic_density', label: 'Traffic Density?', options: ['low', 'medium', 'high', 'jam'], icon: 'traffic', group: 'Dynamics' },
    { key: 'special_traffic_diversion', label: 'Active diversions?', type: 'boolean', icon: 'alt_route', group: 'Dynamics' },
    { key: 'severity_trend', label: 'Incident Severity Trend?', options: ['stable', 'increasing', 'high', 'low'], icon: 'trending_up', group: 'Dynamics' },
    { key: 'crowd_level', label: 'Human Crowd Level?', options: ['low', 'medium', 'high'], icon: 'groups', group: 'Dynamics' },
    
    // Contextual
    { key: 'is_festival_day', label: 'Is it a festival/event day?', type: 'boolean', icon: 'celebration', group: 'Context' }
  ];

  useEffect(() => {
    if (workflowRef.current) {
      gsap.fromTo(workflowRef.current, 
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [stage]);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const tl = gsap.timeline();
      tl.to('.question-card', { x: -50, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => {
        setCurrentQuestionIndex(prev => prev + 1);
        gsap.fromTo('.question-card', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
      }});
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setStage('PROCESSING');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${projectId}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          // If hour was selected via time picker, it might be HH:MM format, backend likely expects integer
          hour: typeof formData.hour === 'string' && formData.hour.includes(':') 
            ? parseInt(formData.hour.split(':')[0]) 
            : formData.hour,
          latitude: coordinates?.lat,
          longitude: coordinates?.lng
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        // Enrich data with current session context to ensure UI doesn't show "Invalid Date" or empty coords
        const enrichedData = {
          ...data,
          latitude: data.latitude || coordinates?.lat,
          longitude: data.longitude || coordinates?.lng,
          zone_name: data.zone_name || (coordinates 
            ? `Target Hub (${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)})` 
            : 'Target Hub'),
          created_at: data.created_at || new Date().toISOString()
        };
        setPredictionResult(enrichedData);
        fetchProjectMapping(projectId, 10, true); // Fetch full mapping context and expect V2
        setStage('RESULT');
      } else {
        throw new Error('Prediction failed');
      }
    } catch (error) {
      console.error('Error running AI prediction. Attempting to show base map.');
      fetchProjectMapping(projectId);
      setStage('RESULT');
    }
  };

  const fetchProjectMapping = async (id: string, retries = 10, expectV2 = false) => {
    setIsFetchingProject(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/projects/${id}/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) return;
      
      const statusData = await res.json();
      const targetVersion = statusData.latest_version || 0;
      let jsonUrl = statusData.json_url;
      
      const states = statusData.states || statusData.latest_state?.states || [];
      if (states.length > 0) {
        const sortedStates = [...states].sort((a: any, b: any) => (b.version || 0) - (a.version || 0));
        const bestState = sortedStates.find((s: any) => s.state_type === 'updated') || sortedStates[0];
        if (bestState?.json_url) jsonUrl = bestState.json_url;
      } else if (statusData.latest_state?.json_url) {
        jsonUrl = statusData.latest_state.json_url;
      }

      if (jsonUrl) {
         // VERSION PROTECTION: 
         // If we expect V2, we wait until the JSON URL includes 'v2' (case insensitive)
         const isOutdated = expectV2 && !jsonUrl.toLowerCase().includes('v2');
         const isWaitingForV2 = isOutdated || (targetVersion > 1 && !jsonUrl.toLowerCase().includes('v2'));
         
         if (isWaitingForV2 && retries > 0) {
           console.log(`[Tactical] v2 expected but URL is outdated (${jsonUrl}). Retrying... (${retries})`);
           setTimeout(() => fetchProjectMapping(id, retries - 1, expectV2), 3000);
           return;
         }

         const mappingRes = await fetch(`/api/proxy?url=${encodeURIComponent(jsonUrl)}`);
         if (mappingRes.ok) {
           const mappingData = await mappingRes.json();
           setProjectData(mappingData);
           setIsFetchingProject(false);
           return;
         }
      }

      if (retries > 0) {
        setTimeout(() => fetchProjectMapping(id, retries - 1, expectV2), 3000);
      }
    } catch (e) {
      console.error('Error fetching project status:', e);
      if (retries === 0) setIsFetchingProject(false);
    } finally {
      if (retries === 0 || projectData) {
        setIsFetchingProject(false);
      }
    }
  };

  const getCombinedData = () => {
    if (!projectData) return predictionResult;
    if (!predictionResult) return projectData;

    // Merge projectData (zones/ambulances) with predictionResult (the hub)
    const combined = { ...projectData };
    
    // Add the real-time prediction as an extra overlay in the "Current" or existing first period
    const periods = Object.keys(combined.time_periods || {});
    if (periods.length > 0) {
      const firstPeriod = periods[0];
      if (predictionResult.latitude && predictionResult.longitude) {
         // Add the hub to the first period's zones if not present
         combined.time_periods[firstPeriod].zones = [
           ...combined.time_periods[firstPeriod].zones,
           {
             centroid: [predictionResult.latitude, predictionResult.longitude],
             risk_level: predictionResult.risk_profile?.level || 'High',
             zone_name: `Prediction: ${predictionResult.zone_name || 'Target'}`
           }
         ];
      }
    }
    
    return combined;
  };

  const handleSkipPrediction = () => {
     setStage('RESULT');
     fetchProjectMapping(projectId);
  };

  // Extract ambulance placement locations from resulting data if available
  const getAmbulanceSummary = () => {
    if (!predictionResult?.prediction_history?.[0]?.risk_profile?.ai_reasoning) return null;
    // For now, we take from prediction result directly or search within the object
    // Expecting predictionResult to contain time_periods or similar
    const periods = predictionResult.time_periods || {};
    return Object.entries(periods).map(([time, data]: [string, any]) => {
      const units = data.selected_ambulances || data.ambulances || [];
      return {
        time,
        locations: units.map((u: any) => u.location_name || u.zone_name || `Unit ${u.id || u.unit_id}`)
      };
    });
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div 
        ref={workflowRef}
        className="relative w-full max-w-4xl bg-surface dark:bg-slate-900 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        
        {stage === 'PROMPT' && (
          <div className="p-10 text-center space-y-8">
            <div className="w-24 h-24 bg-india-green/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <span className="material-symbols-outlined text-india-green text-5xl">check_circle</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black font-headline text-primary dark:text-white">Ingestion Successful</h2>
              <p className="text-slate-400">Project <span className="text-india-saffron font-bold">{projectName}</span> has been indexed.</p>
            </div>
            <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-lg font-bold text-primary dark:text-gray-200">Start Real-time Dispatch Analytics?</h3>
              <p className="text-sm text-slate-500">Our Senior AI models can simulate current risk vectors and propose optimal ambulance staging for this region.</p>
              <div className="flex gap-4 justify-center pt-4">
                <button 
                  onClick={() => setStage('MAP')}
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95"
                >
                  Yes, Execute Simulation
                </button>
                <button 
                  onClick={handleSkipPrediction}
                  className="px-8 py-4 bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 rounded-2xl font-black text-sm hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
                >
                  No, Just Show Map
                </button>
              </div>
            </div>
          </div>
        )}

        {stage === 'MAP' && (
          <div className="flex flex-col h-full">
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/5 to-transparent">
              <div>
                <h2 className="text-xl font-bold font-headline text-primary dark:text-white">Target Hub Coordinates</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-black">Select intersection or incident hub</p>
              </div>
              {coordinates && (
                <div className="bg-india-saffron/10 px-4 py-2 rounded-xl border border-india-saffron/20 animate-fade-in">
                  <span className="text-xs font-mono font-bold text-india-saffron">{coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-h-0 bg-slate-900">
               <LocationPickerMap onLocationSelect={(lat, lng) => setCoordinates({lat, lng})} />
            </div>
            <div className="p-6 bg-surface dark:bg-slate-900 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-slate-500 italic">Select point on map to enable dispatch logic</span>
              <button 
                disabled={!coordinates}
                onClick={() => setStage('QUESTIONS')}
                className="px-8 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                Set Location & Continue
              </button>
            </div>
          </div>
        )}

        {stage === 'QUESTIONS' && (
          <div className="p-12 h-full flex flex-col justify-center items-center">
            <div className="w-full max-w-lg space-y-10 question-card">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-india-saffron/10 rounded-2xl flex items-center justify-center">
                   <span className="material-symbols-outlined text-india-saffron text-3xl">{questions[currentQuestionIndex].icon}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex gap-2 justify-center mb-1">
                     <span className="text-[0.55rem] font-black uppercase tracking-widest text-india-saffron px-2 py-0.5 bg-india-saffron/10 rounded-md">
                        {questions[currentQuestionIndex].group}
                     </span>
                  </div>
                  <h4 className="text-[0.6rem] font-black uppercase tracking-widest text-slate-500">Parameter {currentQuestionIndex + 1} of {questions.length}</h4>
                  <h2 className="text-2xl font-bold text-primary dark:text-white">{questions[currentQuestionIndex].label}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {questions[currentQuestionIndex].type === 'time' ? (
                   <div className="col-span-2 flex flex-col items-center gap-6 animate-fade-in">
                     <div className="relative group w-full">
                       <input 
                         type="time" 
                         value={formData[questions[currentQuestionIndex].key] || ''}
                         onChange={(e) => setFormData({...formData, [questions[currentQuestionIndex].key]: e.target.value})}
                         className="w-full bg-slate-50 dark:bg-white/5 border border-white/10 rounded-3xl p-8 text-4xl font-headline font-black text-center text-primary dark:text-white focus:ring-4 focus:ring-india-saffron/20 transition-all cursor-pointer outline-none"
                       />
                       <div className="absolute inset-0 pointer-events-none rounded-3xl border-2 border-transparent group-hover:border-india-saffron/30 transition-all" />
                     </div>
                     <button 
                       onClick={nextQuestion}
                       className="px-12 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:shadow-xl transition-all active:scale-95"
                     >
                       Confirm Time & Proceed
                     </button>
                   </div>
                ) : questions[currentQuestionIndex].type === 'boolean' ? (
                  <>
                    <button 
                      onClick={() => { setFormData({...formData, [questions[currentQuestionIndex].key]: true}); nextQuestion(); }}
                      className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-white/5 hover:border-india-green hover:bg-india-green/5 text-slate-700 dark:text-slate-300 font-bold transition-all text-sm"
                    >
                      Yes
                    </button>
                    <button 
                      onClick={() => { setFormData({...formData, [questions[currentQuestionIndex].key]: false}); nextQuestion(); }}
                      className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-white/5 hover:border-red-500 hover:bg-red-500/5 text-slate-700 dark:text-slate-300 font-bold transition-all text-sm"
                    >
                      No
                    </button>
                  </>
                ) : (
                  questions[currentQuestionIndex].options?.map(opt => (
                    <button 
                      key={opt}
                      onClick={() => { setFormData({...formData, [questions[currentQuestionIndex].key]: opt}); nextQuestion(); }}
                      className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-white/5 hover:border-primary hover:bg-primary/5 text-slate-700 dark:text-slate-300 font-bold transition-all text-sm capitalize"
                    >
                      {opt}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {stage === 'PROCESSING' && (
          <div className="flex-1 flex flex-col items-center justify-center p-20">
             <Loader message="Synthesizing Risk Simulation..." />
          </div>
        )}


        {stage === 'RESULT' && (
          <div className="h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
               <div>
                 <h2 className="text-lg font-bold text-primary dark:text-white">Active Deployment Visualization</h2>
                 <p className="text-xs text-slate-500 font-black tracking-widest uppercase">Multi-period tactical map</p>
               </div>
               <div className="flex items-center gap-3">
                 <button
                   onClick={() => {
                     const builtHtml = buildMultiLayerMap(getCombinedData(), projectName);
                     const blob = new Blob([builtHtml], { type: 'text/html' });
                     const url = URL.createObjectURL(blob);
                     const a = document.createElement('a');
                     a.href = url;
                     a.download = `ResQNow_Map_${projectName.replace(/\s+/g, '_')}.html`;
                     document.body.appendChild(a);
                     a.click();
                     document.body.removeChild(a);
                     URL.revokeObjectURL(url);
                   }}
                   className="flex items-center gap-2 px-4 py-2 rounded-xl bg-india-green text-white hover:bg-india-green/90 transition-all text-[10px] font-black uppercase tracking-widest shadow-lg shadow-india-green/20"
                 >
                   <span className="material-symbols-outlined text-sm">download</span>
                   Save HTML Map
                 </button>
                 <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all hover:rotate-90"
                 >
                   <span className="material-symbols-outlined">close</span>
                 </button>
               </div>
            </div>
            
            <div className="relative bg-black h-[600px] border-b border-white/10 overflow-hidden">
               <TacticalMap data={getCombinedData()} title="Simulation Analysis" />
               
               {isFetchingProject && !projectData && (
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-primary/90 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                   Fetching Mapping Context...
                 </div>
               )}
               
               {/* Quick AI Toggle - Only show if a prediction was actually run */}
               {predictionResult && (
                 <button 
                   onClick={() => setIsFinalizing(true)}
                   className="absolute bottom-6 right-6 z-[100] px-6 py-3 bg-india-saffron text-white rounded-full font-black text-xs shadow-2xl flex items-center gap-2 hover:scale-105 transition-all"
                 >
                   <span className="material-symbols-outlined text-[18px]">psychology</span>
                   Open AI Briefing
                 </button>
               )}
            </div>

            {/* Ambulance Placement Summary Box */}
            <div className="p-8 bg-surface dark:bg-slate-950 border-t border-white/5 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-india-saffron flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">ambulance</span>
                  Strategic Fleet Deployment
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(() => {
                  const combined = getCombinedData();
                  const periods = combined?.time_periods ? Object.entries(combined.time_periods) : [];
                  
                  if (periods.length === 0) {
                    return (
                      <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-white/10 w-full">
                        <span className="material-symbols-outlined text-4xl text-slate-700 mb-2">error_outline</span>
                        <p className="text-sm text-slate-500 italic">Strategic fleet data for {projectName} is pending simulation results.</p>
                      </div>
                    );
                  }

                  return periods.map(([time, data]: [string, any], idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-white/5 rounded-[2rem] p-6 border border-white/5 stagger-reveal">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <span className="text-[0.7rem] font-black uppercase">{time}</span>
                        </div>
                        <div>
                          <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest block">Simulation Period</span>
                          <span className="text-xs font-bold text-primary dark:text-white">Active Dispatch Window</span>
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {(data.selected_ambulances || data.ambulances || []).map((u: any, li: number) => (
                          <li key={li} className="flex gap-3 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-white/5">
                             <span className="w-5 h-5 rounded-full bg-india-green/20 text-india-green flex items-center justify-center text-[10px]">🚑</span>
                             <div className="flex flex-col">
                               <span className="font-black text-primary dark:text-india-saffron">
                                 {u.location_name || u.zone_name || u.name || (u.unit_id ? `Unit ${u.unit_id}` : `Ambulance Unit ${li + 1}`)}
                               </span>
                               <span className="text-[0.6rem] text-slate-500 uppercase tracking-tighter">Strategic Staging Point</span>
                             </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        )}

      </div>

      {isFinalizing && predictionResult && (
        <PredictionDetailOverlay 
          prediction={predictionResult}
          onClose={() => setIsFinalizing(false)}
        />
      )}
    </div>
  );
}
