'use client';

import { useState, useEffect, useMemo } from 'react';

const ROLE_OPTS = [
  { value: 'user', label: 'User' }, 
  { value: 'key_partner', label: 'Key Partner' },
  { value: 'admin', label: 'Admin' }, 
  { value: 'manajemen', label: 'Manajemen' }
];

// ─── ICON HELPER ──────────────────────────────────────────────
const Ico = {
  Close: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Info: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>,
  Err: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Add: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Load: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V2"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>,
  Empty: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7a8b9a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Exp: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M2 10h20"/></svg>,
  Col: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>,
  Unit: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b7dd8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  UsrAdd: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Chev: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
};

// ─── KOMPONEN INPUT (DILUAR AGAR TIDAK LOSE FOCUS) ────────────
const Fld = ({ l, req, val, onChange, ph, note }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
      {l} {req && <span style={{ color: '#dc2626' }}>*</span>}
    </label>
    <input 
      value={val} 
      onChange={onChange} 
      placeholder={ph} 
      style={{ 
        width: '100%', padding: '10px 14px', border: '1.5px solid #e5eaf0', 
        borderRadius: 8, fontSize: 14, outline: 'none', 
        color: '#1a2b4a', background: '#ffffff' // Perbaikan visibilitas teks
      }} 
    />
    {note && <p style={{ fontSize: 11, color: '#7a8b9a', marginTop: 4 }}>{note}</p>}
  </div>
);

