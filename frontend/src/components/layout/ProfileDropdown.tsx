import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProfileDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    userInitials: string;
    userName: string;
    userEmail: string;
}



export default function ProfileDropdown({
    isOpen,
    onClose,
    userInitials,
    userName,
    userEmail,
}: ProfileDropdownProps) {
    const router = useRouter();
    const { logout } = useAuth();
    if (!isOpen) return null;

    return (
        <>
            {/* Invisible overlay to detect outside clicks */}
            <div
                className="fixed inset-0 z-30"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-md shadow-sm z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                {/* User info */}
                <div className="p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                            {userInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate">{userName}</p>
                            <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                        </div>
                    </div>
                </div>

                {/* Menu items */}
                <div className="py-2">
                    <a
                        href="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                        onClick={onClose}
                    >
                        <svg className="w-4 h-4 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        View Profile
                    </a>

                    <a
                        href="/profile/edit"
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-150"
                        onClick={onClose}
                    >
                        <svg className="w-4 h-4 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                    </a>

                    <div className="border-t border-slate-200 my-2"></div>

                    <button
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        onClick={() => {
                            logout();
                            onClose();
                        }}
                    >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
