'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

interface EnrollmentModalProps {
    isOpen: boolean;
    onSuccess: () => void;
}

export default function EnrollmentModal({ isOpen, onSuccess }: EnrollmentModalProps) {
    const [enrollment, setEnrollment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await api.put('/auth/me/enrollment', { enrollment_number: enrollment });
            onSuccess();
        } catch (err: any) {
            if (err.response) {
                setError(err.response.data.detail || 'Failed to update enrollment');
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-blue-600 p-6 text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.5 2-2 2h4c-1.5 0-2-1.116-2-2z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-white">Final Step: Verification</h2>
                    <p className="text-blue-100 text-sm mt-1">We need your Enrollment Number to give you access.</p>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-semibold text-slate-700">
                            Enrollment Number
                        </label>
                        <input
                            type="text"
                            required
                            value={enrollment}
                            onChange={(e) => setEnrollment(e.target.value.toUpperCase())}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase font-mono tracking-wide"
                            placeholder="0827CS..."
                        />
                        <p className="text-xs text-slate-500">
                            This will be your unique identity on CampusLoop.
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 focus:ring-4 focus:ring-slate-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Verifying...' : 'Complete Profile'}
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-4">
                        Having trouble? <a href="#" className="underline hover:text-slate-600">Contact Support</a>
                    </p>
                </form>
            </div>
        </div>
    );
}
