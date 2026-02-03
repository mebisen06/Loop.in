'use client';

import ProfileHeader from '@/components/profile/ProfileHeader';

export default function ProfilePage() {
    // Mock user data (In real app, fetch from /api/me)
    const mockUser = {
        name: "John Doe",
        initials: "JD",
        email: "john.doe@university.edu",
        role: "Senior Student",
        type: 'student' as const,
        department: "Computer Science",
        joinDate: "September 2023",
        isVerified: true
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <ProfileHeader user={mockUser} />

            {/* Content Tabs / Body */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: About / Bio */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 font-serif">About</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Senior Computer Science student with a focus on Artificial Intelligence and Systems Architecture.
                            Currently working on a research paper about distributed systems in academic environments.
                            Always open to collaboration on open-source projects.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {['React', 'Python', 'System Design', 'UI/UX'].map(skill => (
                                <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-semibold rounded-md border border-slate-200">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Recent Activity Placeholder */}
                    <section className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 min-h-[200px] flex items-center justify-center text-slate-400">
                        <div className="text-center">
                            <p className="text-sm font-medium">Recent Activity</p>
                            <p className="text-xs mt-1">No recent posts to show</p>
                        </div>
                    </section>
                </div>

                {/* Right: Sidebar Info */}
                <div className="space-y-6">
                    <section className="bg-white p-6 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Academics</h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Major</span>
                                <span className="font-medium text-slate-900">Computer Science</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Year</span>
                                <span className="font-medium text-slate-900">Senior (4th)</span>
                            </li>
                            <li className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">GPA</span>
                                <span className="font-medium text-slate-900">3.8/4.0</span>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
