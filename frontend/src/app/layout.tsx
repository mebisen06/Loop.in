'use client';

import { Inter, Merriweather } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import ProfileDropdown from '@/components/layout/ProfileDropdown';
import NotificationDropdown from '@/components/layout/NotificationDropdown';
import TruncatedText from '@/components/common/TruncatedText';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-serif'
});

import { ToastProvider } from '@/context/ToastContext';

import CommandPalette from '@/components/search/CommandPalette';
import { getCurrentUser } from '@/lib/api';
import EnrollmentModal from '@/components/auth/EnrollmentModal';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeToggle from '@/components/common/ThemeToggle';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Auth & Enrollment State
  const [user, setUser] = useState<any>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check current user status
    getCurrentUser().then(userData => {
      if (userData) {
        setUser({
          name: 'Anonymous', // Fallback
          initials: userData.email[0].toUpperCase(),
          email: userData.email,
          ...userData
        });
        // If user exists but no enrollment number, show modal
        if (!userData.enrollment_number) {
          setShowEnrollmentModal(true);
        }
      }
    }).catch(() => {
      // Not logged in
    });
  }, [pathname]); // Re-check on route change if needed

  // Close on ESC keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Search with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }

      // Close on ESC
      if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isSidebarOpen) setIsSidebarOpen(false);
        if (isProfileOpen) setIsProfileOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen, isProfileOpen, isSearchOpen]);

  // Prevent body scroll when sidebar is open or search modal is active
  useEffect(() => {
    if (isSidebarOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen, isSearchOpen]);



  // ...

  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${merriweather.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <div className="flex h-screen bg-[#FAFAF7] dark:bg-[#09090b] text-slate-900 dark:text-[#FAFAF7]">
                <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                <EnrollmentModal isOpen={showEnrollmentModal} onSuccess={() => {
                  setShowEnrollmentModal(false);
                  window.location.reload(); // Refresh to update state
                }} />

                {/* Overlay */}
                {isSidebarOpen && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-200"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                  />
                )}

                {/* Mobile Hamburger */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors duration-150"
                  aria-label="Toggle menu"
                >
                  <svg
                    className="w-6 h-6 text-slate-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {/* Header / Top Right Actions */}
                <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
                  <NotificationDropdown />

                  {user ? (
                    <div ref={profileRef} className="relative">
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-md hover:bg-blue-700 transition-colors duration-150 ring-2 ring-white"
                        aria-label="Open profile menu"
                      >
                        {user.initials}
                      </button>

                      <ProfileDropdown
                        isOpen={isProfileOpen}
                        onClose={() => setIsProfileOpen(false)}
                        userInitials={user.initials}
                        userName={user.name}
                        userEmail={user.email}
                      />
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Login
                    </Link>
                  )}
                </div>

                {/* Sidebar */}
                <aside
                  className={`
              w-[240px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col
              fixed md:static inset-y-0 left-0 z-50
              transform transition-transform duration-300 cubic-bezier(0.25, 0.8, 0.25, 1)
              ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
            `}
                >
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h1 className="text-xl font-bold text-slate-800 dark:text-white">Loop.in</h1>
                      <p className="text-xs text-slate-500 mt-1">Campus Community</p>
                    </div>
                    {/* Close button on mobile */}
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="md:hidden p-1 hover:bg-slate-100 rounded transition-colors duration-150"
                      aria-label="Close menu"
                    >
                      <svg
                        className="w-5 h-5 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="px-3 pb-4">
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-200 rounded-lg transition-all duration-200 group text-left"
                    >
                      <svg className="w-4 h-4 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span className="text-sm font-medium truncate flex-1">Quick Search...</span>
                      <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-sans font-medium text-slate-400 bg-white border border-slate-200 rounded-md group-hover:border-blue-200 group-hover:text-blue-500 transition-colors">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    </button>
                  </div>

                  <nav className="flex-1 px-3 py-4 space-y-0.5">
                    <div className="mb-2 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                      Community
                    </div>
                    <NavLink
                      href="/"
                      label="Feed"
                      icon={
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      }
                      isActive={pathname === '/'}
                      onClick={() => setIsSidebarOpen(false)}
                    />
                    <NavLink
                      href="/popular"
                      label="Popular"
                      icon={
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                        </svg>
                      }
                      badge="Hot"
                      badgeColor="bg-orange-50 text-orange-600 border border-orange-100"
                      isActive={pathname === '/popular'}
                      onClick={() => setIsSidebarOpen(false)}
                    />

                    <div className="mt-8 mb-2 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                      Academic Hub
                    </div>
                    <NavLink
                      href="/deadlines"
                      label="Deadlines"
                      icon={
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      }
                      badge="3 Due"
                      badgeColor="bg-red-100 text-red-700 border border-red-200 animate-pulse"
                      isActive={pathname === '/deadlines'}
                      onClick={() => setIsSidebarOpen(false)}
                    />
                    <NavLink
                      href="/academics"
                      label="Department"
                      icon={
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      }
                      isActive={pathname === '/academics'}
                      onClick={() => setIsSidebarOpen(false)}
                    />
                    <NavLink
                      href="/career"
                      label="Career Center"
                      icon={
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      }
                      badge="Now"
                      badgeColor="bg-emerald-100 text-emerald-700 border border-emerald-200"
                      isActive={pathname === '/career'}
                      onClick={() => setIsSidebarOpen(false)}
                    />

                    <div className="mt-8 mb-2 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                      Campus Life
                    </div>
                    <NavLink
                      href="/events"
                      label="Events"
                      icon={
                        <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      }
                      badge="Today"
                      isActive={pathname === '/events'}
                      onClick={() => setIsSidebarOpen(false)}
                    />
                    <div className="mt-auto px-6 py-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Appearance</span>
                        <ThemeToggle />
                      </div>

                      <Link
                        href="/developers"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 group/team"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <span className="relative flex items-center justify-center">
                          <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping opacity-50 group-hover/team:opacity-100" />
                          <svg className="w-[18px] h-[18px] relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </span>
                        <span className="group-hover/team:translate-x-0.5 transition-transform">Developed by Team</span>
                      </Link>
                    </div>
                  </nav>

                  <div className="p-4 border-t border-slate-200">
                    <Link
                      href="/login"
                      onClick={() => setIsSidebarOpen(false)}
                      className={`
                    flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md transition-all duration-200 
                    ${pathname === '/login'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                        }
                  `}
                    >
                      <span className="font-medium text-sm">Login / Register</span>
                    </Link>
                  </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">
                  <div className="max-w-7xl mx-auto p-6 md:p-8 mt-16 md:mt-0">
                    {children}
                  </div>
                </main>
              </div>

            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  badge?: string | number;
  badgeColor?: string;
  icon?: React.ReactNode;
}

function NavLink({
  href,
  label,
  isActive,
  onClick,
  badge,
  badgeColor = "bg-blue-50 text-blue-600 border border-blue-100",
  icon
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 group hover:translate-x-1
        ${isActive
          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className={`flex items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors ${isActive ? 'text-blue-600' : ''}`}>
          {icon}
        </span>
        <span className="text-[13px] font-medium tracking-tight truncate flex-1 block max-w-[140px]">
          <TruncatedText text={label} maxLength={22} className="block truncate" />
        </span>
      </div>

      {badge && (
        <span className={`
          text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] shadow-sm
          ${badgeColor}
        `}>
          {badge}
        </span>
      )}
    </Link>
  );
}
