'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     color: '#6b7280', bg: '#f3f4f6' },
  submitted: { label: 'Submitted', color: '#d97706', bg: '#fef3c7' },
  reviewed:  { label: 'Reviewed',  color: '#2563eb', bg: '#dbeafe' },
  approved:  { label: 'Approved',  color: '#16a34a', bg: '#dcfce7' },
};

const BULAN = ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des'];
const B_LBL = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];

const Ico = {
  Close: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Fwd:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Search:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Load:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V2"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>,
  Empty: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7a8b9a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  Det:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  Rev:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
  Exp:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4 }}><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
};

const CSS = `.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px}.modal{background:#fff;border-radius:16px;width:100%;max-width:680px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.2);animation:modalIn .2s ease}@keyframes modalIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}.modal-header{padding:20px 24px;border-bottom:1px solid #f0f4f8;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:1}.modal-header h3{font-size:16px;font-weight:700;color:#1a2b4a;margin:0}.modal-close{width:32px;height:32px;border-radius:8px;background:#f4f6f9;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}.modal-close:hover{background:#e8edf2}.modal-body{padding:24px}.detail-section{margin-bottom:24px}.detail-section h4{font-size:11px;font-weight:700;color:#7a8b9a;text-transform:uppercase;letter-spacing:.6px;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #f0f4f8}.detail-row{display:grid;grid-template-columns:160px 1fr;gap:8px;margin-bottom:10px;font-size:14px}.detail-key{color:#7a8b9a;font-weight:500}.detail-val{color:#1a2b4a;font-weight:500}.target-grid-sm{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.target-cell-sm{background:#f8fafc;border-radius:8px;padding:8px;text-align:center;border:1px solid #e8edf2}.target-cell-sm .t-lbl{font-size:10px;color:#7a8b9a;font-weight:600}.target-cell-sm .t-val{font-size:13px;font-weight:700;color:#1a2b4a;margin-top:2px}.modal-actions{display:flex;gap:10px;padding:16px 24px;border-top:1px solid #f0f4f8;justify-content:flex-end;position:sticky;bottom:0;background:#fff}.btn-modal{padding:10px 20px;border-radius:9px;font-size:14px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;border:none;transition:all .15s;display:flex;align-items:center;gap:7px}.btn-cancel{background:#f4f6f9;color:#374151}.btn-cancel:hover{background:#e8edf2}.btn-forward{background:#1a2b4a;color:#fff}.btn-forward:hover{background:#243d6a}.btn-modal:disabled{opacity:.5;cursor:not-allowed}.spinner-sm{width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:inherit;border-bottom-color:transparent;border-radius:50%;animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.page-header{margin-bottom:24px}.page-header h1{font-size:22px;font-weight:700;color:#1a2b4a;margin-bottom:6px}.page-header p{font-size:14px;color:#7a8b9a;margin:0}.tab-bar{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}.tab{padding:8px 16px;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #e5eaf0;background:#fff;color:#7a8b9a;transition:all .15s;display:flex;align-items:center;gap:7px}.tab.active{background:#1a2b4a;color:#fff;border-color:#1a2b4a}.tab-count{padding:1px 7px;border-radius:10px;font-size:11px;font-weight:700;background:rgba(255,255,255,.2)}.tab:not(.active) .tab-count{background:#f0f4f8;color:#374151}.toolbar{display:flex;gap:12px;margin-bottom:16px}.search-box{flex:1;display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid #e5eaf0;border-radius:10px;padding:0 14px}.search-box input{flex:1;border:none;outline:0;font-size:14px;padding:10px 0;font-family:'Plus Jakarta Sans',sans-serif;background:0 0;color:#1a2b4a}.search-box input::placeholder{color:#b0bcc8}.table-wrap{background:#fff;border-radius:14px;box-shadow:0 1px 8px rgba(0,0,0,.06);overflow:hidden}table{width:100%;border-collapse:collapse}th{text-align:left;padding:11px 16px;font-size:11px;font-weight:700;color:#7a8b9a;text-transform:uppercase;letter-spacing:.6px;background:#f8fafc;border-bottom:1px solid #e8edf2}td{padding:13px 16px;font-size:14px;color:#374151;border-bottom:1px solid #f0f4f8;vertical-align:middle}tr:last-child td{border-bottom:none}tr:hover td{background:#fafbfc}.kpi-name{font-weight:600;color:#1a2b4a}.kpi-sub{font-size:12px;color:#7a8b9a;margin-top:2px}.btn-action-group{display:flex;gap:6px}.btn-detail,.btn-table-revisi,.btn-export{padding:5px 14px;border-radius:7px;font-size:12px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:background .15s;display:inline-flex;align-items:center;gap:4px;border:none}.btn-detail{background:#eff6ff;color:#3b7dd8}.btn-detail:hover{background:#dbeafe}.btn-table-revisi{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}.btn-table-revisi:hover{background:#fee2e2}.btn-export{background:#fff;border:1px solid #e5eaf0;color:#16a34a;text-decoration:none;padding:5px 10px}.btn-export:hover{background:#f9fafb;border-color:#d1d5db}.empty,.loading{text-align:center;padding:60px;color:#7a8b9a;display:flex;align-items:center;justify-content:center;gap:8px}.toast{position:fixed;bottom:24px;right:24px;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:500;color:#fff;box-shadow:0 4px 16px rgba(0,0,0,.15);z-index:999;animation:slideUp .3s ease}.toast.success{background:#10b981}.toast.error{background:#ef4444}@keyframes slideUp{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}`;

