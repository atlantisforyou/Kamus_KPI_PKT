    'use client';

    // ─── SELECT ───────────────────────────────────────────────────
    // Props: label, value, onChange, placeholder, options (string[] | {value, label}[]),
    //        required, hint, error, style
    export default function Select({
    label, value, onChange, placeholder,
    options = [], required = false,
    hint, error, style = {},
    }) {
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
        <select
            value={value}
            onChange={onChange}
            style={{
            width: '100%', padding: '10px 14px',
            border: `1.5px solid ${error ? '#fca5a5' : '#e5eaf0'}`,
            borderRadius: '8px', fontSize: '14px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            color: value ? '#1a2b4a' : '#b0bcc8',
            background: error ? '#fff5f5' : '#f8fafc',
            outline: 'none', cursor: 'pointer',
            transition: 'border-color 0.2s',
            ...style,
            }}
            onFocus={e => { e.target.style.borderColor = '#3b7dd8'; }}
            onBlur={e => { e.target.style.borderColor = error ? '#fca5a5' : '#e5eaf0'; }}
        >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map(o =>
            typeof o === 'string'
                ? <option key={o} value={o}>{o}</option>
                : <option key={o.value} value={o.value}>{o.label}</option>
            )}
        </select>
        {hint && !error && <p style={{ fontSize: '12px', color: '#7a8b9a', marginTop: '4px' }}>{hint}</p>}
        {error && <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>{error}</p>}
        </div>
    );
    }