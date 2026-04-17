'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { InformasiDasarForm, KarakteristikKPIForm, TargetValidasiForm } from '@/components/ui/FormComponents';

const BULAN = ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des'];

const INIT_FORM = {
  perspektif_bsc: '', sasaran_strategis: '', nama_kpi: '',
  definisi_kpi: '', tujuan_kpi: '', tipe_kpi: '', formula_penilaian: '', jenis_pengukuran: '',
  polaritas: '', frekuensi: '', target_jan: '', target_feb: '', target_mar: '', target_apr: '',
  target_mei: '', target_jun: '', target_jul: '', target_agt: '', target_sep: '', target_okt: '',
  target_nov: '', target_des: '', target_tahunan: '', sumber_data: '', satuan: '',
  validitas: '', nilai_maksimum: '',
};

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     color: '#6b7280', bg: '#f3f4f6' },
  submitted: { label: 'Submitted', color: '#d97706', bg: '#fef3c7' },
  reviewed:  { label: 'Reviewed',  color: '#2563eb', bg: '#dbeafe' },
  approved:  { label: 'Approved',  color: '#16a34a', bg: '#dcfce7' },
};

const B_LBL = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];

const Ico = {
  Close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Detail: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Revisi: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Export: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>,
  Back:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Warn:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

const StatBadge = ({ s }) => {
  const c = STATUS_CONFIG[s] || STATUS_CONFIG.draft;
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.c }}>{c.label}</span>;
};

// Modal Detail
function DetailModal({ k, onClose, onReview }) {
  const [ld, setLd] = useState(false);
  if (!k) return null;

  const DRow = ({ l, v }) => (
    <div className="detail-row">
      <span className="detail-key">{l}</span>
      <span className="detail-val">{v || '-'}</span>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detail Kamus KPI</h3>
          <button className="modal-close" onClick={onClose}>{Ico.Close}</button>
        </div>
        
        <div className="modal-body">
          <div className="detail-section">
            <h4>Informasi Dasar & Strategis</h4>
            <DRow l="Nama KPI" v={k.nama_kpi} />
            <DRow l="Perspektif BSC" v={k.perspektif_bsc} />
            <DRow l="Sasaran Strategis" v={k.sasaran_strategis} />
            <DRow l="Definisi KPI" v={k.definisi_kpi} />
            <DRow l="Tujuan KPI" v={k.tujuan_kpi} />
          </div>
          
          <div className="detail-section">
            <h4>Karakteristik KPI</h4>
            <DRow l="Tipe KPI" v={k.tipe_kpi} />
            <DRow l="Formula" v={k.formula_penilaian} />
            <DRow l="Jenis Pengukuran" v={k.jenis_pengukuran} />
            <DRow l="Polaritas" v={k.polaritas} />
            <DRow l="Frekuensi" v={k.frekuensi} />
          </div>
          
          <div className="detail-section">
            <h4>Target Bulanan</h4>
            <div className="target-grid-sm">
              {BULAN.map((b, i) => (
                <div key={b} className="target-cell-sm">
                  <div className="t-lbl">{B_LBL[i]}</div>
                  <div className="t-val">{k[`target_${b}`] ?? '-'}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 24, fontSize: 14, flexWrap: 'wrap' }}>
              <span style={{ color: '#7a8b9a' }}>Target Tahunan: <strong style={{ color: '#1a2b4a' }}>{k.target_tahunan ?? '-'}</strong></span>
              <span style={{ color: '#7a8b9a' }}>Satuan: <strong style={{ color: '#1a2b4a' }}>{k.satuan || '-'}</strong></span>
              <span style={{ color: '#7a8b9a' }}>Sumber: <strong style={{ color: '#1a2b4a' }}>{k.sumber_data || '-'}</strong></span>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="btn-modal btn-cancel" onClick={onClose}>Tutup</button>
          
          {k.status !== 'approved' && k.status !== 'reviewed' && (
            <button 
              className="btn-modal btn-forward" 
              onClick={async () => { 
                setLd(true); 
                await onReview(k.id, k.nama_kpi); 
                setLd(false); 
              }} 
              disabled={ld}
            >
              {ld ? <><div className="spinner-sm" /> Memproses...</> : 'Review'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MonitoringPage() {
  const [view, setView]     = useState('list');
  const [data, setData]     = useState([]);
  const [load, setLoad]     = useState(true);
  const [filter, setFilter] = useState({ q: '', stat: '' });
  const [sel, setSel]       = useState(null);

  // Form state
  const [form, setForm]               = useState(INIT_FORM);
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError]             = useState('');
  const [successMsg, setSuccessMsg]   = useState('');

  const showToast = (msg, type = 'success') => {
    Swal.fire({
      title: type === 'success' ? "Berhasil!" : "Gagal!",
      text: msg,
      icon: type === 'success' ? 'success' : 'error',
      timer: 3000,
      showConfirmButton: false
    });
  };

  const fetchKamus = async () => {
    setLoad(true);
    try {
      const r = await fetch('/api/kamus');
      const d = await r.json();
      setData(d.data || []);
    } catch {}
    finally { setLoad(false); }
  };

  useEffect(() => { if (view === 'list') fetchKamus(); }, [view]);

const handleReview = async (id, nama) => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Review',
      text: `Tandai KPI "${nama}" sebagai Reviewed dan teruskan ke manajemen?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Review',
      cancelButtonText: 'Batal'
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const r = await fetch(`/api/kamus/${id}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ status: 'reviewed' }) 
      });
      if (!r.ok) throw new Error();
      
      showToast('KPI berhasil di-review dan diteruskan ke manajemen');
      setSel(null);
      fetchKamus();
    } catch { 
      showToast('Gagal memproses KPI', 'error'); 
    }
  };

