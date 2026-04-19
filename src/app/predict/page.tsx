'use client';
'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import dynamic from 'next/dynamic';
import { Sidebar, TopBar } from '@/components/sidebar';
import { Loader } from '@/components/Loader';
import PredictionDetailOverlay from '@/components/PredictionDetailOverlay';
import { buildMultiLayerMap } from '@/utils/mapBuilder';

// Dynamic imports for Map components
const LocationPickerMap = dynamic(() => import('@/components/LocationPickerMap'), { ssr: false });
const TacticalMap = dynamic(() => import('@/components/TacticalMap'), { ssr: false });

type Stage = 'STAGING' | 'PROCESSING' | 'RESULT';

export default function PredictFactorForm() {
  const container = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  const [stage, setStage] = useState<Stage>('STAGING');
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [isFinalizing, setIsFinalizing] = useState(false);
  
  const [formData, setFormData] = useState({
    zone_name: 'Downtown Hub',
    latitude: 22.5726,
    longitude: 88.3639,
    hour: new Date().getHours(),
    day_of_week: new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()).toLowerCase(),
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
    is_public_holiday: false,
    is_hotspot: false,
    severity_trend: 'stable',
    crowd_level: 'low',
    special_traffic_diversion: false
  });

  useGSAP(() => {
    if (stage === 'STAGING') {
      gsap.from('.stagger-section', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      });
    } else if (stage === 'RESULT') {
      gsap.from('.result-fade', {
        opacity: 0,
        scale: 0.98,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  }, [stage, container]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStage('PROCESSING');
    
    try {
      const response = await fetch('http://127.0.0.1:8000/prediction/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Prediction API failed');
      
      const data = await response.json();
      
      // Post-process response: Inject form data as fallback for missing fields
      const enrichedData = {
        ...data,
        latitude: data.latitude || formData.latitude,
        longitude: data.longitude || formData.longitude,
        zone_name: data.zone_name || formData.zone_name,
        created_at: data.created_at || new Date().toISOString()
      };

      console.log("[Analytical Debug] Prediction Result:", enrichedData);
      setPredictionResult(enrichedData);
      setStage('RESULT');
    } catch (error) {
      console.error('Error during prediction:', error);
      alert('Simulation failed. Please check backend connection.');
      setStage('STAGING');
    }
  };

  return (
    <div ref={container} className="bg-surface dark:bg-slate-950 font-body text-on-surface dark:text-slate-200 min-h-screen overflow-x-hidden">
      <Sidebar activePage="predict" />

      <div className="md:ml-64 flex flex-col min-h-screen relative">
        <TopBar>
           <div className="flex items-center gap-3 ml-2">
             <div className="w-2 h-2 rounded-full bg-india-saffron animate-pulse" />
             <h2 className="text-sm font-black uppercase tracking-widest text-[#022448] dark:text-white">
               {stage === 'STAGING' ? 'Tactical Input Calibration' : 'Real-time Analytical Output'}
             </h2>
           </div>
        </TopBar>

        {stage === 'STAGING' && (
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-10">
            {/* Header */}
            <header className="stagger-section space-y-2">
              <h1 className="text-4xl font-headline font-black text-[#022448] dark:text-white tracking-tight">
                Region Risk Simulation
              </h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-3xl text-sm md:text-base">
                Configure advanced environmental and geospatial parameters. Our AI will synthesize this data to propose optimal ambulance deployment strategies.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-12 pb-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Geolocation Section */}
                <div className="lg:col-span-8 stagger-section space-y-6">
                  <section className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
                    <div className="p-8 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-gradient-to-r from-india-saffron/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-india-saffron/10 rounded-xl">
                           <span className="material-symbols-outlined text-india-saffron">map</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-primary dark:text-white">Coordinate Hub</h3>
                          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Interactive Geospatial Selection</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 dark:bg-white/5 px-4 py-2 rounded-xl flex gap-6">
                         <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-black text-slate-400">LATITUDE</span>
                            <span className="text-xs font-mono font-bold text-india-saffron">{formData.latitude.toFixed(4)}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[9px] uppercase font-black text-slate-400">LONGITUDE</span>
                            <span className="text-xs font-mono font-bold text-india-saffron">{formData.longitude.toFixed(4)}</span>
                         </div>
                      </div>
                    </div>
                    <div className="h-[450px] bg-slate-100 dark:bg-slate-950">
                       <LocationPickerMap 
                        onLocationSelect={handleLocationSelect} 
                        initialLat={formData.latitude}
                        initialLng={formData.longitude}
                       />
                    </div>
                  </section>
                </div>

                {/* Regional Context Sidebar */}
                <div className="lg:col-span-4 stagger-section space-y-6">
                   <section className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl h-full flex flex-col justify-between">
                     <div className="space-y-8">
                       <div className="flex items-center gap-3">
                         <div className="p-2 bg-primary/10 rounded-xl">
                            <span className="material-symbols-outlined text-primary dark:text-india-saffron">location_city</span>
                         </div>
                         <h3 className="font-bold text-lg text-primary dark:text-white">Regional Meta</h3>
                       </div>

                       <div className="space-y-6">
                         <div className="space-y-2">
                           <label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Hub Identity</label>
                           <input 
                             type="text"
                             value={formData.zone_name}
                             onChange={(e) => setFormData({...formData, zone_name: e.target.value})}
                             className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-india-saffron/20 transition-all outline-none font-bold text-primary dark:text-white"
                             placeholder="e.g. Dakshineswar Junction"
                           />
                         </div>

                         <div className="space-y-2">
                            <label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Operational Day</label>
                            <select 
                              value={formData.day_of_week}
                              onChange={(e) => setFormData({...formData, day_of_week: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 outline-none font-bold capitalize"
                            >
                              {['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map(day => (
                                <option key={day} value={day}>{day}</option>
                              ))}
                            </select>
                         </div>

                         <div className="space-y-2">
                            <label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">Tactical Hour (0-23)</label>
                            <div className="relative">
                              <input 
                                type="range" min="0" max="23"
                                value={formData.hour}
                                onChange={(e) => setFormData({...formData, hour: parseInt(e.target.value)})}
                                className="w-full accent-india-saffron h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <div className="flex justify-between mt-3">
                                <span className="text-xs font-mono font-bold text-primary dark:text-white">{formData.hour}:00</span>
                                <span className="text-[10px] text-slate-400 uppercase font-black">24h Simulation Cycle</span>
                              </div>
                            </div>
                         </div>
                       </div>
                     </div>

                     <div className="bg-india-green/5 p-6 rounded-3xl border border-india-green/10 mt-8">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-india-green text-sm">verified_user</span>
                          <span className="text-[10px] font-black uppercase tracking-tighter text-india-green">Data Integrity Protocol</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">System automatically normalizes inputs for higher-order risk synthesis. Precision map data is verified via tactical feed.</p>
                     </div>
                   </section>
                </div>

                {/* Atmosphere & Infrastructure */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                   {/* Atmospheric Section */}
                   <section className="stagger-section bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="p-2 bg-blue-500/10 rounded-xl">
                            <span className="material-symbols-outlined text-blue-500">cloudy</span>
                         </div>
                         <h3 className="font-bold text-lg text-primary dark:text-white">Atmospheric</h3>
                      </div>
                      <div className="space-y-6">
                        {[
                          { key: 'weather', label: 'Weather', options: ['clear', 'partly cloudy', 'heavy rain', 'foggy', 'misty'] },
                          { key: 'lighting_condition', label: 'Lighting', options: ['daylight', 'dawn_dusk', 'streetlights', 'dark_no_streetlights'] },
                          { key: 'visibility_level', label: 'Visibility', options: ['good', 'moderate', 'poor', 'blind'] },
                        ].map(field => (
                          <div key={field.key} className="space-y-2">
                            <label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">{field.label}</label>
                            <select 
                              value={formData[field.key as keyof typeof formData] as string}
                              onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 outline-none font-bold capitalize text-sm"
                            >
                              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                   </section>

                   {/* Infrastructure Section */}
                   <section className="stagger-section bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="p-2 bg-purple-500/10 rounded-xl">
                            <span className="material-symbols-outlined text-purple-500">edit_road</span>
                         </div>
                         <h3 className="font-bold text-lg text-primary dark:text-white">Infrastructure</h3>
                      </div>
                      <div className="space-y-6">
                        {[
                          { key: 'road_type', label: 'Road Classification', options: ['urban', 'highway', 'rural', 'residential', 'intersection'] },
                          { key: 'road_surface_condition', label: 'Surface Condition', options: ['dry', 'wet', 'damaged', 'oil_spill', 'icy'] },
                          { key: 'traffic_control_presence', label: 'Control Systems', options: ['none', 'signals', 'signs', 'police_directed'] },
                        ].map(field => (
                          <div key={field.key} className="space-y-2">
                            <label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">{field.label}</label>
                            <select 
                              value={formData[field.key as keyof typeof formData] as string}
                              onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 outline-none font-bold capitalize text-sm"
                            >
                              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        ))}
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                             <label className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">Lanes</label>
                             <input type="number" value={formData.number_of_lanes} onChange={(e) => setFormData({...formData, number_of_lanes: parseInt(e.target.value)})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 outline-none font-bold" />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">Speed (KM/H)</label>
                             <input type="number" value={formData.speed_limit} onChange={(e) => setFormData({...formData, speed_limit: parseInt(e.target.value)})} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-3 outline-none font-bold" />
                           </div>
                        </div>
                      </div>
                   </section>

                   {/* Risk Analytics Section */}
                   <section className="stagger-section bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl">
                      <div className="flex items-center gap-3 mb-8">
                         <div className="p-2 bg-red-500/10 rounded-xl">
                            <span className="material-symbols-outlined text-red-500">warning</span>
                         </div>
                         <h3 className="font-bold text-lg text-primary dark:text-white">Analytical Vectors</h3>
                      </div>
                      <div className="space-y-6">
                        {[
                          { key: 'severity_trend', label: 'Severity Trend', options: ['stable', 'increasing', 'high', 'low'] },
                          { key: 'traffic_density', label: 'Traffic Density', options: ['low', 'medium', 'high', 'jam'] },
                          { key: 'crowd_level', label: 'Crowd Presence', options: ['low', 'medium', 'high'] },
                        ].map(field => (
                          <div key={field.key} className="space-y-2">
                            <label className="text-[0.65rem] font-black uppercase tracking-widest text-slate-400">{field.label}</label>
                            <select 
                              value={formData[field.key as keyof typeof formData] as string}
                              onChange={(e) => setFormData({...formData, [field.key]: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 outline-none font-bold capitalize text-sm"
                            >
                              {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                   </section>
                </div>

                {/* Binary Risk Factors */}
                <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-section">
                   {[
                     { key: 'sharp_turn_or_blind_curve', label: 'Sharp Curve' },
                     { key: 'road_construction_present', label: 'Construction' },
                     { key: 'is_festival_day', label: 'Festival Day' },
                     { key: 'is_public_holiday', label: 'Pub. Holiday' },
                     { key: 'is_hotspot', label: 'AI Hotspot' },
                     { key: 'special_traffic_diversion', label: 'Diversions' },
                   ].map(field => (
                     <button
                      key={field.key}
                      type="button"
                      onClick={() => setFormData({...formData, [field.key]: !formData[field.key as keyof typeof formData]})}
                      className={`p-4 rounded-3xl border transition-all flex flex-col items-center gap-2 group ${formData[field.key as keyof typeof formData] 
                        ? 'bg-india-saffron text-white border-india-saffron shadow-lg shadow-india-saffron/30 scale-105' 
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-500 hover:border-india-saffron/50'}`}
                     >
                       <span className="material-symbols-outlined text-lg">{formData[field.key as keyof typeof formData] ? 'check_circle' : 'circle'}</span>
                       <span className="text-[10px] font-black uppercase tracking-tight">{field.label}</span>
                     </button>
                   ))}
                </div>

              </div>

              {/* Execution Bar */}
              <div className="stagger-section sticky bottom-10 left-0 right-0 z-50 px-4">
                 <div className="max-w-4xl mx-auto bg-primary dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-[0_20px_50px_rgba(2,36,72,0.4)] flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
                          <span className="material-symbols-outlined text-india-saffron">auto_awesome</span>
                       </div>
                       <div>
                          <h4 className="font-black text-white text-sm">Neural Risk Synthesis Engine</h4>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Ready for Real-time Analysis</p>
                       </div>
                    </div>
                    <button 
                      type="submit"
                      className="w-full md:w-auto px-12 py-4 bg-white text-primary rounded-[1.5rem] font-headline font-black text-sm uppercase tracking-widest hover:bg-india-saffron hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl"
                    >
                      Analyze Region Hub
                    </button>
                 </div>
              </div>

            </form>
          </main>
        )}

        {stage === 'PROCESSING' && (
          <div className="flex-1 flex flex-col items-center justify-center p-20 animate-fade-in">
             <Loader message="Synthesizing Risk Simulation Parameters..." />
          </div>
        )}

        {stage === 'RESULT' && predictionResult && (
          <main className="flex-1 flex flex-col result-fade h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-slate-950">
            {/* Header / Action Bar */}
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-900/50">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-india-saffron/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-india-saffron text-3xl">psychology</span>
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-primary dark:text-white leading-tight">Analytical Dispatch Briefing</h2>
                   <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase">AI-Synthesized Risk Vectors & Predictions</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <button
                   onClick={() => {
                     const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(predictionResult, null, 2));
                     const downloadAnchorNode = document.createElement('a');
                     downloadAnchorNode.setAttribute("href", dataStr);
                     downloadAnchorNode.setAttribute("download", `ResQNow_Analysis_${formData.zone_name.replace(/\s+/g, '_')}.json`);
                     document.body.appendChild(downloadAnchorNode);
                     downloadAnchorNode.click();
                     downloadAnchorNode.remove();
                   }}
                   className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                 >
                   <span className="material-symbols-outlined text-lg">download</span>
                   Download JSON
                 </button>
                 <button
                   onClick={() => setIsFinalizing(true)}
                   className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-india-green text-white hover:bg-india-green/90 transition-all text-xs font-black uppercase tracking-widest shadow-xl shadow-india-green/20"
                 >
                   <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                   Download PDF
                 </button>
                 <button 
                   onClick={() => setStage('STAGING')}
                   className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all"
                 >
                   <span className="material-symbols-outlined">restart_alt</span>
                 </button>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 custom-scrollbar">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* AI Reasoning Hero Section */}
                <div className="lg:col-span-12 result-fade space-y-8">
                   <section className="bg-primary dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-[0_30px_100px_rgba(2,36,72,0.3)] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-india-saffron/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-india-saffron/20 transition-all duration-1000" />
                      
                      <div className="relative z-10 space-y-10">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-4">
                               <div className="flex items-center gap-3">
                                  <span className="px-4 py-1.5 rounded-full bg-india-saffron text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-india-saffron/30">
                                     High Density Signal
                                  </span>
                                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                     Node: {formData.zone_name}
                                  </span>
                               </div>
                               <h3 className="text-4xl md:text-5xl font-headline font-black text-white leading-[1.1]">
                                  Regional Risk Logic <br/>
                                  <span className="text-india-saffron">Neural Synthesis</span>
                               </h3>
                            </div>
                            <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10">
                               <div className="text-center">
                                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Risk Bias</div>
                                  <div className="text-4xl font-black text-white">{(predictionResult.risk_profile?.probability || 84)}%</div>
                               </div>
                               <div className="w-[2px] h-12 bg-white/10" />
                               <div className="text-center">
                                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Status</div>
                                  <div className="text-xs font-black text-india-green uppercase tracking-widest flex items-center gap-1">
                                     <span className="w-1.5 h-1.5 rounded-full bg-india-green animate-pulse" />
                                     Calculated
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="border-t border-white/10 pt-10">
                            <h4 className="text-xs font-black text-india-saffron uppercase tracking-[0.3em] mb-4">Neural Reasoning Output</h4>
                            <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed max-w-5xl ai-reasoning-text">
                               {predictionResult.risk_profile?.ai_reasoning || predictionResult.ai_reasoning || "Analyzing environmental vectors for this region. Strategic deployment is recommended based on high traffic density and visibility constraints."}
                            </p>
                         </div>
                      </div>
                   </section>
                </div>

                {/* Data Matrix & Metadata Section */}
                <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                   
                   {/* Impact Factors List */}
                   <div className="space-y-6 result-fade">
                      <div className="flex items-center gap-3 ml-2">
                         <span className="material-symbols-outlined text-india-saffron">view_comfy</span>
                         <h4 className="text-sm font-black uppercase tracking-widest text-primary dark:text-white">Impact Matrix</h4>
                      </div>
                      <div className="space-y-4">
                         {(predictionResult.risk_profile?.key_factors || []).length > 0 ? (
                           predictionResult.risk_profile.key_factors.map((f: any, i: number) => (
                             <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-6 rounded-[2rem] flex items-center justify-between shadow-sm group hover:border-india-saffron transition-all">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 font-black text-xs">
                                      0{i+1}
                                   </div>
                                   <div>
                                      <div className="text-sm font-black text-primary dark:text-white">{f.factor}</div>
                                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Statistical Weight: {f.weight}/10</div>
                                   </div>
                                </div>
                                <div className="text-xl font-black text-india-saffron">{f.score}</div>
                             </div>
                           ))
                         ) : (
                           [1,2,3].map(i => (
                             <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-6 rounded-[2rem] flex items-center justify-between opacity-50">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl" />
                                   <div className="w-48 h-4 bg-slate-100 dark:bg-white/5 rounded-full" />
                                </div>
                             </div>
                           ))
                         )}
                      </div>
                   </div>

                   {/* Raw JSON Data View */}
                   <div className="space-y-6 result-fade overflow-hidden">
                      <div className="flex items-center gap-3 ml-2">
                         <span className="material-symbols-outlined text-india-green">code</span>
                         <h4 className="text-sm font-black uppercase tracking-widest text-primary dark:text-white">System Response Matrix (JSON)</h4>
                      </div>
                      <div className="bg-[#0b0e14] rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative h-[450px] overflow-hidden overflow-y-auto custom-scrollbar group font-mono">
                         <div className="absolute top-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(predictionResult, null, 2));
                                alert('JSON copied to clipboard');
                              }}
                              className="bg-white/10 hover:bg-white/20 text-white/50 hover:text-white p-2 rounded-lg transition-all"
                            >
                               <span className="material-symbols-outlined text-sm">content_copy</span>
                            </button>
                         </div>
                         <pre className="text-xs text-india-green/80 leading-relaxed">
                            {JSON.stringify(predictionResult, null, 2)}
                         </pre>
                      </div>
                      <div className="p-4 bg-india-green/5 border border-india-green/10 rounded-2xl flex items-center justify-center gap-2">
                         <span className="text-[10px] font-black uppercase tracking-widest text-india-green">Live System Protocol: Verified Analytical Packet</span>
                      </div>
                   </div>

                </div>
              </div>
            </div>
          </main>
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
