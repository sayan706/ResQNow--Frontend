'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PredictionDetailOverlayProps {
  prediction: any;
  onClose: () => void;
}

export default function PredictionDetailOverlay({ prediction, onClose }: PredictionDetailOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { y: 50, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, delay: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  const handleClose = () => {
    if (overlayRef.current) {
      const tl = gsap.timeline({ onComplete: onClose });
      tl.to(contentRef.current, { y: 30, opacity: 0, scale: 0.95, duration: 0.3, ease: 'power2.in' })
        .to(overlayRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");
    } else {
      onClose();
    }
  };

  const risk = prediction.risk_profile || {};
  const factors = risk.key_factors || [];
  const recs = risk.recommendations || [];
  const level = (risk.level || 'Unknown').toLowerCase();

  const getRiskColor = (lvl: string) => {
    if (lvl.includes('high')) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (lvl.includes('med') || lvl.includes('moderate')) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
    return 'text-green-500 bg-green-500/10 border-green-500/20';
  };

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-8 lg:p-12">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={handleClose} />
      
      <div 
        ref={contentRef}
        className="relative w-full max-w-5xl h-[85vh] bg-surface dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-white/10 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-[0.7rem] font-black uppercase tracking-widest border ${getRiskColor(level)}`}>
                {level} Risk Assessment
              </span>
              <span className="text-on-surface-variant dark:text-slate-500 text-xs font-medium">
                {new Date(prediction.created_at).toLocaleString()}
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-headline text-primary dark:text-white">
              {prediction.zone_name} Dispatch Briefing
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all transform hover:rotate-90"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-10 bg-slate-50 dark:bg-slate-900/50">
          
          {/* Top Section: Overview & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-primary dark:text-white">
                <span className="material-symbols-outlined text-india-saffron">psychology</span>
                AI Reasoning & Analysis
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none text-on-surface-variant dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {risk.ai_reasoning}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-surface dark:bg-slate-800 p-6 rounded-2xl border border-white/5 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Risk Intensity</h4>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-primary dark:text-white">
                        {risk.probability}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-200 dark:bg-slate-700">
                    <div 
                      style={{ width: `${risk.probability}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-1000 ${
                        risk.probability > 70 ? 'bg-red-500' : risk.probability > 40 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                    />
                  </div>
                </div>
                <p className="text-[0.7rem] text-slate-500 italic mt-2">Probability of critical incident based on current environmental vectors.</p>
              </div>

              <div className="bg-surface dark:bg-slate-800 p-6 rounded-2xl border border-white/5 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Coordinates</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Latitude</span>
                    <span className="font-mono text-primary dark:text-white">{prediction.latitude}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Longitude</span>
                    <span className="font-mono text-primary dark:text-white">{prediction.longitude}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-white/5">
                    <span className="text-[0.65rem] text-slate-500 font-bold uppercase tracking-widest block mb-1">Exact Location</span>
                    <div className="flex items-center gap-2 text-primary dark:text-white font-bold text-sm">
                      <span className="material-symbols-outlined text-sm text-india-saffron">location_on</span>
                      {prediction.zone_name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-200 dark:border-white/5" />

          {/* Key Factors & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-primary dark:text-white">
                <span className="material-symbols-outlined text-india-saffron">list_alt</span>
                Impact Factors
              </h3>
              <div className="space-y-3">
                {factors.map((f: any, i: number) => (
                  <div key={i} className="bg-surface dark:bg-slate-800/50 p-4 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-primary/5 transition-colors">
                    <div>
                      <div className="text-sm font-bold text-primary dark:text-white">{f.factor}</div>
                      <div className="text-[0.65rem] text-slate-500 uppercase tracking-tighter">Weight: {f.weight}/10</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="text-lg font-black text-india-saffron">{f.score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-primary dark:text-white">
                <span className="material-symbols-outlined text-india-saffron">emergency</span>
                Recommended Actions
              </h3>
              <div className="space-y-3">
                {recs.map((r: string, i: number) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-india-green/5 dark:bg-india-green/10 border border-india-green/20 group hover:scale-[1.02] transition-transform">
                    <span className="material-symbols-outlined text-india-green text-sm mt-0.5 shrink-0">check_circle</span>
                    <p className="text-sm text-on-surface-variant dark:text-slate-300 font-medium">{r}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-surface dark:bg-slate-900 border-t border-white/5 flex justify-end gap-3 shrink-0">
          <button 
            onClick={handleClose}
            className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
          >
            Acknowledge Briefing
          </button>
        </div>
      </div>
    </div>
  );
}
