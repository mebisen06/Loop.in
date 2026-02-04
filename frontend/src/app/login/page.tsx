'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import MagneticButton from '@/components/common/MagneticButton';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [enrollment, setEnrollment] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setError('');
        try {
            const { data } = await api.get('/auth/google/url');
            // Redirect to Google's OAuth page
            window.location.href = data.url;
        } catch (err: any) {
            setError('Could not initiate Google login. Please try again.');
            setGoogleLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isRegister ? '/auth/register' : '/auth/login';
        const payload = isRegister
            ? { email, password, enrollment_number: enrollment, username }
            : { email, password };

        try {
            const { data } = await api.post(endpoint, payload);
            localStorage.setItem('token', data.access_token);
            router.push('/');
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.detail || 'Authentication failed');
            } else {
                setError('Network error. Is the backend running?');
            }
        } finally {
            setLoading(false);
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 300, damping: 24 }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30 dark:opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Login Card */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative bg-[#1a1a1a] rounded-xl shadow-2xl w-full max-w-md p-8 md:p-10 border border-gray-800"
            >
                {/* Logo & Heading */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                        Loop.in
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                        A place to share knowledge and better understand your campus
                    </p>
                </motion.div>

                {/* Error Message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-red-900/20 text-red-400 px-4 py-3 rounded-md mb-6 text-sm border border-red-800 overflow-hidden"
                        >
                            <strong className="font-medium">Error:</strong> {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* OAuth Buttons */}
                <motion.div variants={itemVariants} className="space-y-3 mb-6">
                    <MagneticButton
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors duration-150 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {googleLoading ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        )}
                        Continue with Google
                    </MagneticButton>
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-[#1a1a1a] text-gray-500 font-medium">or continue with email</span>
                    </div>
                </motion.div>

                {/* Email/Password Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <motion.div variants={itemVariants}>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 text-sm bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 focus:scale-[1.01] disabled:opacity-50"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </motion.div>

                    {/* Enrollment & Username (Register Only) */}
                    <AnimatePresence>
                        {isRegister && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden space-y-4"
                            >
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        required={isRegister}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                        className="w-full px-4 py-3 text-sm bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 focus:scale-[1.01] placeholder:normal-case"
                                        placeholder="e.g. pranshu_18"
                                        minLength={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
                                        Enrollment Number
                                    </label>
                                    <input
                                        type="text"
                                        required={isRegister}
                                        value={enrollment}
                                        onChange={(e) => setEnrollment(e.target.value.toUpperCase())}
                                        className="w-full px-4 py-3 text-sm bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 focus:scale-[1.01] uppercase placeholder:normal-case"
                                        placeholder="e.g. 0827CS223055"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div variants={itemVariants}>
                        <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wide">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            disabled={loading}
                            minLength={6}
                            className="w-full px-4 py-3 text-sm bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 focus:scale-[1.01] disabled:opacity-50"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-400 hover:text-gray-300 transition-colors cursor-pointer">
                            <input type="checkbox" className="mr-2 rounded border-gray-600 bg-[#2a2a2a] text-blue-600 focus:ring-blue-500 focus:ring-offset-0" />
                            Remember me
                        </label>
                        <button type="button" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
                            Forgot password?
                        </button>
                    </motion.div>

                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 rounded-lg font-bold text-sm tracking-wide transition-all duration-200 shadow-lg ${loading
                            ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20 hover:shadow-blue-900/40'
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isRegister ? 'Creating account...' : 'Signing in...'}
                            </span>
                        ) : (
                            isRegister ? 'Create Account' : 'Sign In'
                        )}
                    </motion.button>
                </form>

                {/* Toggle Register/Login */}
                <motion.div variants={itemVariants} className="mt-8 text-center text-sm border-t border-gray-800 pt-6">
                    <span className="text-gray-400">
                        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    </span>
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        disabled={loading}
                        className="text-blue-500 font-bold hover:text-blue-400 transition-colors disabled:opacity-50 hover:underline"
                    >
                        {isRegister ? 'Sign in' : 'Sign up'}
                    </button>
                </motion.div>

                {/* Footer Links */}
                <motion.div variants={itemVariants} className="mt-6 text-center text-xs text-gray-600">
                    <div className="flex items-center justify-center gap-4">
                        <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
                        <span>•</span>
                        <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
                        <span>•</span>
                        <a href="#" className="hover:text-gray-400 transition-colors">Contact</a>
                    </div>
                </motion.div>
            </motion.div>

            {/* CSS for blob animation */}
            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                .animate-blob {
                    animation: blob 20s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}
