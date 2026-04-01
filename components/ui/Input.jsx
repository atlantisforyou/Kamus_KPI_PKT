    'use client';

    // ─── INPUT ────────────────────────────────────────────────────
    // Props: label, value, onChange, placeholder, type, required, hint, error, icon (JSX), style
    export default function Input({
    label, value, onChange, placeholder,
    type = 'text', required = false,
    hint, error, icon, style = {},
    }) {
    const baseStyle = {
        width: '100%', padding: icon ? '10px 14px 10px 38px' : '10px 14px',
        border: `1.5px solid ${error ? '#fca5a5' : '#e5eaf0'}`,
        borderRadius: '8px', fontSize: '14px',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        color: '#1a2b4a', background: error ? '#fff5f5' : '#f8fafc',
        outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
        ...style,
    };

    return (
        <div style={{ marginBottom: '16px' }}>
        {label && (
            <label style={{
            display: 'block', fontSize: '13px', fontWeight: '600',
            color: '#374151', marginBottom: '6px',
            }}>
            {label}{required && <span style={{ color: '#dc2626' }}> *</span>}
            </label>
        )}
        <div style={{ position: 'relative' }}>
            {icon && (
            <span style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', color: '#b0bcc8',
                display: 'flex', alignItems: 'center',
            }}>
                {icon}
            </span>
            )}
            <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={baseStyle}
            onFocus={e => {
                e.target.style.borderColor = '#3b7dd8';
                e.target.style.boxShadow = '0 0 0 3px rgba(59,125,216,0.1)';
                e.target.style.background = '#fff';
            }}
            onBlur={e => {
                e.target.style.borderColor = error ? '#fca5a5' : '#e5eaf0';
                e.target.style.boxShadow = 'none';
                e.target.style.background = error ? '#fff5f5' : '#f8fafc';
            }}
            />
        </div>
        {hint && !error && <p style={{ fontSize: '12px', color: '#7a8b9a', marginTop: '4px' }}>{hint}</p>}
        {error && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{error}</p>}
        </div>
    );
    }