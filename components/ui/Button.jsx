    'use client';

    // ─── BUTTON ───────────────────────────────────────────────────
    // Props: children, variant ('primary'|'secondary'|'danger'|'ghost'), size ('sm'|'md'|'lg'),
    //        loading, disabled, onClick, icon (JSX), style
    const VARIANTS = {
    primary:   { bg: '#1a2b4a', color: '#fff',     border: 'none',                     hover: '#243d6a' },
    secondary: { bg: '#f4f6f9', color: '#374151',  border: '1.5px solid #e5eaf0',      hover: '#e8edf2' },
    danger:    { bg: '#fff5f5', color: '#dc2626',  border: '1px solid #fecaca',        hover: '#fee2e2' },
    ghost:     { bg: 'transparent', color: '#3b7dd8', border: '1.5px solid #3b7dd8',  hover: '#eff6ff' },
    success:   { bg: '#f0fdf4', color: '#16a34a',  border: '1px solid #bbf7d0',       hover: '#dcfce7' },
    };

    const SIZES = {
    sm: { padding: '5px 12px', fontSize: '12px', borderRadius: '7px' },
    md: { padding: '10px 20px', fontSize: '14px', borderRadius: '9px' },
    lg: { padding: '12px 28px', fontSize: '15px', borderRadius: '10px' },
    };

    export default function Button({
    children, variant = 'primary', size = 'md',
    loading = false, disabled = false,
    onClick, icon, style = {},
    }) {
    const v = VARIANTS[variant] || VARIANTS.primary;
    const s = SIZES[size] || SIZES.md;

    return (
        <button
        onClick={onClick}
        disabled={disabled || loading}
        style={{
            ...s, background: v.bg, color: v.color, border: v.border,
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '600',
            cursor: disabled || loading ? 'not-allowed' : 'pointer',
            opacity: disabled || loading ? 0.5 : 1,
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            transition: 'all 0.15s',
            ...style,
        }}
        onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.background = v.hover; }}
        onMouseLeave={e => { if (!disabled && !loading) e.currentTarget.style.background = v.bg; }}
        >
        {loading ? (
            <span style={{
            width: '14px', height: '14px',
            border: `2px solid ${variant === 'primary' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
            borderTopColor: variant === 'primary' ? '#fff' : '#374151',
            borderRadius: '50%', display: 'inline-block',
            animation: 'btnSpin 0.7s linear infinite',
            }} />
        ) : icon}
        {children}
        <style>{`@keyframes btnSpin { to { transform: rotate(360deg); } }`}</style>
        </button>
    );
    }