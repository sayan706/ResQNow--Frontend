'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import animationData from '../../Location Finding.json';

// Use dynamic import for Lottie to prevent SSR issues which often occur with canvas/lottie libs
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface LoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function Loader({ message = 'Loading...', fullScreen = false }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 bg-surface/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl animate-fade-in">
      <div className="w-32 h-32 md:w-40 md:h-40 relative">
        <Lottie 
          animationData={animationData} 
          loop={true} 
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <p className="mt-4 text-sm font-bold text-primary dark:text-white font-headline tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-overlay-in">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-12">
      {content}
    </div>
  );
}
