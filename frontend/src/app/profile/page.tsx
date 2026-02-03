'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCurrentUser } from '@/lib/api';
import { User } from '@/types';
import UserAvatar from '@/components/common/UserAvatar';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        getCurrentUser().then(userData => {
            if (!userData) {
                router.push('/login');
                return;
            }
            setUser(userData);
            setLoading(false);
        });
    }, [router]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;
    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1c1c1f] rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
                {/* Header/Cover */}
                <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600"></div>

                <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-6">
                        <UserAvatar
                            user={user}
                            size="xl"
                            className="border-4 border-white dark:border-[#1c1c1f] shadow-lg"
                        />
                        <button
                            className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-slate-50 transition-colors"
                            onClick={() => router.push('/profile/edit')}
                        >
                            Edit Profile
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                {user.username || 'No Username'}
                                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {user.role}
                                </span>
                            </h1>
                            <p className="text-slate-500 font-medium">{user.full_name || user.email}</p>
                        </div>

                        <div className="flex gap-6 text-sm">
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 dark:text-white">Enrollment</span>
                                <span className="text-slate-600 dark:text-slate-400">{user.enrollment_number || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 dark:text-white">Department</span>
                                <span className="text-slate-600 dark:text-slate-400">{user.department || 'General'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-slate-900 dark:text-white">Joined</span>
                                <span className="text-slate-600 dark:text-slate-400">{new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">About</h3>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                {user.bio || "No bio yet."}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
