import { User } from '@/types';

interface UserAvatarProps {
    user?: User | null;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export default function UserAvatar({ user, size = 'md', className = '' }: UserAvatarProps) {
    const getSizeClasses = () => {
        switch (size) {
            case 'sm': return 'w-8 h-8 text-xs';
            case 'lg': return 'w-16 h-16 text-xl';
            case 'xl': return 'w-24 h-24 text-2xl';
            default: return 'w-10 h-10 text-sm'; // md
        }
    };

    const getInitials = () => {
        if (!user) return '?';
        if (user.full_name) {
            return user.full_name
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();
        }
        if (user.username) return user.username[0].toUpperCase();
        return user.email[0].toUpperCase();
    };

    if (user?.profile_photo_url) {
        return (
            <img
                src={user.profile_photo_url}
                alt={user.username || 'User'}
                className={`rounded-full object-cover border border-slate-200 ${getSizeClasses()} ${className}`}
            />
        );
    }

    // Fallback to initials
    return (
        <div
            className={`rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center font-bold text-blue-600 border border-white shadow-sm ${getSizeClasses()} ${className}`}
        >
            {getInitials()}
        </div>
    );
}
