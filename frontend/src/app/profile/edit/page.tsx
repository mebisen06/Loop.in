'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile } from '@/lib/api';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const DEPARTMENTS = ['CS', 'IT', 'EE', 'ME', 'CE', 'General'];

export default function EditProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();
    const { showToast } = useToast();
    const { refreshUser } = useAuth();

    // Form State
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [department, setDepartment] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');

    useEffect(() => {
        getCurrentUser().then(userData => {
            if (!userData) {
                router.push('/login');
                return;
            }
            setUser(userData);
            setFullName(userData.full_name || '');
            setUsername(userData.username || '');
            setBio(userData.bio || '');
            setDepartment(userData.department || '');
            setPhotoUrl(userData.profile_photo_url || '');
            setLoading(false);
        });
    }, [router]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Username validation
        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-z0-9_]+$/.test(username)) {
            newErrors.username = 'Username can only contain lowercase letters, numbers, and underscores';
        }

        // Full name validation (optional but if provided, validate)
        if (fullName && fullName.length > 100) {
            newErrors.fullName = 'Full name is too long';
        }

        // Bio validation
        if (bio && bio.length > 500) {
            newErrors.bio = 'Bio must be under 500 characters';
        }

        // Photo URL validation
        if (photoUrl && !photoUrl.match(/^https?:\/\/.+\..+/)) {
            newErrors.photoUrl = 'Please enter a valid URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showToast('Please fix the errors below', 'error');
            return;
        }

        setSaving(true);
        try {
            await updateProfile({
                full_name: fullName || undefined,
                username: username.toLowerCase(),
                bio: bio || undefined,
                department: department || undefined,
                profile_photo_url: photoUrl || undefined
            });

            // Refresh global auth state
            await refreshUser();

            showToast("Profile updated successfully!", "success");
            router.push('/profile');
        } catch (error: any) {
            console.error("Failed to update profile", error);
            const msg = error.response?.data?.detail || "Failed to update profile";

            // Handle specific errors
            if (msg.toLowerCase().includes('username')) {
                setErrors(prev => ({ ...prev, username: msg }));
            }

            showToast(msg, "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-4 text-slate-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Profile</h1>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1c1c1f] p-8 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">

                    {/* Profile Photo URL */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Profile Photo URL
                        </label>
                        <input
                            type="url"
                            className={`w-full px-4 py-3 rounded-lg border ${errors.photoUrl ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                            value={photoUrl}
                            onChange={(e) => setPhotoUrl(e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                        />
                        {errors.photoUrl && <p className="text-red-500 text-xs mt-1">{errors.photoUrl}</p>}
                        <p className="text-xs text-slate-500 mt-1">Paste a direct link to your profile image</p>
                    </div>

                    {/* Username & Full Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.username ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                required
                                minLength={3}
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Department
                        </label>
                        <select
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                            Bio
                            <span className="font-normal text-slate-400 ml-2">({bio.length}/500)</span>
                        </label>
                        <textarea
                            className={`w-full px-4 py-3 rounded-lg border ${errors.bio ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none`}
                            value={bio}
                            onChange={(e) => setBio(e.target.value.slice(0, 500))}
                            placeholder="Tell us about yourself..."
                        />
                        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-2.5 rounded-lg font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2.5 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
