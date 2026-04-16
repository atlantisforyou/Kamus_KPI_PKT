'use client';

import { useState, useEffect } from 'react';

const STAT_CFG = {
  draft:     { l: 'Draft',     c: '#6b7280', bg: '#f3f4f6' },
  submitted: { l: 'Submitted', c: '#d97706', bg: '#fef3c7' },
  reviewed:  { l: 'Reviewed',  c: '#2563eb', bg: '#dbeafe' },
  approved:  { l: 'Approved',  c: '#16a34a', bg: '#dcfce7' },
};

function StatusBadge({ status }) {
  const s = STAT_CFG[status] || { l: status, c: '#6b7280', bg: '#f3f4f6' };
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.c, whiteSpace: 'nowrap' }}>{s.l}</span>;
}

const BULAN = ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des'];
const B_LBL = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];

const Ico = {
  Close: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Spin:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V2"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>,
  Empty: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7a8b9a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  Rev:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  App:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
};

const CSS = `.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px}.modal{background:#fff;border-radius:16px;width:100%;max-width:680px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.2);animation:modalIn .2s ease}@keyframes modalIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}.modal-header{padding:20px 24px;border-bottom:1px solid #f0f4f8;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:1}.modal-header h3{font-size:16px;font-weight:700;color:#1a2b4a;margin:0}.modal-close{width:32px;height:32px;border-radius:8px;background:#f4f6f9;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s}.modal-close:hover{background:#e8edf2}.modal-body{padding:24px}.detail-section{margin-bottom:24px}.detail-section h4{font-size:11px;font-weight:700;color:#7a8b9a;text-transform:uppercase;letter-spacing:.6px;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #f0f4f8}.detail-row{display:grid;grid-template-columns:160px 1fr;gap:8px;margin-bottom:10px;font-size:14px}.detail-key{color:#7a8b9a;font-weight:500}.detail-val{color:#1a2b4a;font-weight:500}.target-grid-sm{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.target-cell-sm{background:#f8fafc;border-radius:8px;padding:8px;text-align:center;border:1px solid #e8edf2}.target-cell-sm .t-lbl{font-size:10px;color:#7a8b9a;font-weight:600}.target-cell-sm .t-val{font-size:13px;font-weight:700;color:#1a2b4a;margin-top:2px}.modal-actions{display:flex;gap:10px;padding:16px 24px;border-top:1px solid #f0f4f8;justify-content:flex-end;position:sticky;bottom:0;background:#fff}.btn-modal{padding:10px 20px;border-radius:9px;font-size:14px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;border:none;transition:all .15s;display:flex;align-items:center;gap:7px}.btn-cancel{background:#f4f6f9;color:#374151}.btn-cancel:hover{background:#e8edf2}.page-header{margin-bottom:24px}.page-header h1{font-size:22px;font-weight:700;color:#1a2b4a;margin-bottom:6px}.page-header p{font-size:14px;color:#7a8b9a}.card{background:#fff;border-radius:14px;box-shadow:0 1px 8px rgba(0,0,0,.06);overflow:hidden}table{width:100%;border-collapse:collapse;min-width:600px}th{text-align:left;padding:12px 16px;font-size:12px;font-weight:700;color:#7a8b9a;background:#f8fafc;border-bottom:1px solid #e8edf2}td{padding:14px 16px;font-size:14px;color:#374151;border-bottom:1px solid #f0f4f8}tr:hover td{background:#fafbfc}.empty-state{text-align:center;padding:60px 20px;color:#7a8b9a;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}.action-group{display:flex;gap:8px;flex-wrap:wrap}.btn-action{padding:6px 12px;border:1px solid transparent;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;gap:4px}.btn-detail{background:#eff6ff;color:#3b7dd8}.btn-detail:hover{background:#dbeafe}.btn-revisi-tbl{background:#fef2f2;color:#dc2626;border-color:#fecaca}.btn-revisi-tbl:hover{background:#fee2e2}.btn-approve-tbl{background:#f0fdf4;color:#16a34a;border-color:#bbf7d0}.btn-approve-tbl:hover{background:#dcfce7}.btn-action:disabled{opacity:.5;cursor:not-allowed}@keyframes spin{to{transform:rotate(360deg)}}`;

