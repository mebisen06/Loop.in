'use client';

import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={`
        relative w-14 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500
        ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}
      `}
            aria-label="Toggle Dark Mode"
        >
            <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center relative z-10"
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                style={{
                    // x: theme === 'dark' ? 28 : 0 
                    // We use standard layout prop for auto-animating position changes if container is flex/grid, 
                    // but here we might need absolute positioning or x transform.
                    // Let's use x transform based on state for reliability.
                    x: theme === 'dark' ? '28px' : '0px'
                }}
            >
                {theme === 'light' ? (
                    <svg className="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </motion.div>
        </button>
    );
}
