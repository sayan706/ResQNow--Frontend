'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-10 px-4 md:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <img
                alt="ResQNow Logo"
                className="h-8 w-auto drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                src="/logo.png"
              />
              <div className="flex flex-col">
                <span className="text-lg font-black text-primary dark:text-white font-headline leading-none">
                  ResQNow
                </span>
                <span className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">
                  AI Command Center
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              ResQNow is a next-generation emergency response platform powered by AI.
              We provide real-time risk synthesis and tactical dispatch optimization for first responders.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#022448] dark:text-white">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-500 hover:text-india-saffron transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link href="/predict" className="text-sm text-slate-500 hover:text-india-saffron transition-colors">AI Risk Analysis</Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-slate-500 hover:text-india-saffron transition-colors">Historical Logs</Link>
              </li>
            </ul>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
            &copy; {currentYear} RESQNOW PROJECT. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-india-green" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Operational System</span>
            </div>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">India Division</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
