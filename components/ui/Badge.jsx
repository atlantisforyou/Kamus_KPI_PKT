'use client';

const CONFIG = {
    draft:     { l: 'Draft',     bg: 'bg-gray-100', text: 'text-gray-600' },
    submitted: { l: 'Submitted', bg: 'bg-[#f97316]/10', text: 'text-[#f97316]' }, 
    reviewed:  { l: 'Reviewed',  bg: 'bg-[#1a2b4a]/10', text: 'text-[#1a2b4a]' }, 
    approved:  { l: 'Approved',  bg: 'bg-green-100', text: 'text-green-700' },
    revisi:    { l: 'Revisi',    bg: 'bg-red-100', text: 'text-red-700' },
};

export default function Badge({ status }) {
    const c = CONFIG[status?.toLowerCase()] || { l: status || 'Unknown', bg: 'bg-gray-100', text: 'text-gray-500' };
    
    return (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${c.bg} ${c.text}`}>
        {c.l}
        </span>
    );
}