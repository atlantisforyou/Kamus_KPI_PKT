'use client';

const ST = {
    draft:     { l: 'Draft',     c: '#6b7280', bg: '#f3f4f6' },
    submitted: { l: 'Submitted', c: '#d97706', bg: '#fef3c7' }, 
    reviewed:  { l: 'Reviewed',  c: '#2563eb', bg: '#dbeafe' }, 
    approved:  { l: 'Approved',  c: '#16a34a', bg: '#dcfce7' },
};

export const StatusBadge = ({ status }) => {
    const { l, c, bg } = ST[status] || ST.draft;
    return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: bg, color: c, whiteSpace: 'nowrap' }}>{l}</span>;
};

const fmtTgl = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

export default function KamusTable({ data = [], loading = false, showPembuat = false, onDetail, onEdit, emptyText = 'Belum ada data KPI.' }) {
    return (
        <>
        <style>{`.kamus-table-wrap{background:#fff;border-radius:14px;box-shadow:0 1px 8px rgba(0,0,0,.06);overflow:hidden}.kamus-table{width:100%;border-collapse:collapse}.kamus-table th{text-align:left;padding:11px 16px;font-size:11px;font-weight:700;color:#7a8b9a;text-transform:uppercase;letter-spacing:.6px;background:#f8fafc;border-bottom:1px solid #e8edf2;white-space:nowrap}.kamus-table td{padding:12px 16px;font-size:14px;color:#374151;border-bottom:1px solid #f0f4f8;vertical-align:middle}.kamus-table tr:last-child td{border-bottom:none}.kamus-table tr:hover td{background:#fafbfc}.kpi-name{font-weight:600;color:#1a2b4a}.kpi-sub{font-size:12px;color:#7a8b9a;margin-top:2px}.btn-action{padding:5px 14px;border-radius:7px;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer;border:none;transition:background .15s;display:inline-flex;align-items:center;gap:5px}.btn-detail{background:#eff6ff;color:#3b7dd8}.btn-detail:hover{background:#dbeafe}.btn-edit{background:#f0fdf4;color:#16a34a}.btn-edit:hover{background:#dcfce7}.kt-empty,.kt-loading{text-align:center;padding:60px;color:#7a8b9a}.kt-loading{font-size:14px}.kt-skeleton{height:14px;background:#f0f4f8;border-radius:6px;animation:ktPulse 1.2s infinite}@keyframes ktPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

        <div className="kamus-table-wrap">
            {loading ? (
            <div className="kt-loading">
                <table className="kamus-table" style={{ opacity: 0.4 }}>
                <tbody>
                    {[...Array(4)].map((_, i) => (
                    <tr key={i}>{[...Array(5)].map((_, j) => <td key={j}><div className="kt-skeleton" style={{ width: j === 1 ? '80%' : '60%' }} /></td>)}</tr>
                    ))}
                </tbody>
                </table>
            </div>
            ) : !data.length ? (
            <div className="kt-empty"><div style={{ fontSize: 36, marginBottom: 10 }}>📋</div><p style={{ fontSize: 14 }}>{emptyText}</p></div>
            ) : (
            <table className="kamus-table">
                <thead>
                <tr>
                    <th>#</th><th>Nama KPI</th><th>Perspektif BSC</th>{showPembuat && <th>Dibuat Oleh</th>}<th>Tanggal</th><th>Status</th><th>Aksi</th>
                </tr>
                </thead>
                <tbody>
                {data.map((k, i) => (
                    <tr key={k.id}>
                    <td style={{ color: '#b0bcc8', fontSize: 13, width: 40 }}>{i + 1}</td>
                    <td>
                        <div className="kpi-name">{k.nama_kpi}</div>
                        {k.sasaran_strategis && <div className="kpi-sub">{k.sasaran_strategis.length > 50 ? k.sasaran_strategis.slice(0, 50) + '...' : k.sasaran_strategis}</div>}
                    </td>
                    <td style={{ fontSize: 13, color: '#7a8b9a' }}>{k.perspektif_bsc || '-'}</td>
                    {showPembuat && (
                        <td>
                        <div style={{ fontWeight: 500, fontSize: 13 }}>{k.pembuat_nama || '-'}</div>
                        <div style={{ fontSize: 12, color: '#7a8b9a' }}>{k.pembuat_unit || ''}</div>
                        </td>
                    )}
                    <td style={{ fontSize: 13, color: '#7a8b9a', whiteSpace: 'nowrap' }}>{fmtTgl(k.created_at)}</td>
                    <td><StatusBadge status={k.status} /></td>
                    <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                        {onDetail && <button className="btn-action btn-detail" onClick={() => onDetail(k)}>Detail</button>}
                        {onEdit && ['draft', 'rejected'].includes(k.status) && (
                            <button className="btn-action btn-edit" onClick={() => onEdit(k)}>Edit</button>
                        )}
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
        </div>
        </>
    );
}