// KOMPONEN MODAL DETAIL
function DetailModal({ k, onClose }) {
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
        <div className="modal-actions"><button className="btn-modal btn-cancel" onClick={onClose}>Tutup</button></div>
      </div>
    </div>
  );
}

// HALAMAN UTAMA
export default function ApprovalManajemenPage() {
  const [data, setData] = useState([]);
  const [ui, setUi]     = useState({ ld: true, proc: null, sel: null });

  const fetchD = async () => {
      setUi(p => ({ ...p, ld: true }));
      try {
        const r = await fetch('/api/kamus?status=reviewed', { cache: 'no-store' });
        const d = await r.json();
        
        setData(d.data || []); 
      } catch (e) { console.error("Gagal memuat:", e); } 
      finally { setUi(p => ({ ...p, ld: false })); }
  };

  useEffect(() => { fetchD(); }, []);

  const handleAct = async (id, act, nama) => {
    if (!confirm(`Apakah Anda yakin ingin ${act === 'approve' ? 'MENYETUJUI' : 'MENGEMBALIKAN (REVISI)'} KPI: "${nama}"?`)) return;
    setUi(p => ({ ...p, proc: id }));
    try {
      const r = await fetch(`/api/kamus/${id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: act }) });
      if (!r.ok) throw new Error((await r.json()).error || 'Gagal memproses');
      alert(act === 'approve' ? 'KPI Berhasil Disetujui!' : 'KPI Dikembalikan untuk Revisi!');
      setUi(p => ({ ...p, sel: null })); fetchD();
    } catch (e) { alert(`Terjadi kesalahan: ${e.message}`); } 
    finally { setUi(p => ({ ...p, proc: null })); }
  };

  const { ld, proc, sel } = ui;

  return (
    <>
      <style>{CSS}</style>
      <div className="page-header">
        <h1>Approval Kamus KPI</h1>
        <p>Daftar pengajuan Kamus KPI yang menunggu persetujuan akhir dari Manajemen.</p>
      </div>

      <div className="card">
        {ld ? <div className="empty-state">{Ico.Spin} Sedang memuat data pengajuan...</div> : 
         data.length === 0 ? <div className="empty-state"><div>{Ico.Empty}</div><p>Belum ada pengajuan KPI yang perlu di-approve saat ini.</p></div> : 
        (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead><tr><th>Pengaju</th><th>Nama KPI</th><th>Perspektif BSC</th><th>Aksi</th></tr></thead>
              <tbody>
                {data.map(k => (
                  <tr key={k.id}>
                    <td><div style={{ fontWeight: 600, color: '#1a2b4a', fontSize: 13 }}>{k.pembuat_nama || 'User'}</div><div style={{ fontSize: 12, color: '#7a8b9a' }}>{k.pembuat_unit || '-'}</div></td>
                    <td><div style={{ fontWeight: 600, color: '#1a2b4a' }}>{k.nama_kpi}</div></td>
                    <td style={{ fontSize: 13 }}>{k.perspektif_bsc}</td>
                    <td>
                      <div className="action-group">
                        <button className="btn-action btn-detail" onClick={() => setUi(p => ({ ...p, sel: k }))} disabled={proc === k.id}>Detail</button>
                        <button className="btn-action btn-revisi-tbl" onClick={() => handleAct(k.id, 'revisi', k.nama_kpi)} disabled={proc === k.id}>{proc === k.id ? '...' : <>{Ico.Rev} Revisi</>}</button>
                        <button className="btn-action btn-approve-tbl" onClick={() => handleAct(k.id, 'approve', k.nama_kpi)} disabled={proc === k.id}>{proc === k.id ? '...' : <>{Ico.App} Approve</>}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DetailModal k={sel} onClose={() => setUi(p => ({ ...p, sel: null }))} />
    </>
  );
}