const StatBadge = ({ s }) => {
  const c = STATUS_CONFIG[s] || { l: s, c: '#6b7280', bg: '#f3f4f6' };
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.c, whiteSpace: 'nowrap' }}>{c.l}</span>;
};

// ─── MODAL DETAIL ────────────────────────────────────────────────
function DetailModal({ k, onClose, onSubmit }) {
  const [ld, setLd] = useState(false);
  if (!k) return null;
  const DRow = ({ l, v }) => <div className="detail-row"><span className="detail-key">{l}</span><span className="detail-val">{v || '-'}</span></div>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><h3>Detail Kamus KPI</h3><button className="modal-close" onClick={onClose}>{Ico.Close}</button></div>
        <div className="modal-body">
          <div className="detail-section">
            <h4>Informasi Dasar & Strategis</h4>
            <DRow l="Nama KPI" v={k.nama_kpi} /><DRow l="Perspektif BSC" v={k.perspektif_bsc} /><DRow l="Sasaran Strategis" v={k.sasaran_strategis} />
            <DRow l="Definisi KPI" v={k.definisi_kpi} /><DRow l="Tujuan KPI" v={k.tujuan_kpi} /><DRow l="Dibuat Oleh" v={`${k.pembuat_nama} — ${k.pembuat_unit}`} />
          </div>
          <div className="detail-section">
            <h4>Karakteristik KPI</h4>
            <DRow l="Tipe KPI" v={k.tipe_kpi} /><DRow l="Formula" v={k.formula_penilaian} /><DRow l="Jenis Pengukuran" v={k.jenis_pengukuran} />
            <DRow l="Polaritas" v={k.polaritas} /><DRow l="Frekuensi" v={k.frekuensi} />
          </div>
          <div className="detail-section">
            <h4>Target Bulanan</h4>
            <div className="target-grid-sm">
              {BULAN.map((b, i) => <div key={b} className="target-cell-sm"><div className="t-lbl">{B_LBL[i]}</div><div className="t-val">{k[`target_${b}`] ?? '-'}</div></div>)}
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
          {k.status === 'submitted' && (
            <button className="btn-modal btn-forward" onClick={async () => { setLd(true); await onSubmit(k.id, 'forward'); setLd(false); }} disabled={ld}>
              {ld ? <><div className="spinner-sm" /> Memproses...</> : <>{Ico.Fwd} Reviewed</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────
export default function KeyPartnerReviewPage() {
  const [data, setData] = useState({ list: [], load: true });
  const [flt, setFlt]   = useState({ s: '', q: '' });
  const [ui, setUi]     = useState({ sel: null, tst: null });

  const toast = (msg, type = 'success') => { setUi(p => ({ ...p, tst: { msg, type } })); setTimeout(() => setUi(p => ({ ...p, tst: null })), 3000); };

  const fetchD = async () => {
    setData(p => ({ ...p, load: true }));
    try { const r = await fetch('/api/kamus?all=true'); const d = await r.json(); setData({ list: d.data || [], load: false }); }
    catch { setData(p => ({ ...p, load: false })); }
  };
  useEffect(() => { fetchD(); }, []);

  const handleAct = async (id, act) => {
    if (act === 'revisi' && !confirm('Yakin ingin mengembalikan KPI ini untuk direvisi?')) return;
    if (act === 'forward' && !confirm('Yakin ingin meneruskan KPI ini ke Manajemen?')) return;
    try {
      const r = await fetch(`/api/kamus/${id}/approve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: act }) });
      if (!r.ok) throw new Error((await r.json()).error || 'Gagal memproses');
      toast(act === 'forward' ? 'KPI diteruskan ke Manajemen!' : 'KPI dikembalikan ke karyawan untuk revisi!');
      setUi(p => ({ ...p, sel: null })); fetchD();
    } catch (e) { toast(e.message, 'error'); }
  };

  const { list, load } = data;
  const fltd = list.filter(k => (!flt.s || k.status === flt.s) && (k.nama_kpi?.toLowerCase().includes(flt.q.toLowerCase()) || k.pembuat_nama?.toLowerCase().includes(flt.q.toLowerCase())));
  const c = { drf: list.filter(k => k.status === 'draft').length, sub: list.filter(k => k.status === 'submitted').length, app: list.filter(k => k.status === 'approved').length };
  const fmtTgl = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

  return (
    <>
      <style>{CSS}</style>
      <div>
        <div className="page-header">
          <h1>Review Kamus KPI</h1>
          <p>Periksa pengajuan KPI dari karyawan. Teruskan ke Manajemen atau kembalikan (revisi).</p>
        </div>

        <div className="tab-bar">
          {[{ k: '', l: 'Semua', c: list.length }, { k: 'draft', l: 'Draft', c: c.drf }, { k: 'submitted', l: 'Review', c: c.sub }, { k: 'approved', l: 'Approve', c: c.app }].map(t => (
            <button key={t.k} className={`tab ${flt.s === t.k ? 'active' : ''}`} onClick={() => setFlt(p => ({ ...p, s: t.k }))}>{t.l}<span className="tab-count">{t.c}</span></button>
          ))}
        </div>

        <div className="toolbar">
          <div className="search-box">{Ico.Search}<input placeholder="Cari nama KPI atau pembuat..." value={flt.q} onChange={e => setFlt(p => ({ ...p, q: e.target.value }))} /></div>
        </div>

        <div className="table-wrap">
          {load ? <div className="loading">{Ico.Load} Memuat data...</div> : 
            fltd.length === 0 ? <div className="empty"><div>{Ico.Empty}</div><p>Tidak ada data KPI yang sesuai pencarian/filter.</p></div> : 
          (
            <table>
              <thead><tr><th>#</th><th>Nama KPI</th><th>Perspektif BSC</th><th>Dibuat Oleh</th><th>Tanggal</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody>
                {fltd.map((k, i) => (
                  <tr key={k.id}>
                    <td style={{ color: '#b0bcc8', fontSize: 13 }}>{i + 1}</td>
                    <td><div className="kpi-name">{k.nama_kpi}</div>{k.sasaran_strategis && <div className="kpi-sub">{k.sasaran_strategis.substring(0, 50)}...</div>}</td>
                    <td style={{ fontSize: 13, color: '#7a8b9a' }}>{k.perspektif_bsc || '-'}</td>
                    <td><div style={{ fontWeight: 500 }}>{k.pembuat_nama || '-'}</div><div style={{ fontSize: 12, color: '#7a8b9a' }}>{k.pembuat_unit || '-'}</div></td>
                    <td style={{ fontSize: 13, whiteSpace: 'nowrap' }}>{fmtTgl(k.created_at)}</td>
                    <td><StatBadge s={k.status} /></td>
                    <td>
                      <div className="btn-action-group">
                        <button className="btn-detail" onClick={() => setUi(p => ({ ...p, sel: k }))}>{Ico.Det} Detail</button>
                        <button className="btn-table-revisi" onClick={() => handleAct(k.id, 'revisi')}>{Ico.Rev} Revisi</button>
                        {k.status === 'approved' && <a href={`/api/kamus/${k.id}/export`} target="_blank" rel="noopener noreferrer" className="btn-export" title="Print/Export PDF">{Ico.Exp} Export</a>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <DetailModal k={ui.sel} onClose={() => setUi(p => ({ ...p, sel: null }))} onSubmit={handleAct} />
      {ui.tst && <div className={`toast ${ui.tst.type}`}>{ui.tst.msg}</div>}
    </>
  );
}