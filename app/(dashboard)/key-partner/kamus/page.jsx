'use client';

import { useState, useEffect } from 'react';
import { InformasiDasarForm, KarakteristikKPIForm, TargetValidasiForm } from '@/components/ui/FormComponents';
import Swal from 'sweetalert2'; // Tambahkan SweetAlert2

const BULAN = ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des'];
const B_LBL = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];

const INIT_FORM = {
  perspektif_bsc: '', sasaran_strategis: '', nama_kpi: '', definisi_kpi: '', tujuan_kpi: '', tipe_kpi: '', formula_penilaian: '', jenis_pengukuran: '',
  polaritas: '', frekuensi: '', target_jan: '', target_feb: '', target_mar: '', target_apr: '', target_mei: '', target_jun: '', target_jul: '', target_agt: '', target_sep: '', target_okt: '',
  target_nov: '', target_des: '', target_tahunan: '', sumber_data: '', satuan: '', validitas: '', nilai_maksimum: '',
};

const STAT_CFG = {
  draft:     { l: 'Draft',     c: '#6b7280', bg: '#f3f4f6' },
  submitted: { l: 'Submitted', c: '#d97706', bg: '#fef3c7' }, 
  reviewed:  { l: 'Reviewed',  c: '#2563eb', bg: '#dbeafe' }, 
  approved:  { l: 'Approved',  c: '#16a34a', bg: '#dcfce7' },
};

const Ico = {
  Add:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Spin:   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Empty:  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  Edit:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Detail: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Exp:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Back:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Err:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

const CSS = `
*{box-sizing:border-box}
.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px}
.page-header h1{font-size:22px;font-weight:700;color:#1a2b4a;margin:0}
.btn{padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;border:none;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
.btn-primary{background:#1a2b4a;color:#fff}
.btn-primary:hover{background:#243d6a}
.btn-secondary{background:#f4f6f9;color:#374151;border:1.5px solid #e5eaf0}
.btn-secondary:hover{background:#e8edf2}
.btn:disabled{opacity:.5;cursor:not-allowed}
.toolbar{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.search-box{flex:1;min-width:200px;display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid #e5eaf0;border-radius:10px;padding:0 14px}
.search-box input{flex:1;border:none;outline:0;font-size:14px;padding:10px 0;background:0 0;color:#1a2b4a;font-family:'Plus Jakarta Sans',sans-serif}
.search-box input::placeholder{color:#b0bcc8}
.filter-select{padding:10px 14px;border:1.5px solid #e5eaf0;border-radius:10px;font-size:14px;color:#374151;background:#fff;cursor:pointer;outline:0;font-family:'Plus Jakarta Sans',sans-serif}
.table-wrap{background:#fff;border-radius:14px;box-shadow:0 1px 8px rgba(0,0,0,.06);overflow-x:auto}
table{width:100%;border-collapse:collapse;min-width:700px}
th{text-align:left;padding:11px 16px;font-size:11px;font-weight:700;color:#7a8b9a;text-transform:uppercase;letter-spacing:.5px;background:#f8fafc;border-bottom:1px solid #e8edf2}
td{padding:13px 16px;font-size:14px;color:#374151;border-bottom:1px solid #f0f4f8;vertical-align:middle}
tr:last-child td{border-bottom:none}
tr:hover td{background:#fafbfc}
.btn-detail, .btn-edit, .btn-revisi, .btn-export{padding:5px 12px;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;transition:background .15s;font-family:'Plus Jakarta Sans',sans-serif;display:inline-flex;align-items:center;gap:4px;text-decoration:none}
.btn-detail{background:#f8fafc;color:#475569;border:1px solid #e2e8f0}
.btn-detail:hover{background:#f1f5f9}
.btn-edit{background:#eff6ff;color:#3b7dd8}
.btn-edit:hover{background:#dbeafe}
.btn-revisi{background:#fef2f2;color:#dc2626}
.btn-revisi:hover{background:#fee2e2}
.btn-export{background:#f0fdf4;color:#16a34a}
.btn-export:hover{background:#dcfce7}
.error-box{background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:10px;font-size:13px;color:#dc2626;font-weight:500}
.spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-overlay{text-align:center;padding:80px;color:#7a8b9a;font-size:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}

/* MODAL DETAIL KUMPULAN KAMUS */
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
`;

const StatBadge = ({ s }) => { const c = STAT_CFG[s] || STAT_CFG.draft; return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.c }}>{c.l}</span>; };

