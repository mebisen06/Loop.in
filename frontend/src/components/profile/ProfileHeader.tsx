'use client';

interface ProfileHeaderProps {
    user: {
        name: string;
        role: string;
        department: string;
        joinDate: string;
        initials: string;
        type: 'student' | 'faculty' | 'alum';
        isVerified?: boolean;
        email: string;
    };
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
    const getDeptColor = (dept: string) => {
        const code = dept.toLowerCase();
        if (code.includes('computer') || code.includes('cs')) return 'text-[var(--dept-cs)] bg-[var(--dept-cs)]';
        if (code.includes('electrical') || code.includes('ee')) return 'text-[var(--dept-ee)] bg-[var(--dept-ee)]';
        if (code.includes('mechanical') || code.includes('me')) return 'text-[var(--dept-me)] bg-[var(--dept-me)]';
        return 'text-slate-600 bg-slate-500';
    };

    const deptTheme = getDeptColor(user.department);
    const textColorClass = deptTheme.split(' ')[0]; // Extract just the text color part
    const bgColorClass = deptTheme.split(' ')[1];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 relative overflow-hidden group">
            {/* Decorative Background Pattern */}
            <div className={`absolute top-0 left-0 w-full h-32 opacity-[0.03] ${bgColorClass}`} />

            <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
                {/* Avatar Section */}
                <div className="relative shrink-0">
                    <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center text-4xl md:text-5xl font-bold tracking-tighter text-white shadow-xl ${bgColorClass}`}>
                        {user.initials}
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white" />
                </div>

                {/* Info Section */}
                <div className="flex-1 min-w-0 pt-2">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 tracking-tight">
                            {user.name}
                        </h1>

                        {/* Verified Badge */}
                        {user.isVerified && (
                            <span
                                className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                        bg-opacity-[0.08] ${bgColorClass} ${textColorClass}
                      `}
                            >
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified {user.type}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 mb-4">
                        <p className="text-lg md:text-xl font-medium text-slate-700 font-sans flex items-center gap-2">
                            <span className="text-slate-900">{user.department}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">{user.email}</span>
                        </p>
                        <div className="flex items-center gap-6 mt-1 text-sm text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Member since {user.joinDate}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Campus Loop
                            </span>
                        </div>
                    </div>

                    {/* Micro-Stats (Optional but cool) */}
                    <div className="flex gap-8 pt-4 border-t border-slate-50">
                        <div>
                            <p className="text-2xl font-bold text-slate-900 font-serif">12</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Posts</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 font-serif">48</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Points</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 font-serif">8</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Badges</p>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div>
                    <button className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
}