const handleRevisi = async (id, nama) => {
    const confirmResult = await Swal.fire({
      title: 'Konfirmasi Revisi',
      text: `Tandai KPI "${nama}" untuk direvisi?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Kembalikan',
      cancelButtonText: 'Batal'
    });

    if (!confirmResult.isConfirmed) return;
    
    try {
      const r = await fetch(`/api/kamus/${id}/revisi`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ status: 'revisi' }) 
      });
      
      if (!r.ok) throw new Error();
      
      showToast(`KPI "${nama}" berhasil dikembalikan untuk revisi`);
      fetchKamus();
    } catch { 
      showToast('Gagal memproses revisi KPI', 'error'); 
    }
  };

  const setFormField = (key) => (e) => {
    const val = e.target ? e.target.value : e;
    setForm(prev => {
      const updated = { ...prev, [key]: val };
      if (key.startsWith('target_') && key !== 'target_tahunan') {
        const total = BULAN.reduce((sum, b) => {
          const v = parseFloat(b === key.replace('target_', '') ? val : updated[`target_${b}`]) || 0;
          return sum + v;
        }, 0);
        updated.target_tahunan = total > 0 ? total.toFixed(2) : '';
      }
      return updated;
    });
  };

  const validate = () => {
    if (!form.nama_kpi.trim())     return 'Nama KPI wajib diisi';
    if (!form.perspektif_bsc)      return 'Perspektif BSC wajib dipilih';
    if (!form.definisi_kpi.trim()) return 'Definisi KPI wajib diisi';
    return null;
  };

  const handleSubmit = async (status) => {
    const err = validate();
    if (err) { setError(err); return; }
    setError(''); setLoadingForm(true);
    try {
      const res  = await fetch('/api/kamus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error || 'Gagal menyimpan'); return; }
      setSuccessMsg(status === 'draft' ? 'Draft berhasil disimpan!' : 'KPI berhasil ditambahkan!');
      setTimeout(() => { setView('list'); setForm(INIT_FORM); setError(''); setSuccessMsg(''); }, 1200);
    } catch { setError('Terjadi kesalahan, coba lagi'); }
    finally  { setLoadingForm(false); }
  };

  const filtered = data.filter(k =>
    (!filter.stat || k.status === filter.stat) &&
    (k.nama_kpi?.toLowerCase().includes(filter.q.toLowerCase()) ||
      k.pembuat_nama?.toLowerCase().includes(filter.q.toLowerCase()) ||
      k.perspektif_bsc?.toLowerCase().includes(filter.q.toLowerCase()))
  );

  const formatTgl = (d) => {
    if (!d) return '-';
    const date = new Date(d);
    return date.toLocaleString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    }).replace(/\./g, ':');
  };

  const S = {
    btn:    { padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: 'Plus Jakarta Sans,sans-serif', cursor: 'pointer', border: 'none', transition: 'all .2s', display: 'inline-flex', alignItems: 'center', gap: 8 },
    tblBtn: { padding: '5px 11px', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'background .15s', display: 'inline-flex', alignItems: 'center', gap: 4, textDecoration: 'none' },
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .toolbar { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
        .search-box { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #e5eaf0; border-radius: 10px; padding: 0 14px; }
        .search-box input { flex: 1; border: none; outline: 0; font-size: 14px; font-family: 'Plus Jakarta Sans',sans-serif; padding: 10px 0; background: transparent; color: #1a2b4a; }
        .search-box input::placeholder { color: #b0bcc8; }
        .filter-select { padding: 10px 14px; border: 1.5px solid #e5eaf0; border-radius: 10px; font-size: 14px; color: #374151; font-family: 'Plus Jakarta Sans',sans-serif; background: #fff; cursor: pointer; outline: 0; }
        .table-wrap { background: #fff; border-radius: 14px; box-shadow: 0 1px 8px rgba(0,0,0,.06); overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 700px; }
        th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 700; color: #7a8b9a; text-transform: uppercase; letter-spacing: .6px; background: #f8fafc; border-bottom: 1px solid #e8edf2; white-space: nowrap; }
        td { padding: 13px 16px; font-size: 14px; color: #374151; border-bottom: 1px solid #f0f4f8; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafbfc; }
        .error-box { background: #fff5f5; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; font-size: 13px; color: #dc2626; font-weight: 500; }
        .success-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; font-size: 14px; color: #15803d; font-weight: 600; text-align: center; }
        .spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.3); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; color: #fff; box-shadow: 0 4px 16px rgba(0,0,0,.15); z-index: 999; animation: slideUp .3s ease; }
        .toast.success { background: #10b981; }
        .toast.error   { background: #ef4444; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal { background: #fff; border-radius: 16px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,.2); animation: modalIn .2s ease; }
        @keyframes modalIn { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }
        .modal-header { padding: 20px 24px; border-bottom: 1px solid #f0f4f8; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 1; }
        .modal-header h3 { font-size: 16px; font-weight: 700; color: #1a2b4a; margin: 0; }
        .modal-close { width: 32px; height: 32px; border-radius: 8px; background: #f4f6f9; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .15s; }
        .modal-close:hover { background: #e8edf2; }
        .modal-body { padding: 24px; }
        .detail-section { margin-bottom: 24px; }
        .detail-section h4 { font-size: 11px; font-weight: 700; color: #7a8b9a; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f0f4f8; }
        .detail-row { display: grid; grid-template-columns: 160px 1fr; gap: 8px; margin-bottom: 10px; font-size: 14px; }
        .detail-key { color: #7a8b9a; font-weight: 500; }
        .detail-val { color: #1a2b4a; font-weight: 500; }
        .target-grid-sm { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; }
        .target-cell-sm { background: #f8fafc; border-radius: 8px; padding: 8px; text-align: center; border: 1px solid #e8edf2; }
        .target-cell-sm .t-lbl { font-size: 10px; color: #7a8b9a; font-weight: 600; }
        .target-cell-sm .t-val { font-size: 13px; font-weight: 700; color: #1a2b4a; margin-top: 2px; }
        .modal-actions { display: flex; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0f4f8; justify-content: flex-end; position: sticky; bottom: 0; background: #fff; }
        .btn-modal { padding: 10px 20px; border-radius: 9px; font-size: 14px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; border: none; transition: all .15s; display: flex; align-items: center; gap: 7px; }
        .btn-cancel { background: #f4f6f9; color: #374151; }
        .btn-cancel:hover { background: #e8edf2; }
        .btn-forward { background: #2563eb; color: #fff; }
        .btn-forward:hover { background: #1d4ed8; }
        .btn-modal:disabled { opacity: .6; cursor: not-allowed; }
        .spinner-sm { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.3); border-top-color: inherit; border-bottom-color: transparent; border-radius: 50%; animation: spin .7s linear infinite; }
      `}</style>

      {/* LIST */}
      {view === 'list' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2b4a', marginBottom: 6 }}>Katalog Kamus KPI</h1>
              <p style={{ fontSize: 14, color: '#7a8b9a' }}>Pantau status seluruh pengajuan Kamus KPI dari semua karyawan.</p>
            </div>
            <button style={{ ...S.btn, background: '#1a2b4a', color: '#fff' }}
              onClick={() => { setForm(INIT_FORM); setError(''); setSuccessMsg(''); setView('tambah'); }}
              onMouseEnter={e => e.currentTarget.style.background = '#243d6a'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a2b4a'}>
              {Ico.Plus} Tambah Kamus KPI
            </button>
          </div>

          <div className="toolbar">
            <div className="search-box">
              {Ico.Search}
              <input placeholder="Cari nama KPI, pembuat..." value={filter.q} onChange={e => setFilter(p => ({ ...p, q: e.target.value }))} />
            </div>
            <select className="filter-select" value={filter.stat} onChange={e => setFilter(p => ({ ...p, stat: e.target.value }))}>
              <option value="">Semua Status</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
            </select>
            <div style={{ padding: '10px 16px', background: '#f4f6f9', borderRadius: 10, fontSize: 13, color: '#7a8b9a', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
              <strong style={{ color: '#1a2b4a', marginRight: 4 }}>{filtered.length}</strong> KPI
            </div>
          </div>

          <div className="table-wrap">
            {load ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#7a8b9a', fontSize: 14 }}>⏳ Memuat data...</div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#7a8b9a' }}>
                <p>{filter.q || filter.stat ? 'Tidak ada hasil pencarian.' : 'Belum ada data Kamus KPI.'}</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Nama KPI</th><th>Perspektif BSC</th>
                    <th>TimeStamp</th><th>Status</th><th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((k, i) => (
                    <tr key={k.id}>
                      <td style={{ color: '#b0bcc8', fontSize: 13 }}>{i + 1}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1a2b4a' }}>{k.nama_kpi}</div>
                        {k.sasaran_strategis && <div style={{ fontSize: 12, color: '#7a8b9a', marginTop: 2 }}>{k.sasaran_strategis.substring(0, 60)}{k.sasaran_strategis.length > 60 ? '...' : ''}</div>}
                      </td>
                      <td style={{ fontSize: 13, color: '#7a8b9a' }}>{k.perspektif_bsc || '-'}</td>
                      
                      <td style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{formatTgl(k.created_at)}</td>
                      
                      <td><StatBadge s={k.status} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                          <button style={{ ...S.tblBtn, background: '#eff6ff', color: '#3b7dd8' }} onClick={() => setSel(k)}
                            onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                            onMouseLeave={e => e.currentTarget.style.background = '#eff6ff'}>
                            {Ico.Detail} Detail
                          </button>
                          {!['draft', 'rejected'].includes(k.status) && (
                            <button style={{ ...S.tblBtn, background: '#fef2f2', color: '#dc2626' }} onClick={() => handleRevisi(k.id, k.nama_kpi)}
                              onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                              onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}>
                              {Ico.Revisi} Revisi
                            </button>
                          )}
                          {k.status === 'approved' && (
                            <a href={`/api/kamus/${k.id}/export`} target="_blank" rel="noopener noreferrer"
                              style={{ ...S.tblBtn, background: '#f0fdf4', color: '#16a34a' }}>
                              {Ico.Export} Export
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* FORM TAMBAH */}
      {view === 'tambah' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2b4a', margin: 0 }}>Tambah Kamus KPI</h1>
              <p style={{ fontSize: 14, color: '#7a8b9a', margin: '4px 0 0' }}>
                Field bertanda <span style={{ color: '#dc2626' }}>*</span> wajib diisi.
              </p>
            </div>
            <button style={{ ...S.btn, background: '#f4f6f9', color: '#374151', border: '1.5px solid #e5eaf0' }}
              onClick={() => { setView('list'); setForm(INIT_FORM); setError(''); setSuccessMsg(''); }}
              onMouseEnter={e => e.currentTarget.style.background = '#e8edf2'}
              onMouseLeave={e => e.currentTarget.style.background = '#f4f6f9'}>
              {Ico.Back} Kembali
            </button>
          </div>

          <InformasiDasarForm   form={form} set={setFormField} />
          <KarakteristikKPIForm form={form} set={setFormField} />
          <TargetValidasiForm   form={form} set={setFormField} />

          {error && (
            <div className="error-box">
              {Ico.Warn} {error}
            </div>
          )}
          {successMsg && <div className="success-box">✅ {successMsg}</div>}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '20px 0' }}>
            <button style={{ ...S.btn, background: '#f4f6f9', color: '#374151', border: '1.5px solid #e5eaf0' }}
              onClick={() => handleSubmit('draft')} disabled={loadingForm}>
              Simpan Draft
            </button>
          </div>
        </div>
      )}

    <DetailModal 
        k={sel} 
        onClose={() => setSel(null)} 
        onReview={handleReview}
      />
    </>
  );
}