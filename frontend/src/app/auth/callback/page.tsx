'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get('code');

        if (!code) {
            setStatus('error');
            setError('No authorization code received from Google.');
            return;
        }

        // Exchange the code for our JWT
        const exchangeCode = async () => {
            try {
                const response = await api.post('/auth/google', { code });
                const { access_token } = response.data;

                // Store the token
                localStorage.setItem('token', access_token);

                setStatus('success');

                // Redirect to home after a brief delay
                setTimeout(() => {
                    router.push('/');
                }, 1000);
            } catch (err: any) {
                console.error('OAuth exchange failed:', err);
                setStatus('error');
                setError(err.response?.data?.detail || 'Authentication failed. Please try again.');
            }
        };

        exchangeCode();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
            <div className="text-center p-8">
                {status === 'loading' && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-white text-lg font-medium">Authenticating with Google...</p>
                        <p className="text-slate-400 text-sm">Please wait while we verify your identity.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-white text-lg font-medium">Authentication Successful!</p>
                        <p className="text-slate-400 text-sm">Redirecting to your feed...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-white text-lg font-medium">Authentication Failed</p>
                        <p className="text-red-400 text-sm">{error}</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