// ─── MODAL TAMBAH KARYAWAN ────────────────────────────────────
function TambahModal({ onClose, onSuccess }) {
  const [f, setF] = useState({ npk: '', nama: '', unit_kerja: '', role: 'user' });
  const [s, setS] = useState({ load: false, err: '' });

  const set = (k) => (e) => setF(p => ({ ...p, [k]: k === 'npk' ? e.target.value.toUpperCase() : e.target.value }));
  
  const handleSubmit = async () => {
    if (!f.npk.trim() || !f.nama.trim()) return setS({ load: false, err: 'NPK dan Nama wajib diisi' });
    setS({ load: true, err: '' });
    try {
      const res = await fetch('/api/karyawan', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(f) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menambah karyawan');
      onSuccess(`Akun "${f.nama}" berhasil dibuat!`);
    } catch (e) { 
      setS({ load: false, err: e.message || 'Terjadi kesalahan' }); 
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f4f8', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a2b4a' }}>Tambah Karyawan Baru</h3>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: '#f4f6f9', border: 'none', cursor: 'pointer' }}>{Ico.Close}</button>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 13, color: '#1e40af', display: 'flex', gap: 6 }}>
            {Ico.Info} <span>Password otomatis = NPK. Login <strong>Nama + NPK</strong>.</span>
          </div>
          <Fld l="NPK" req val={f.npk} onChange={set('npk')} ph="Contoh: KP001" note="Otomatis dikonversi ke huruf kapital" />
          <Fld l="Nama Lengkap" req val={f.nama} onChange={set('nama')} ph="Contoh: Budi Santoso" note="Nama harus persis sama saat login" />
          <Fld l="Unit Kerja" val={f.unit_kerja} onChange={set('unit_kerja')} ph="Contoh: Keuangan" />
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Role <span style={{ color: '#dc2626' }}>*</span></label>
            <select 
              value={f.role} 
              onChange={set('role')} 
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5eaf0', borderRadius: 8, fontSize: 14, outline: 'none', cursor: 'pointer', color: '#1a2b4a', background: '#fff' }}
            >
              {ROLE_OPTS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          {s.err && <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626', display: 'flex', gap: 8 }}>{Ico.Err}{s.err}</div>}
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f4f8', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 9, background: '#f4f6f9', border: '1.5px solid #e5eaf0', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Batal</button>
          <button onClick={handleSubmit} disabled={s.load} style={{ padding: '10px 20px', borderRadius: 9, background: '#1a2b4a', border: 'none', fontSize: 14, fontWeight: 600, cursor: s.load ? 'not-allowed' : 'pointer', color: '#fff', opacity: s.load ? 0.7 : 1, display: 'flex', gap: 7 }}>
            {s.load ? 'Menyimpan...' : <>{Ico.UsrAdd}Buat Akun</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
const CSS = `.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;gap:12px;flex-wrap:wrap}.page-header-text h1{font-size:22px;font-weight:700;color:#1a2b4a;margin-bottom:6px}.page-header-text p{font-size:14px;color:#7a8b9a}.btn-tambah{padding:10px 20px;background:#1a2b4a;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;display:flex;align-items:center;gap:7px;white-space:nowrap;transition:background .2s;flex-shrink:0}.btn-tambah:hover{background:#243d6a}.toolbar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center}.search-box{flex:1;min-width:200px;display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid #e5eaf0;border-radius:10px;padding:0 14px}.search-box input{flex:1;border:none;outline:0;font-size:14px;padding:10px 0;font-family:'Plus Jakarta Sans',sans-serif;color:#1a2b4a;background:0 0}.search-box input::placeholder{color:#b0bcc8}.filter-select{padding:10px 12px;border:1.5px solid #e5eaf0;border-radius:10px;font-size:14px;color:#374151;font-family:'Plus Jakarta Sans',sans-serif;background:#fff;cursor:pointer;outline:0}.count-badge{padding:10px 14px;background:#f4f6f9;border-radius:10px;font-size:13px;color:#7a8b9a;white-space:nowrap}.count-badge strong{color:#1a2b4a;margin-right:3px}.view-toggle{display:flex;background:#f4f6f9;border-radius:8px;padding:3px;gap:2px}.view-btn{padding:6px 14px;border-radius:6px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;color:#7a8b9a;background:0 0;transition:all .15s}.view-btn.active{background:#fff;color:#1a2b4a;box-shadow:0 1px 4px rgba(0,0,0,.08)}.group-controls{display:flex;align-items:center;gap:8px;margin-bottom:12px}.btn-xs{padding:5px 12px;border-radius:7px;border:1.5px solid #e5eaf0;font-size:12px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;color:#374151;background:#fff;cursor:pointer}.btn-xs:hover{background:#f4f6f9}.unit-group{margin-bottom:10px;border-radius:12px;overflow:hidden;box-shadow:0 1px 6px rgba(0,0,0,.06);border:1px solid #e8edf2}.unit-header{display:flex;align-items:center;justify-content:space-between;padding:13px 18px;background:#fff;cursor:pointer;transition:background .15s;user-select:none;border-bottom:1px solid #f0f4f8}.unit-header:hover{background:#f8fafc}.unit-header.no-border{border-bottom:none}.unit-left{display:flex;align-items:center;gap:10px}.unit-icon{width:30px;height:30px;background:#eff6ff;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.unit-name{font-size:14px;font-weight:700;color:#1a2b4a}.unit-count{padding:2px 8px;background:#f0f4f8;border-radius:10px;font-size:11px;font-weight:700;color:#7a8b9a}.chevron{transition:transform .2s;color:#b0bcc8}.chevron.open{transform:rotate(180deg)}.table-wrap{background:#fff;border-radius:12px;box-shadow:0 1px 6px rgba(0,0,0,.05);overflow:hidden}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 16px;font-size:11px;font-weight:700;color:#7a8b9a;text-transform:uppercase;letter-spacing:.6px;background:#f8fafc;border-bottom:1px solid #e8edf2}td{padding:11px 16px;font-size:14px;color:#374151;border-bottom:1px solid #f0f4f8;vertical-align:middle}tr:last-child td{border-bottom:none}tr:hover td{background:#fafbfc}.role-select{padding:5px 10px;border:1.5px solid #e5eaf0;border-radius:8px;font-size:13px;font-weight:500;font-family:'Plus Jakarta Sans',sans-serif;background:#fff;cursor:pointer;outline:0;color:#374151}.role-select:focus{border-color:#3b7dd8}.role-select:disabled{opacity:.5;cursor:wait}.btn-sm{padding:5px 12px;border-radius:7px;font-size:12px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;border:none;transition:all .15s}.btn-reset{background:#eff6ff;color:#3b7dd8}.btn-reset:hover{background:#dbeafe}.btn-deactivate{background:#fff5f5;color:#dc2626}.btn-deactivate:hover{background:#fee2e2}.btn-activate{background:#f0fdf4;color:#16a34a}.btn-activate:hover{background:#dcfce7}.btn-sm:disabled{opacity:.5;cursor:not-allowed}.status-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:6px}.status-dot.active{background:#10b981}.status-dot.inactive{background:#d1d5db}.pagination{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:20px;flex-wrap:wrap}.page-btn{width:34px;height:34px;border-radius:8px;border:1.5px solid #e5eaf0;background:#fff;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;color:#374151;transition:all .15s}.page-btn:hover:not(:disabled){background:#f4f6f9}.page-btn.active{background:#1a2b4a;color:#fff;border-color:#1a2b4a}.page-btn:disabled{opacity:.35;cursor:not-allowed}.page-info{font-size:13px;color:#7a8b9a;padding:0 8px}.empty,.loading{text-align:center;padding:60px;color:#7a8b9a}.toast{position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:500;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.15);z-index:999;animation:slideUp .3s ease}.toast.success{background:#10b981}.toast.error{background:#ef4444}@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`;

export default function KelolKaryawanPage() {
  const [data, setData]       = useState({ list: [], load: true });
  const [filters, setFilters] = useState({ search: '', role: '', mode: 'group', page: 1 });
  const [ui, setUi]           = useState({ col: {}, up: null, res: null, toast: null, modal: false });
  const PER_PAGE = 20;

  const showToast = (msg, type = 'success') => { setUi(p => ({ ...p, toast: { msg, type } })); setTimeout(() => setUi(p => ({ ...p, toast: null })), 3500); };
  
  const fetchAPI = async () => {
    setData(p => ({ ...p, load: true }));
    try { 
      const r = await fetch('/api/karyawan'); 
      const d = await r.json(); 
      setData({ list: d.data || [], load: false }); 
    } catch { 
      showToast('Gagal memuat data', 'error'); 
      setData(p => ({ ...p, load: false })); 
    }
  };

  useEffect(() => { fetchAPI(); }, []);
  useEffect(() => { setFilters(p => ({ ...p, page: 1 })); }, [filters.search, filters.role]);

  const filtered = useMemo(() => data.list.filter(k => 
    (!filters.role || k.role === filters.role) && 
    (k.nama.toLowerCase().includes(filters.search.toLowerCase()) || 
     k.npk.toLowerCase().includes(filters.search.toLowerCase()) || 
     (k.unit_kerja || '').toLowerCase().includes(filters.search.toLowerCase()))
  ), [data.list, filters.search, filters.role]);

  const grouped = useMemo(() => Object.entries(filtered.reduce((m, k) => { 
    const u = k.unit_kerja?.trim() || 'Tanpa Unit Kerja'; 
    m[u] = m[u] || []; m[u].push(k); return m; 
  }, {})).sort((a, b) => a[0].localeCompare(b[0])), [filtered]);
  
  const totalP = Math.ceil(filtered.length / PER_PAGE);
  const paged  = filtered.slice((filters.page - 1) * PER_PAGE, filters.page * PER_PAGE);

  const updateData = async (id, payload, successMsg) => {
    setUi(p => ({ ...p, up: id }));
    try {
      const r = await fetch(`/api/karyawan/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error();
      setData(p => ({ ...p, list: p.list.map(k => k.id === id ? { ...k, ...payload } : k) })); 
      showToast(successMsg);
    } catch { 
      showToast('Gagal memproses', 'error'); 
    } finally { 
      setUi(p => ({ ...p, up: null })); 
    }
  };

  const handleResetPass = async (id, npk) => {
    if (!confirm(`Reset password ${npk}?`)) return;
    setUi(p => ({ ...p, res: id }));
    try { 
      const r = await fetch(`/api/karyawan/${id}/reset-password`, { method: 'POST' }); 
      if (!r.ok) throw new Error(); 
      showToast(`Password ${npk} direset`); 
    } catch { 
      showToast('Gagal reset', 'error'); 
    } finally { 
      setUi(p => ({ ...p, res: null })); 
    }
  };

  const THead = () => <thead><tr><th>NPK</th><th>Nama</th><th>Unit Kerja</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>;
  
  const KRow = ({ k }) => (
    <tr key={k.id}>
      <td><span style={{ fontWeight: 600, color: '#1a2b4a', fontSize: 13 }}>{k.npk}</span></td>
      <td><span style={{ fontWeight: 500 }}>{k.nama}</span></td>
      <td style={{ fontSize: 13, color: '#7a8b9a' }}>{k.unit_kerja || '-'}</td>
      <td>
        <select className="role-select" value={k.role} disabled={ui.up === k.id} onChange={e => updateData(k.id, { role: e.target.value }, 'Role diubah')}>
          {ROLE_OPTS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </td>
      <td><span className={`status-dot ${k.is_active ? 'active' : 'inactive'}`} />{k.is_active ? 'Aktif' : 'Nonaktif'}</td>
      <td>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn-sm btn-reset" onClick={() => handleResetPass(k.id, k.npk)} disabled={ui.res === k.id} style={{ display: 'flex', gap: 4 }}>
            {ui.res === k.id ? '...' : <>{Ico.Info} Reset</>}
          </button>
          <button className={`btn-sm ${k.is_active ? 'btn-deactivate' : 'btn-activate'}`} onClick={() => updateData(k.id, { is_active: k.is_active ? 0 : 1 }, k.is_active ? 'Dinonaktifkan' : 'Diaktifkan')} disabled={ui.up === k.id}>
            {k.is_active ? 'Nonaktifkan' : 'Aktifkan'}
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <style>{CSS}</style>
      <div>
        <div className="page-header">
          <div className="page-header-text"><h1>Kelola Karyawan</h1><p>Ubah role dan kelola akses. Total <strong>{data.list.length}</strong> karyawan.</p></div>
          <button className="btn-tambah" onClick={() => setUi(p => ({ ...p, modal: true }))}>{Ico.Add} Tambah Karyawan</button>
        </div>

        <div className="toolbar">
          <div className="search-box">{Ico.Search}<input placeholder="Cari nama, NPK..." value={filters.search} onChange={e => setFilters(p => ({ ...p, search: e.target.value }))} /></div>
          <select className="filter-select" value={filters.role} onChange={e => setFilters(p => ({ ...p, role: e.target.value }))}>
            <option value="">Semua Role</option>
            {ROLE_OPTS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <div className="count-badge"><strong>{filtered.length}</strong> karyawan</div>
          <div className="view-toggle">
            <button className={`view-btn ${filters.mode === 'group' ? 'active' : ''}`} onClick={() => setFilters(p => ({ ...p, mode: 'group' }))}>Per Unit</button>
            <button className={`view-btn ${filters.mode === 'list' ? 'active' : ''}`} onClick={() => setFilters(p => ({ ...p, mode: 'list' }))}>List</button>
          </div>
        </div>

        {data.load ? <div className="loading" style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>{Ico.Load} Memuat data...</div> : 
         filtered.length === 0 ? <div className="empty"><div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{Ico.Empty}</div><p>Tidak ada data.</p></div> : 
         filters.mode === 'group' ? (
          <>
            <div className="group-controls">
              <button className="btn-xs" onClick={() => setUi(p => ({ ...p, col: {} }))} style={{ display: 'flex', gap: 4 }}>{Ico.Exp} Buka Semua</button>
              <button className="btn-xs" onClick={() => setUi(p => ({ ...p, col: grouped.reduce((a, [u]) => ({ ...a, [u]: true }), {}) }))} style={{ display: 'flex', gap: 4 }}>{Ico.Col} Tutup Semua</button>
              <span style={{ fontSize: 13, color: '#7a8b9a' }}>{grouped.length} unit kerja</span>
            </div>
            {grouped.map(([u, mems]) => (
              <div key={u} className="unit-group">
                <div className={`unit-header ${ui.col[u] ? 'no-border' : ''}`} onClick={() => setUi(p => ({ ...p, col: { ...p.col, [u]: !p.col[u] } }))}>
                  <div className="unit-left"><div className="unit-icon">{Ico.Unit}</div><span className="unit-name">{u}</span><span className="unit-count">{mems.length} orang</span></div>
                  <div className={`chevron ${!ui.col[u] ? 'open' : ''}`}>{Ico.Chev}</div>
                </div>
                {!ui.col[u] && <table><THead /><tbody>{mems.map(k => <KRow key={k.id} k={k} />)}</tbody></table>}
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="table-wrap"><table><THead /><tbody>{paged.map(k => <KRow key={k.id} k={k} />)}</tbody></table></div>
            {totalP > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: 1 }))} disabled={filters.page === 1}>«</button>
                <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={filters.page === 1}>‹</button>
                {Array.from({ length: Math.min(5, totalP) }, (_, i) => {
                  let p = totalP <= 5 ? i + 1 : filters.page <= 3 ? i + 1 : filters.page >= totalP - 2 ? totalP - 4 + i : filters.page - 2 + i;
                  return <button key={p} className={`page-btn ${filters.page === p ? 'active' : ''}`} onClick={() => setFilters(prev => ({ ...prev, page: p }))}>{p}</button>;
                })}
                <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: Math.min(totalP, p.page + 1) }))} disabled={filters.page === totalP}>›</button>
                <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: totalP }))} disabled={filters.page === totalP}>»</button>
              </div>
            )}
          </>
        )}
      </div>

      {ui.modal && <TambahModal onClose={() => setUi(p => ({ ...p, modal: false }))} onSuccess={(m) => { setUi(p => ({ ...p, modal: false })); showToast(m); fetchAPI(); }} />}
      {ui.toast && <div className={`toast ${ui.toast.type}`}>{ui.toast.msg}</div>}
    </>
  );
}