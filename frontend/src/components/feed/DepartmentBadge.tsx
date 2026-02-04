interface DepartmentBadgeProps {
    deptCode: string;
}

// Color mapping for department text
function getDeptColor(department: string): string {
    const code = department?.toLowerCase() || '';
    switch (code) {
        case 'cs':
        case 'computer science':
            return 'text-blue-600';
        case 'it':
            return 'text-purple-600';
        case 'ee':
        case 'electrical':
        case 'electrical eng':
            return 'text-yellow-600';
        case 'me':
        case 'mechanical':
            return 'text-orange-600';
        case 'ce':
        case 'civil':
        case 'civil eng':
            return 'text-green-600';
        default:
            return 'text-gray-600';
    }
}

// Label mapping for department display name
function getDeptLabel(department: string): string {
    const code = department?.toLowerCase() || '';
    switch (code) {
        case 'cs':
            return 'Computer Science';
        case 'it':
            return 'IT';
        case 'ee':
            return 'Electrical';
        case 'me':
            return 'Mechanical';
        case 'ce':
            return 'Civil';
        case 'general':
            return 'General';
        default:
            return department || 'General';
    }
}

export default function DepartmentBadge({ deptCode }: DepartmentBadgeProps) {
    return (
        <span className={`font-medium ${getDeptColor(deptCode)}`}>
            {getDeptLabel(deptCode)}
        </span>
    );
}
