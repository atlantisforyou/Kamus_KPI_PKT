    'use client';

    // ─── BADGE ────────────────────────────────────────────────────
    // Props: children, color ('blue'|'green'|'red'|'yellow'|'gray'|'purple'), size ('sm'|'md')
    const COLOR_MAP = {
    blue:   { color: '#2563eb', bg: '#dbeafe' },
    green:  { color: '#16a34a', bg: '#dcfce7' },
    red:    { color: '#dc2626', bg: '#fee2e2' },
    yellow: { color: '#d97706', bg: '#fef3c7' },
    gray:   { color: '#6b7280', bg: '#f3f4f6' },
    purple: { color: '#7c3aed', bg: '#ede9fe' },
    teal:   { color: '#0d9488', bg: '#ccfbf1' },
    };

    export default function Badge({ children, color = 'gray', size = 'md', style = {} }) {
    const c = COLOR_MAP[color] || COLOR_MAP.gray;
    const padding = size === 'sm' ? '2px 7px' : '3px 10px';
    const fontSize = size === 'sm' ? '11px' : '12px';

    return (
        <span style={{
        padding, fontSize, fontWeight: '600',
        borderRadius: '20px', background: c.bg, color: c.color,
        whiteSpace: 'nowrap', display: 'inline-block', ...style,
        }}>
        {children}
        </span>
    );
    }