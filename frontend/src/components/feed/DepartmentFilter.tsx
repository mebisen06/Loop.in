'use client';

import { motion } from 'framer-motion';

interface DepartmentFilterProps {
    selectedDepartment: string;
    onSelect: (dept: string) => void;
}

const departments = [
    { code: 'ALL', label: 'All', color: 'from-slate-500 to-slate-600' },
    { code: 'CS', label: 'CS', color: 'from-teal-500 to-teal-600' },
    { code: 'IT', label: 'IT', color: 'from-purple-500 to-purple-600' },
    { code: 'EE', label: 'EE', color: 'from-amber-500 to-amber-600' },
    { code: 'ME', label: 'ME', color: 'from-blue-500 to-blue-600' },
    { code: 'CE', label: 'CE', color: 'from-rose-500 to-rose-600' },
];

export default function DepartmentFilter({ selectedDepartment, onSelect }: DepartmentFilterProps) {
    return (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">
                Filter:
            </span>
            <div className="flex items-center gap-2">
                {departments.map((dept) => {
                    const isActive = selectedDepartment === dept.code;
                    return (
                        <motion.button
                            key={dept.code}
                            onClick={() => onSelect(dept.code)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                relative px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide
                                transition-all duration-200 shrink-0
                                ${isActive
                                    ? `bg-gradient-to-r ${dept.color} text-white shadow-lg`
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                                }
                            `}
                        >
                            {dept.label}
                            {isActive && (
                                <motion.div
                                    layoutId="activePill"
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
