'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Loader } from '@/components/Loader';
import { buildMultiLayerMap } from '@/utils/mapBuilder';

interface MapOverlayProps {
  data: any;
  onClose: () => void;
}

export default function MapOverlay({ data, onClose }: MapOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [rawJson, setRawJson] = useState<any>(null);

  // Route all external fetches through our server-side proxy to avoid CORS
  const proxyFetch = async (url: string) => {
    const res = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error(`Proxy fetch failed (${res.status}) for: ${url}`);
    return res;
  };

  useEffect(() => {
    if (overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power3.out' }
      );
    }

    const load = async () => {
      try {
        let jsonUrl: string | null = null;
        if (data.states && Array.isArray(data.states) && data.states.length > 0) {
          const updated = data.states.find((s: any) => s.state_type === 'updated');
          const stateToUse = updated || data.states[data.states.length - 1];
          jsonUrl = stateToUse?.json_url || null;
        } else {
          jsonUrl = data.json_url || data.url || null;
        }

        if (!jsonUrl) {
          setFetchError(`No deployment data found for this project.`);
          setIsLoading(false);
          return;
        }

        const jsonRes = await proxyFetch(jsonUrl);
        if (!jsonRes.ok) throw new Error(`Data fetch failed: ${jsonRes.status}`);
        const jsonData = await jsonRes.json();
        setRawJson(jsonData);

        // Build a multi-layered HTML map
        const builtHtml = buildMultiLayerMap(jsonData, data.name || data.project_name || 'Deployment');
        setHtmlContent(builtHtml);
      } catch (err: any) {
        console.error(err);
        setFetchError(err.message || 'Unknown error loading map');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [data]);

  const handleDownloadMap = () => {
    if (!htmlContent) return;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ResQNow_Map_${(data.name || data.project_name || 'Tactical').replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0, scale: 0.95, y: 20, duration: 0.3, ease: 'power2.in',
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-overlay-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={handleClose} />

      <div
        ref={overlayRef}
        className="relative w-full h-full max-w-6xl bg-surface dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-white/10 flex flex-col"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-container/50 shrink-0">
          <div>
            <h2 className="text-xl font-bold font-headline text-primary dark:text-white">
              {data.name || data.project_name || 'Deployment Visualization'}
            </h2>
            <p className="text-xs text-on-surface-variant dark:text-slate-400 mt-1 uppercase tracking-wide">
              {isLoading ? 'Loading Map Data…' : 'Interactive Multi-Period Map'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isLoading && htmlContent && (
              <button
                onClick={handleDownloadMap}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-india-green/10 text-india-green border border-india-green/20 hover:bg-india-green/20 transition-all text-xs font-bold"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                Save HTML Map
              </button>
            )}
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-on-surface-variant hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 relative overflow-hidden bg-slate-950" style={{ minHeight: 0 }}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader message="Fetching Deployment Data…" />
            </div>
          ) : fetchError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center gap-4">
              <span className="material-symbols-outlined text-5xl text-india-saffron">warning</span>
              <p className="text-white font-bold">{fetchError}</p>
            </div>
          ) : htmlContent ? (
            <iframe
              srcDoc={htmlContent}
              className="w-full h-full border-none block"
              title="Deployment Map"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
