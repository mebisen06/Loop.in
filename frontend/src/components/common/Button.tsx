import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    className = '',
    children,
    ...props
}: ButtonProps) {
    const baseStyles = 'rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed';

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const variantStyles = {
        primary: 'bg-blue-700 text-white hover:bg-blue-800 active:bg-blue-900 disabled:bg-slate-300 disabled:text-slate-500', // Kept blue-700 as it's standard, but could revert to 600 if needed. User likely meant "flatness" was bad.
        secondary: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200',
        ghost: 'text-slate-600 hover:text-blue-700 hover:bg-blue-50 active:bg-blue-100 disabled:text-slate-400 disabled:bg-transparent',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 disabled:bg-slate-300 disabled:text-slate-500',
    };

    return (
        <button
            className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    Loading...
                </span>
            ) : (
                children
            )}
        </button>
    );
}
