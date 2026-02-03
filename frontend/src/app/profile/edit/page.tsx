'use client';

import { useState, useEffect } from 'react';
import api, { getCurrentUser } from '@/lib/api';
import { User } from '@/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

import { useAuth } from '@/context/AuthContext';

export default function EditProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/users/me', {
                full_name: fullName,
                username,
                bio,
                department,
                profile_photo_url: photoUrl
            });
            await refreshUser(); // Update local context state
            showToast("Profile updated successfully", "success");
            router.push('/profile');
        } catch (error: any) {
            console.error("Failed to update profile", error);
            const msg = error.response?.data?.detail || "Failed to update profile";
            showToast(msg, "error");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1c1c1f] p-8 rounded-xl border border-slate-200 dark:border-slate-800 space-y-6">

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Profile Photo URL</label>
                    <input
                        type="url"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                    />
                    <p className="text-xs text-slate-500 mt-1">For now, provide a direct image link.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Department</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-900 dark:border-slate-700"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="CS, IT, Mech..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                    <textarea
                        className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 dark:bg-slate-900 dark:border-slate-700 h-32"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 rounded-lg font-bold text-slate-600 hover:bg-slate-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
