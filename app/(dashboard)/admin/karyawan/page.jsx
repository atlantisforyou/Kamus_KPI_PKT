'use client';

import { useState, useEffect, useMemo } from 'react';
import Swal from 'sweetalert2';

const ROLE_OPTS = [
  { value: 'user', label: 'User' }, 
  { value: 'key_partner', label: 'Key Partner' },
  { value: 'admin', label: 'Admin' }, 
  { value: 'manajemen', label: 'Manajemen' }
];

const Ico = {
  Close: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Info: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>,
  Err: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Add: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Upload: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Load: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V2"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>,
  Empty: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7a8b9a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Exp: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/><path d="M2 10h20"/></svg>,
  Col: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>,
  Dir: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Komp: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="M9 18l3-3-3-3"/></svg>,
  Dept: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  UsrAdd: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
  Chev: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  PgFirst: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>,
  PgPrev: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  PgNext: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  PgLast: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
};

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
        color: '#1a2b4a', background: '#ffffff'
      }} 
    />
    {note && <p style={{ fontSize: 11, color: '#7a8b9a', marginTop: 4 }}>{note}</p>}
  </div>
);

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

function ImportModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [s, setS] = useState({ load: false, err: '', msg: '' });

  const handleUpload = async () => {
    if (!file) return setS({ load: false, err: 'Silakan pilih file Excel (.xlsx) terlebih dahulu', msg: '' });
    
    setS({ load: true, err: '', msg: 'Membaca file dan membangun struktur organisasi. Mohon tunggu...' });
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/karyawan', { 
        method: 'POST', 
        body: formData 
      });
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Gagal mengimport file');
        onSuccess(data.message || 'Data Karyawan berhasil diimport!');
      } else {
        const textError = await res.text();
        throw new Error('Terjadi kesalahan di server. Cek Terminal VS Code.');
      }
    } catch (e) {
      setS({ load: false, err: e.message || 'Terjadi kesalahan sistem/jaringan', msg: '' });
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f4f8', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1a2b4a' }}>Import Data Karyawan</h3>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: '#f4f6f9', border: 'none', cursor: 'pointer' }}>{Ico.Close}</button>
        </div>
        
        <div style={{ padding: 24 }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#1e40af', lineHeight: 1.5 }}>
            <strong style={{ display: 'block', marginBottom: 4 }}>Format Excel (3 Kolom):</strong>
            Pastikan kolom di baris pertama bernama: <b>NPK</b>, <b>NAMA</b>, dan <b>UNIT KERJA</b>.
          </div>

          <label style={{ display: 'block', border: '2px dashed #cbd5e1', borderRadius: 10, padding: '30px 20px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', transition: 'all 0.2s', marginBottom: 20 }}>
            <input type="file" accept=".xlsx, .xls" style={{ display: 'none' }} onChange={(e) => { setFile(e.target.files[0]); setS({ load: false, err: '', msg: '' }); }} />
            <div style={{ color: '#0f4b8f', marginBottom: 8 }}>{Ico.Upload}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
              {file ? file.name : 'Klik untuk memilih file Excel'}
            </div>
            {!file && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Format didukung: .xlsx, .xls</div>}
          </label>

          {s.msg && <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#15803d' }}>{s.msg}</div>}
          {s.err && <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', display: 'flex', gap: 8, lineHeight: 1.5 }}>{Ico.Err} <span>{s.err}</span></div>}
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid #f0f4f8', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: 9, background: '#f4f6f9', border: '1.5px solid #e5eaf0', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Batal</button>
          <button onClick={handleUpload} disabled={s.load || !file} style={{ padding: '10px 20px', borderRadius: 9, background: '#10b981', border: 'none', fontSize: 14, fontWeight: 600, cursor: s.load || !file ? 'not-allowed' : 'pointer', color: '#fff', opacity: s.load || !file ? 0.7 : 1, display: 'flex', gap: 7 }}>
            {s.load ? 'Memproses...' : <>{Ico.Upload} Mulai Import</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// MAIN PAGE
const CSS = `.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;gap:12px;flex-wrap:wrap}.page-header-text h1{font-size:22px;font-weight:700;color:#1a2b4a;margin-bottom:6px}.page-header-text p{font-size:14px;color:#7a8b9a}.header-actions{display:flex;gap:10px}.btn-tambah{padding:10px 20px;background:#1a2b4a;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;display:flex;align-items:center;gap:7px;white-space:nowrap;transition:background .2s;flex-shrink:0}.btn-tambah:hover{background:#243d6a}.btn-outline{padding:10px 20px;background:#fff;color:#0f4b8f;border:1.5px solid #0f4b8f;border-radius:10px;font-size:14px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;display:flex;align-items:center;gap:7px;white-space:nowrap;transition:all .2s;flex-shrink:0}.btn-outline:hover{background:#eff6ff}.toolbar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center}.search-box{flex:1;min-width:200px;display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid #e5eaf0;border-radius:10px;padding:0 14px}.search-box input{flex:1;border:none;outline:0;font-size:14px;padding:10px 0;font-family:'Plus Jakarta Sans',sans-serif;color:#1a2b4a;background:0 0}.search-box input::placeholder{color:#b0bcc8}.filter-select{padding:10px 12px;border:1.5px solid #e5eaf0;border-radius:10px;font-size:14px;color:#374151;font-family:'Plus Jakarta Sans',sans-serif;background:#fff;cursor:pointer;outline:0}.count-badge{padding:10px 14px;background:#f4f6f9;border-radius:10px;font-size:13px;color:#7a8b9a;white-space:nowrap}.count-badge strong{color:#1a2b4a;margin-right:3px}.view-toggle{display:flex;background:#f4f6f9;border-radius:8px;padding:3px;gap:2px}.view-btn{padding:6px 14px;border-radius:6px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;color:#7a8b9a;background:0 0;transition:all .15s}.view-btn.active{background:#fff;color:#1a2b4a;box-shadow:0 1px 4px rgba(0,0,0,.08)}.group-controls{display:flex;align-items:center;gap:8px;margin-bottom:12px}.btn-xs{padding:5px 12px;border-radius:7px;border:1.5px solid #e5eaf0;font-size:12px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;color:#374151;background:#fff;cursor:pointer}.btn-xs:hover{background:#f4f6f9}.unit-group{margin-bottom:16px;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.04);border:1px solid #e8edf2;background:#fff}.unit-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:#f8fafc;cursor:pointer;transition:background .15s;user-select:none;border-bottom:1px solid #e8edf2}.unit-header:hover{background:#f1f5f9}.unit-left{display:flex;align-items:center;gap:12px}.unit-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.unit-name{font-size:15px;font-weight:700;color:#1a2b4a}.unit-count{padding:2px 8px;background:#e2e8f0;border-radius:10px;font-size:11px;font-weight:700;color:#475569}.chevron{transition:transform .2s;color:#94a3b8}.chevron.open{transform:rotate(180deg)}.table-wrap{background:#fff;overflow:hidden;border-top:1px solid #f0f4f8}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 16px;font-size:11px;font-weight:700;color:#7a8b9a;text-transform:uppercase;letter-spacing:.6px;background:#f8fafc;border-bottom:1px solid #e8edf2}td{padding:11px 16px;font-size:14px;color:#374151;border-bottom:1px solid #f0f4f8;vertical-align:middle}tr:last-child td{border-bottom:none}tr:hover td{background:#fafbfc}.role-select{padding:5px 10px;border:1.5px solid #e5eaf0;border-radius:8px;font-size:13px;font-weight:500;font-family:'Plus Jakarta Sans',sans-serif;background:#fff;cursor:pointer;outline:0;color:#374151}.role-select:focus{border-color:#3b7dd8}.btn-sm{padding:5px 12px;border-radius:7px;font-size:12px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;border:none;transition:all .15s}.btn-deactivate{background:#fff5f5;color:#dc2626}.btn-deactivate:hover{background:#fee2e2}.btn-activate{background:#f0fdf4;color:#16a34a}.btn-activate:hover{background:#dcfce7}.status-dot{width:8px;height:8px;border-radius:50%;display:inline-block;margin-right:6px}.status-dot.active{background:#10b981}.status-dot.inactive{background:#d1d5db}.pagination{display:flex;align-items:center;justify-content:center;gap:6px;margin-top:20px;flex-wrap:wrap}.page-btn{width:34px;height:34px;border-radius:8px;border:1.5px solid #e5eaf0;background:#fff;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:'Plus Jakarta Sans',sans-serif;color:#374151;transition:all .15s}.page-btn:hover:not(:disabled){background:#f4f6f9}.page-btn.active{background:#1a2b4a;color:#fff;border-color:#1a2b4a}.page-btn:disabled{opacity:.35;cursor:not-allowed}.empty,.loading{text-align:center;padding:60px;color:#7a8b9a}.toast{position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:500;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.15);z-index:999;animation:slideUp .3s ease}.toast.success{background:#10b981}.toast.error{background:#ef4444}@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`;

export default function KelolKaryawanPage() {
  const [data, setData]       = useState({ list: [], load: true });
  const [filters, setFilters] = useState({ search: '', role: '', mode: 'group', page: 1 });
  
  const [ui, setUi]           = useState({ col: {}, up: null, modalTambah: false, modalImport: false });
  const PER_PAGE = 20;

  const showToast = (msg, type = 'success') => { 
    Swal.fire({
      title: type === 'success' ? "Berhasil!" : "Gagal!",
      text: msg,
      icon: type === 'success' ? 'success' : 'error',
      timer: 3000,
      showConfirmButton: false
    });
  };
  
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

  const treeData = useMemo(() => {
    const dirs = {};
    
    filtered.forEach(k => {
      const unitName = k.unit_kerja || '';
      const lowerName = unitName.toLowerCase();

      const isTanpaHierarki = unitName && !lowerName.includes('direktorat') && !lowerName.includes('kompartemen') && !lowerName.includes('departemen');
      const isManajemenRisiko = lowerName.includes('manajemen risiko korporasi');

      if (isTanpaHierarki || isManajemenRisiko) {
        const standaloneName = 'Departemen Manajemen Risiko Korporasi';
        if (!dirs[standaloneName]) dirs[standaloneName] = { name: standaloneName, count: 0, isStandalone: true, employees: [], komps: {} };
        dirs[standaloneName].count++;
        dirs[standaloneName].employees.push(k);
        return;
      }

      let dName = k.nama_dir;
      let kName = k.nama_komp;
      let dpName = k.nama_dept;

      if (!dName && lowerName.includes('direktorat')) dName = unitName;
      if (!kName && lowerName.includes('kompartemen')) kName = unitName;
      if (!dpName && lowerName.includes('departemen')) dpName = unitName;

      if (!dName) dName = 'Direktorat / Unit Lainnya';

      if (!dirs[dName]) dirs[dName] = { name: dName, count: 0, isStandalone: false, employees: [], komps: {} };
      dirs[dName].count++;

      if (kName) {
        if (!dirs[dName].komps[kName]) dirs[dName].komps[kName] = { name: kName, count: 0, employees: [], depts: {} };
        dirs[dName].komps[kName].count++;

        if (dpName) {
          if (!dirs[dName].komps[kName].depts[dpName]) dirs[dName].komps[kName].depts[dpName] = [];
          dirs[dName].komps[kName].depts[dpName].push(k);
        } else {
          dirs[dName].komps[kName].employees.push(k); 
        }
      } else if (dpName) {
         const dummyKomp = 'Kompartemen Lainnya';
         if (!dirs[dName].komps[dummyKomp]) dirs[dName].komps[dummyKomp] = { name: dummyKomp, count: 0, employees: [], depts: {} };
         dirs[dName].komps[dummyKomp].count++;
         if (!dirs[dName].komps[dummyKomp].depts[dpName]) dirs[dName].komps[dummyKomp].depts[dpName] = [];
         dirs[dName].komps[dummyKomp].depts[dpName].push(k);
      } else {
        dirs[dName].employees.push(k);
      }
    });

    return Object.values(dirs).sort((a, b) => a.name.localeCompare(b.name)).map(d => ({
      ...d,
      kompsArray: Object.values(d.komps).sort((a, b) => a.name.localeCompare(b.name)).map(k => ({
        ...k,
        deptsArray: Object.entries(k.depts).sort((a, b) => a[0].localeCompare(b[0]))
      }))
    }));
  }, [filtered]);
  
  const totalP = Math.ceil(filtered.length / PER_PAGE);
  const paged  = filtered.slice((filters.page - 1) * PER_PAGE, filters.page * PER_PAGE);

  const toggleFolder = (key) => setUi(p => ({ ...p, col: { ...p.col, [key]: !p.col[key] } }));

  const closeAllFolders = () => {
    const allKeys = {};
    treeData.forEach(d => {
      allKeys[`dir-${d.name}`] = true;
    });
    setUi(p => ({ ...p, col: allKeys }));
  };

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

  const THead = () => <thead><tr><th>NPK</th><th>Nama</th><th>Unit Kerja</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>;
  
  const KRow = ({ k }) => (
    <tr key={k.id}>
      <td><span style={{ fontWeight: 600, color: '#1a2b4a', fontSize: 13 }}>{k.npk}</span></td>
      <td><span style={{ fontWeight: 500 }}>{k.nama}</span></td>
      <td style={{ fontSize: 13, color: '#7a8b9a' }}>{k.nama_dept || k.unit_kerja || '-'}</td>
      <td>
        <select className="role-select" value={k.role} disabled={ui.up === k.id} onChange={e => updateData(k.id, { role: e.target.value }, 'Role diubah')}>
          {ROLE_OPTS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
      </td>
      <td><span className={`status-dot ${k.is_active ? 'active' : 'inactive'}`} />{k.is_active ? 'Aktif' : 'Nonaktif'}</td>
      <td>
        <div style={{ display: 'flex', gap: 6 }}>
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
          <div className="header-actions">
            <button className="btn-tambah" onClick={() => setUi(p => ({ ...p, modalImport: true }))}>{Ico.Upload} Import Excel</button>
            <button className="btn-tambah" onClick={() => setUi(p => ({ ...p, modalTambah: true }))}>{Ico.Add} Tambah Karyawan</button>
          </div>
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
              <button className="btn-xs" onClick={closeAllFolders} style={{ display: 'flex', gap: 4 }}>{Ico.Col} Tutup Semua</button>
              <span style={{ fontSize: 13, color: '#7a8b9a' }}>{treeData.length} Grup Utama</span>
            </div>
            
            {treeData.map(dir => (
              <div key={dir.name} className="unit-group">
                <div className="unit-header" style={{ borderBottom: ui.col[`dir-${dir.name}`] ? 'none' : '1px solid #e8edf2' }} onClick={() => toggleFolder(`dir-${dir.name}`)}>
                  <div className="unit-left">
                    <div className="unit-icon" style={{ background: dir.isStandalone ? '#fff7ed' : '#e0e7ff', color: dir.isStandalone ? '#c2410c' : '#3730a3' }}>
                      {dir.isStandalone ? Ico.Dept : Ico.Dir}
                    </div>
                    <span className="unit-name">{dir.name}</span>
                    <span className="unit-count">{dir.count} orang</span>
                  </div>
                  <div className={`chevron ${!ui.col[`dir-${dir.name}`] ? 'open' : ''}`}>{Ico.Chev}</div>
                </div>

                {!ui.col[`dir-${dir.name}`] && (
                  <div style={dir.isStandalone ? {} : { padding: '16px', background: '#f8fafc' }}>
                    
                    {dir.isStandalone ? (
                      <div className="table-wrap" style={{ borderTop: 'none' }}>
                        <table><THead /><tbody>{dir.employees.map(k => <KRow key={k.id} k={k} />)}</tbody></table>
                      </div>
                    ) : (
                      <>
                        {dir.employees.length > 0 && (
                          <div className="table-wrap" style={{ border: '1px solid #cbd5e1', borderRadius: '10px', marginBottom: dir.kompsArray.length > 0 ? '16px' : '0' }}>
                            <table><THead /><tbody>{dir.employees.map(k => <KRow key={k.id} k={k} />)}</tbody></table>
                          </div>
                        )}

                        {dir.kompsArray.map(komp => (
                          <div key={komp.name} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', marginBottom: '12px', overflow: 'hidden' }}>
                            <div className="unit-header" style={{ padding: '12px 16px', background: '#fff', borderBottom: ui.col[`komp-${dir.name}-${komp.name}`] ? 'none' : '1px solid #f1f5f9' }} onClick={() => toggleFolder(`komp-${dir.name}-${komp.name}`)}>
                              <div className="unit-left">
                                <div className="unit-icon" style={{ width: 28, height: 28, background: '#f1f5f9', color: '#475569' }}>{Ico.Komp}</div>
                                <span className="unit-name" style={{ fontSize: '14px' }}>{komp.name}</span>
                                <span className="unit-count" style={{ background: '#f1f5f9' }}>{komp.count} orang</span>
                              </div>
                              <div className={`chevron ${!ui.col[`komp-${dir.name}-${komp.name}`] ? 'open' : ''}`}>{Ico.Chev}</div>
                            </div>

                            {!ui.col[`komp-${dir.name}-${komp.name}`] && (
                              <div style={{ padding: '12px', background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                                
                                {komp.employees.length > 0 && (
                                  <div className="table-wrap" style={{ border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: komp.deptsArray.length > 0 ? '12px' : '0' }}>
                                    <table><THead /><tbody>{komp.employees.map(k => <KRow key={k.id} k={k} />)}</tbody></table>
                                  </div>
                                )}

                                {komp.deptsArray.map(([deptName, mems]) => (
                                  <div key={deptName} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '8px', marginBottom: '8px', overflow: 'hidden' }}>
                                    <div className="unit-header" style={{ padding: '10px 14px', background: '#fff' }} onClick={() => toggleFolder(`dept-${dir.name}-${komp.name}-${deptName}`)}>
                                      <div className="unit-left">
                                        <div className="unit-icon" style={{ width: 24, height: 24, background: '#eff6ff', color: '#2563eb' }}>{Ico.Dept}</div>
                                        <span className="unit-name" style={{ fontSize: '13px', fontWeight: 600 }}>{deptName}</span>
                                        <span className="unit-count" style={{ background: '#eff6ff', color: '#1e40af' }}>{mems.length} orang</span>
                                      </div>
                                      <div className={`chevron ${!ui.col[`dept-${dir.name}-${komp.name}-${deptName}`] ? 'open' : ''}`}>{Ico.Chev}</div>
                                    </div>

                                    {!ui.col[`dept-${dir.name}-${komp.name}-${deptName}`] && (
                                      <div className="table-wrap" style={{ borderTop: '1px solid #f1f5f9' }}>
                                        <table><THead /><tbody>{mems.map(k => <KRow key={k.id} k={k} />)}</tbody></table>
                                      </div>
                                    )}
                                  </div>
                                ))}

                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="table-wrap"><table><THead /><tbody>{paged.map(k => <KRow key={k.id} k={k} />)}</tbody></table></div>
            {totalP > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: 1 }))} disabled={filters.page === 1}>{Ico.PgFirst}</button>
                <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: Math.max(1, p.page - 1) }))} disabled={filters.page === 1}>{Ico.PgPrev}</button>
                {Array.from({ length: Math.min(5, totalP) }, (_, i) => {
                  let p = totalP <= 5 ? i + 1 : filters.page <= 3 ? i + 1 : filters.page >= totalP - 2 ? totalP - 4 + i : filters.page - 2 + i;
                  return <button key={p} className={`page-btn ${filters.page === p ? 'active' : ''}`} onClick={() => setFilters(prev => ({ ...prev, page: p }))}>{p}</button>;
                })}
                <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: Math.min(totalP, p.page + 1) }))} disabled={filters.page === totalP}>{Ico.PgNext}</button>
                <button className="page-btn" onClick={() => setFilters(p => ({ ...p, page: totalP }))} disabled={filters.page === totalP}>{Ico.PgLast}</button>
              </div>
            )}
          </>
        )}
      </div>

      {ui.modalTambah && <TambahModal onClose={() => setUi(p => ({ ...p, modalTambah: false }))} onSuccess={(m) => { setUi(p => ({ ...p, modalTambah: false })); showToast(m); fetchAPI(); }} />}
      {ui.modalImport && <ImportModal onClose={() => setUi(p => ({ ...p, modalImport: false }))} onSuccess={(m) => { setUi(p => ({ ...p, modalImport: false })); showToast(m); fetchAPI(); }} />}
      
    </>
  );
}