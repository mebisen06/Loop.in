import { clsx } from 'clsx';

interface DepartmentBadgeProps {
    deptCode: string;
}

const DEPT_CONFIG: Record<string, { label: string; colorClass: string; ringClass: string; bgClass: string }> = {
    cs: {
        label: 'Computer Science',
        colorClass: 'text-[var(--dept-cs)]',
        ringClass: 'ring-[var(--dept-cs)]',
        bgClass: 'bg-[var(--dept-cs)]'
    },
    ee: {
        label: 'Electrical Eng',
        colorClass: 'text-[var(--dept-ee)]',
        ringClass: 'ring-[var(--dept-ee)]',
        bgClass: 'bg-[var(--dept-ee)]'
    },
    me: {
        label: 'Mechanical',
        colorClass: 'text-[var(--dept-me)]',
        ringClass: 'ring-[var(--dept-me)]',
        bgClass: 'bg-[var(--dept-me)]'
    },
    ce: {
        label: 'Civil Eng',
        colorClass: 'text-[var(--dept-ce)]',
        ringClass: 'ring-[var(--dept-ce)]',
        bgClass: 'bg-[var(--dept-ce)]'
    },
    it: {
        label: 'IT',
        colorClass: 'text-[var(--dept-it)]',
        ringClass: 'ring-[var(--dept-it)]',
        bgClass: 'bg-[var(--dept-it)]'
    },
    general: {
        label: 'General',
        colorClass: 'text-slate-600',
        ringClass: 'ring-slate-400',
        bgClass: 'bg-slate-500'
    },
};

export default function DepartmentBadge({ deptCode }: DepartmentBadgeProps) {
    const code = deptCode?.toLowerCase() || 'general';
    const config = DEPT_CONFIG[code] || DEPT_CONFIG.general;

    return (
        <span
            className={clsx(
                "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ring-opacity-20 bg-opacity-[0.08]",
                config.colorClass,
                config.ringClass,
                config.bgClass
            )}
        >
            {config.label}
        </span>
    );
}
