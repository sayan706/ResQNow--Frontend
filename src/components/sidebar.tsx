'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ModeToggle } from '@/components/mode-toggle';

type Page = 'dashboard' | 'predict' | 'about' | 'history';

interface SidebarProps {
  activePage: Page;
}

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'dashboard', key: 'dashboard' as Page },
  { href: '/predict', label: 'AI Prediction', icon: 'psychology', key: 'predict' as Page },
  { href: '/about', label: 'About', icon: 'info', key: 'about' as Page },
];

export function Sidebar({ activePage }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, mounted]);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo — height exactly matches TopBar (h-16) */}
      <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <img
            alt="ResQNow Logo"
            className="h-9 w-auto drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            src="/logo.png"
          />
          <div className="flex flex-col">
            <span className="text-[0.8rem] font-extrabold text-primary dark:text-white font-headline leading-none">
              ResQNow
            </span>
            <span className="text-[0.6rem] font-semibold text-on-surface-variant dark:text-slate-500 uppercase tracking-widest leading-none mt-0.5">
              Command Center
            </span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[0.6rem] font-bold text-on-surface-variant dark:text-slate-600 uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = activePage === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                flex items-center gap-3 px-3 py-2.5 text-[0.875rem] font-medium
                transition-all duration-200 ease-in-out group rounded-xl
                ${isActive
                  ? 'bg-primary dark:bg-primary-container text-white shadow-sm'
                  : 'text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-800 hover:text-primary dark:hover:text-white'
                }
              `}
            >
              <span
                className={`material-symbols-outlined text-[1.2rem] flex-shrink-0 transition-all duration-200 ${
                  isActive
                    ? 'text-india-saffron'
                    : 'text-on-surface-variant dark:text-slate-500 group-hover:text-india-saffron group-hover:scale-110'
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-india-saffron flex-shrink-0" />}
            </Link>
          );
        })}
      </nav>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 bg-surface-container-low dark:bg-slate-950 flex-col z-50 border-r border-slate-200 dark:border-slate-800">
        <SidebarContent />
      </aside>

      {/* Mobile Hamburger — fixed, perfectly centered in the h-16 TopBar */}
      <button
        id="mobile-menu-toggle"
        aria-label="Open navigation menu"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-0 left-0 z-[60] h-16 w-14 flex items-center justify-center text-on-surface-variant dark:text-slate-200 hover:bg-surface-container dark:hover:bg-slate-800 transition-all duration-200"
      >
        <span className="material-symbols-outlined text-[1.4rem]">menu</span>
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm animate-overlay-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`
          md:hidden fixed left-0 top-0 h-full w-72 z-[60]
          bg-surface-container-low dark:bg-slate-950
          border-r border-slate-200 dark:border-slate-800 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-2 text-on-surface-variant dark:text-slate-400 hover:bg-surface-container dark:hover:bg-slate-800 rounded-lg transition-colors z-10"
        >
          <span className="material-symbols-outlined text-[1.2rem]">close</span>
        </button>
        <SidebarContent />
      </aside>
    </>
  );
}

/* ─── Top App Bar ─────────────────────────────────────────────────────────── */
interface TopBarProps {
  title?: string;
  children?: React.ReactNode;
}

export function TopBar({ title, children }: TopBarProps) {
  const [username, setUsername] = useState('Dispatcher 01');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('username');
    if (stored) {
      setUsername(stored);
    }
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.replace('/login');
  };

  return (
    /*
     * Padding matches <main> padding exactly:
     *   mobile  → px-4  (16px)
     *   md      → px-6  (24px)
     *   lg      → px-8  (32px)
     * This ensures the title left-aligns with the card grid below.
     */
    <header className="w-full h-16 sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 animate-fade-in-down flex-shrink-0">
      <div className="h-full flex items-center justify-between px-4 md:px-6 lg:px-8">

        {/* Left — mobile hamburger spacer + title/children */}
        <div className="flex items-center gap-3">
          {/* On mobile, push title right past the fixed hamburger button (w-14) */}
          <div className="w-10 flex-shrink-0 md:hidden" />
          {title && (
            <h1 className="text-xl md:text-2xl font-headline font-bold tracking-tight text-primary dark:text-white">
              {title}
            </h1>
          )}
          {children}
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-india-green/10 rounded-full border border-india-green/20">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-india-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-india-green" />
            </span>
            <span className="text-[0.65rem] font-bold text-india-green uppercase tracking-wider hidden sm:inline">Live</span>
          </div>

          {/* Notifications */}
          <button className="h-9 w-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container dark:hover:bg-slate-800 transition-colors rounded-full hover:text-india-saffron duration-200">
            <span className="material-symbols-outlined text-[1.2rem]">notifications</span>
          </button>

          {/* Mode Toggle */}
          <ModeToggle />

          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />

          {/* Avatar & Dropdown */}
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            <div 
              className="h-8 w-8 rounded-full overflow-hidden border-2 border-india-saffron/30 hover:border-india-saffron transition-colors duration-200 cursor-pointer flex-shrink-0"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                alt="User profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2erCX_OGMCP0EllWlPQX3Mlng_yDeIv4j94TFSeKU8mcumDGHHsm66DCNpFtW9ACwMN6PUnXf4G42wB_MfY5C0nuE-G8Fv1wMIUXFLIXlIlrbqJ4DTXN2qq75Bp8I-rSQahE1ARw2rGUesGfhhx1OQWj3icmZmiaLM1vjE1b_wN2Iidw_FnHFW1oX7yoq3OS7BxgMAHPDx9egOMNk4JAXhZb1DjQQKcUgh7Eod_HZafV5OmAamhjwMnzSkGNgtDQoCTyeXFQIXLWX"
              />
            </div>
            <span 
              className="font-headline text-sm font-semibold text-primary dark:text-blue-400 hidden sm:inline whitespace-nowrap cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {username}
            </span>
            
            {/* Context Dropdown Menu */}
            {dropdownOpen && (
              <div 
                className="absolute top-12 right-0 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl shadow-slate-900/10 py-2 z-50 animate-fade-in-down"
                style={{ transformOrigin: 'top right' }}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Account</p>
                </div>
                
                <Link
                  href="/history"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-india-saffron transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">history</span>
                  History
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left mt-1"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