// ── KOMPONEN MODAL DETAIL (Sebagai View Database) ──
function DetailModal({ k, onClose }) {
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
            <h4>Informasi Dasar & Kepemilikan</h4>
            <DRow l="Nama KPI" v={k.nama_kpi} />
            <DRow l="Dibuat Oleh" v={`${k.pembuat_nama || 'Anda'} — ${k.pembuat_unit || '-'}`} />
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
          <button className="btn btn-secondary" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}


// ── MAIN PAGE ──
export default function KamusPage() {
  const [ui, setUi] = useState({ v: 'list', id: null, stat: '', ldL: true, ldF: false, ldR: false, err: '' });
  const [filter, setFilter] = useState({ q: '', s: '' });
  const [kamus, setKamus] = useState([]);
  const [form, setForm]   = useState(INIT_FORM);
  const [selKpi, setSelKpi] = useState(null); // State untuk buka modal detail

  const fetchKamus = async () => { setUi(p => ({ ...p, ldL: true })); try { const r = await fetch('/api/kamus'); const d = await r.json(); setKamus(d.data || []); } catch {} finally { setUi(p => ({ ...p, ldL: false })); } };
  useEffect(() => { if (ui.v === 'list') fetchKamus(); }, [ui.v]);

  const openRevisi = async (id) => {
    setUi(p => ({ ...p, err: '', id, v: 'revisi', ldR: true }));
    try {
      const r = await fetch(`/api/kamus/${id}`); const d = await r.json();
      if (!d.data) throw new Error('KPI tidak ditemukan');
      const k = d.data; setUi(p => ({ ...p, stat: k.status }));
      setForm(Object.keys(INIT_FORM).reduce((acc, key) => ({ ...acc, [key]: k[key] ?? '' }), {}));
    } catch (e) { setUi(p => ({ ...p, err: e.message || 'Gagal memuat' })); } finally { setUi(p => ({ ...p, ldR: false })); }
  };

  const goBack = () => { setUi(p => ({ ...p, v: 'list', id: null, stat: '', err: '' })); setForm(INIT_FORM); };

  const setF = (k) => (e) => {
    const val = e.target ? e.target.value : e;
    setForm(p => {
      const up = { ...p, [k]: val };
      if (k.startsWith('target_') && k !== 'target_tahunan') {
        const t = BULAN.reduce((s, b) => s + (parseFloat(b === k.replace('target_', '') ? val : up[`target_${b}`]) || 0), 0);
        up.target_tahunan = t > 0 ? t.toFixed(2) : '';
      } return up;
    });
  };

  const handleSubmit = async (status) => {
    if (!form.nama_kpi.trim()) return setUi(p => ({ ...p, err: 'Nama KPI wajib diisi' }));
    if (!form.perspektif_bsc) return setUi(p => ({ ...p, err: 'Perspektif BSC wajib dipilih' }));
    if (!form.definisi_kpi.trim()) return setUi(p => ({ ...p, err: 'Definisi KPI wajib diisi' }));
    
    setUi(p => ({ ...p, err: '', ldF: true }));
    try {
      const isRev = ui.v === 'revisi';
      const r = await fetch(isRev ? `/api/kamus/${ui.id}` : '/api/kamus', { method: isRev ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, status }) });
      if (!r.ok) throw new Error((await r.json()).error || 'Gagal menyimpan');
      
      // Tampilkan notifikasi sukses modern pakai SweetAlert2
      Swal.fire({
        title: "Berhasil!",
        text: status === 'draft' ? "Draft berhasil disimpan!" : "Kamus KPI berhasil diperbarui!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(goBack, 1200);
    } catch (e) { 
      // Tampilkan error menggunakan SweetAlert2
      Swal.fire({
        title: "Gagal!",
        text: e.message || 'Terjadi kesalahan sistem',
        icon: "error"
      });
      setUi(p => ({ ...p, err: e.message })); 
    } finally { 
      setUi(p => ({ ...p, ldF: false })); 
    }
  };

  const filtered = kamus.filter(k => (!filter.s || k.status === filter.s) && (k.nama_kpi?.toLowerCase().includes(filter.q.toLowerCase()) || k.perspektif_bsc?.toLowerCase().includes(filter.q.toLowerCase())));
  const formatTgl = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

  return (
    <>
      <style>{CSS}</style>
      
      {/* ══════════ LIST VIEW (KUMPULAN DATABASE) ══════════ */}
      {ui.v === 'list' && (
        <div>
          <div className="page-header">
            <div>
              <h1>Database Kamus KPI Unit</h1>
              <p style={{ fontSize: 14, color: '#7a8b9a', marginTop: 4 }}>Kumpulan dan referensi KPI untuk unit kerja Anda.</p>
            </div>
            <button className="btn btn-primary" onClick={() => { setForm(INIT_FORM); setUi(p => ({ ...p, v: 'tambah', stat: '', err: '' })); }}>{Ico.Add} Tambah Kamus KPI Baru</button>
          </div>

          <div className="toolbar">
            <div className="search-box">{Ico.Search}<input placeholder="Cari nama KPI..." value={filter.q} onChange={e => setFilter(p => ({ ...p, q: e.target.value }))} /></div>
            <select className="filter-select" value={filter.s} onChange={e => setFilter(p => ({ ...p, s: e.target.value }))}><option value="">Semua Status</option>{Object.entries(STAT_CFG).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}</select>
          </div>

          <div className="table-wrap">
            {ui.ldL ? <div className="loading-overlay">{Ico.Spin} Memuat database KPI...</div> : filtered.length === 0 ? <div className="loading-overlay">{Ico.Empty}<p>{filter.q || filter.s ? 'Tidak ada hasil pencarian.' : 'Belum ada KPI. Klik "+ Tambah Kamus KPI Baru" untuk mulai membuat referensi.'}</p></div> : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nama KPI</th>
                    <th>Dibuat Oleh</th>
                    <th>Perspektif BSC</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>{filtered.map((k, i) => (
                  <tr key={k.id}>
                    <td style={{ color: '#b0bcc8', fontSize: 13 }}>{i + 1}</td>
                    <td><span style={{ fontWeight: 600, color: '#1a2b4a' }}>{k.nama_kpi}</span></td>
                    
                    {/* Menampilkan pembuat agar berfungsi seperti database kumpulan */}
                    <td>
                      <div style={{ fontWeight: 500 }}>{k.pembuat_nama || '-'}</div>
                      <div style={{ fontSize: 12, color: '#7a8b9a' }}>{k.pembuat_unit || '-'}</div>
                    </td>

                    <td style={{ fontSize: 13, color: '#7a8b9a' }}>{k.perspektif_bsc || '-'}</td>
                    <td style={{ fontSize: 13, color: '#7a8b9a', whiteSpace: 'nowrap' }}>{formatTgl(k.created_at)}</td>
                    <td><StatBadge s={k.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        
                        {/* Tombol Lihat Detail Read-only */}
                        <button className="btn-detail" onClick={() => setSelKpi(k)}>{Ico.Detail} Detail</button>
                        
                        {/* Tombol Edit/Revisi */}
                        {['draft', 'submitted', 'revisi'].includes(k.status) && (
                          <button className={k.status === 'revisi' ? 'btn-revisi' : 'btn-edit'} onClick={() => openRevisi(k.id)}>
                            {Ico.Edit} {k.status === 'revisi' ? 'Perbaiki Revisi' : 'Edit'}
                          </button>
                        )}
                        
                        {/* Tombol Export bila sudah disetujui */}
                        {k.status === 'approved' && <a href={`/api/kamus/${k.id}/export`} target="_blank" rel="noopener noreferrer" className="btn-export">{Ico.Exp} Export</a>}
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ══════════ FORM VIEW (TAMBAH / EDIT) ══════════ */}
      {(ui.v === 'tambah' || ui.v === 'revisi') && (
        <div>
          <div className="page-header">
            <div>
              <h1>{ui.v === 'revisi' ? (ui.stat === 'revisi' ? 'Perbaiki Revisi KPI' : 'Edit Kamus KPI') : 'Tambah Referensi Kamus KPI'}</h1>
              <p style={{ fontSize: 14, color: '#7a8b9a', margin: '4px 0 0' }}>Field bertanda <span style={{ color: '#dc2626' }}>*</span> wajib diisi untuk standar database.</p>
            </div>
            <button className="btn btn-secondary" onClick={goBack}>{Ico.Back} Kembali</button>
          </div>
          
          {ui.ldR ? <div className="loading-overlay">{Ico.Spin} Memuat rincian KPI...</div> : (
            <>
              <InformasiDasarForm form={form} set={setF} />
              <KarakteristikKPIForm form={form} set={setF} />
              <TargetValidasiForm form={form} set={setF} />

              {/* Tampilkan pesan validasi jika masih ada yg kurang */}
              {ui.err && <div className="error-box">{Ico.Err}{ui.err}</div>}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '20px 0' }}>
                {ui.stat !== 'revisi' && <button className="btn btn-secondary" onClick={() => handleSubmit('draft')} disabled={ui.ldF}>Simpan Draft</button>}
                <button className="btn btn-primary" onClick={() => handleSubmit('submitted')} disabled={ui.ldF}>
                  {ui.ldF ? <><div className="spinner" /> Memproses...</> : 'Simpan ke Database'}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* MODAL LIHAT DETAIL KPI */}
      <DetailModal k={selKpi} onClose={() => setSelKpi(null)} />
    </>
  );
}