'use client';

import { useState, useEffect } from 'react';
import { InformasiDasarForm, KarakteristikKPIForm, TargetValidasiForm } from '@/components/ui/FormComponents';

const BULAN = ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des'];

const INIT_FORM = {
  perspektif_bsc: '', sasaran_strategis: '', nama_kpi: '', definisi_kpi: '', tujuan_kpi: '', tipe_kpi: '', formula_penilaian: '', jenis_pengukuran: '',
  polaritas: '', frekuensi: '', target_jan: '', target_feb: '', target_mar: '', target_apr: '', target_mei: '', target_jun: '', target_jul: '', target_agt: '', target_sep: '', target_okt: '',
  target_nov: '', target_des: '', target_tahunan: '', sumber_data: '', satuan: '', validitas: '', nilai_maksimum: '',
};

const STATUS_CONFIG = {
  draft:     { l: 'Draft',     c: '#6b7280', bg: '#f3f4f6' },
  submitted: { l: 'Submitted', c: '#d97706', bg: '#fef3c7' }, 
  reviewed:  { l: 'Reviewed',  c: '#2563eb', bg: '#dbeafe' }, 
  approved:  { l: 'Approved',  c: '#16a34a', bg: '#dcfce7' },
};

const Ico = {
  Add:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Spin:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V2"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>,
  Empty:  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7a8b9a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  Edit:   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Exp:    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  Back:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Err:    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Succ:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
};

const CSS = `*{box-sizing:border-box}.page-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px}.page-header h1{font-size:22px;font-weight:700;color:#1a2b4a;margin:0}.btn{padding:10px 20px;border-radius:10px;font-size:14px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;border:none;transition:all .2s;display:inline-flex;align-items:center;gap:8px}.btn-primary{background:#1a2b4a;color:#fff}.btn-primary:hover{background:#243d6a}.btn-secondary{background:#f4f6f9;color:#374151;border:1.5px solid #e5eaf0}.btn-secondary:hover{background:#e8edf2}.btn:disabled{opacity:.5;cursor:not-allowed}.toolbar{display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap}.search-box{flex:1;min-width:200px;display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid #e5eaf0;border-radius:10px;padding:0 14px}.search-box input{flex:1;border:none;outline:0;font-size:14px;padding:10px 0;background:0 0;color:#1a2b4a;font-family:'Plus Jakarta Sans',sans-serif}.search-box input::placeholder{color:#b0bcc8}.filter-select{padding:10px 14px;border:1.5px solid #e5eaf0;border-radius:10px;font-size:14px;color:#374151;background:#fff;cursor:pointer;outline:0;font-family:'Plus Jakarta Sans',sans-serif}.table-wrap{background:#fff;border-radius:14px;box-shadow:0 1px 8px rgba(0,0,0,.06);overflow:hidden}table{width:100%;border-collapse:collapse}th{text-align:left;padding:11px 16px;font-size:11px;font-weight:700;color:#7a8b9a;text-transform:uppercase;letter-spacing:.5px;background:#f8fafc;border-bottom:1px solid #e8edf2}td{padding:13px 16px;font-size:14px;color:#374151;border-bottom:1px solid #f0f4f8;vertical-align:middle}tr:last-child td{border-bottom:none}tr:hover td{background:#fafbfc}.btn-edit{padding:5px 12px;background:#eff6ff;color:#3b7dd8;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;transition:background .15s;font-family:'Plus Jakarta Sans',sans-serif;display:inline-flex;align-items:center;gap:4px}.btn-edit:hover{background:#dbeafe}.btn-revisi{padding:5px 12px;background:#fff5f5;color:#dc2626;border:1px solid #fecaca;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;transition:background .15s;font-family:'Plus Jakarta Sans',sans-serif;display:inline-flex;align-items:center;gap:4px}.btn-revisi:hover{background:#fee2e2}.btn-export{padding:5px 12px;background:#f0fdf4;color:#16a34a;border:none;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;transition:background .15s;font-family:'Plus Jakarta Sans',sans-serif;text-decoration:none;display:inline-flex;align-items:center;gap:4px}.btn-export:hover{background:#dcfce7}.error-box{background:#fff5f5;border:1px solid #fecaca;border-radius:10px;padding:12px 16px;margin-bottom:16px;display:flex;align-items:center;gap:10px;font-size:13px;color:#dc2626;font-weight:500}.success-box{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 16px;margin-bottom:16px;font-size:14px;color:#15803d;font-weight:600;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px}.spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.loading-overlay{text-align:center;padding:80px;color:#7a8b9a;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px} .ac-wrap{position:relative;margin-bottom:20px} .ac-input{width:100%;padding:12px 16px;border:1.5px solid #3b82f6;border-radius:10px;font-size:14px;outline:none;font-family:'Plus Jakarta Sans',sans-serif;background:#eff6ff} .ac-list{position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #e2e8f0;border-radius:8px;max-height:220px;overflow-y:auto;z-index:20;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1);margin-top:6px} .ac-item{padding:12px 16px;font-size:14px;cursor:pointer;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;color:#1e293b} .ac-item:hover{background:#f8fafc} .ac-item strong{color:#0f172a}`;

const StatBadge = ({ s }) => {
  const c = STATUS_CONFIG[s] || STATUS_CONFIG.draft;
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.c }}>{c.l}</span>;
};

export default function KamusPage() {
  const [ui, setUi]     = useState({ v: 'list', id: null, stat: '', ldL: true, ldF: false, ldR: false, err: '', msg: '' });
  const [flt, setFlt]   = useState({ q: '', s: '' });
  
  const [periode, setPeriode] = useState(''); 
  
  const [kamus, setKamus] = useState([]);
  const [form, setForm] = useState(INIT_FORM);

  const [allHistoryKpi, setAllHistoryKpi] = useState([]);
  const [searchRiwayat, setSearchRiwayat] = useState('');
  const [showSuggest, setShowSuggest] = useState(false);

  useEffect(() => {
    const simpananTahun = localStorage.getItem('periodeKamus') || new Date().getFullYear().toString();
    setPeriode(simpananTahun);

    const handlePeriodeUpdate = () => {
      const updatedPeriode = localStorage.getItem('periodeKamus');
      if (updatedPeriode) setPeriode(updatedPeriode);
    };

    window.addEventListener('periodeChanged', handlePeriodeUpdate);
    return () => window.removeEventListener('periodeChanged', handlePeriodeUpdate);
  }, []);


  const fetchKamus = async () => {
    if (!periode) return;
    setUi(p => ({ ...p, ldL: true }));
    try { 
      const r = await fetch(`/api/kamus?periode=${periode}`); 
      const d = await r.json(); 
      setKamus(d.data || []); 
    } 
    catch {} finally { setUi(p => ({ ...p, ldL: false })); }
  };

  useEffect(() => { 
    if (ui.v === 'list' && periode) fetchKamus(); 
  }, [ui.v, periode]);

  const openTambah = async () => {
    setForm(INIT_FORM);
    setSearchRiwayat('');
    setShowSuggest(false);
    setUi(p => ({ ...p, v: 'tambah', stat: '', err: '' }));

    if (allHistoryKpi.length === 0) {
      try {
        const r = await fetch('/api/kamus'); 
        const d = await r.json();
        setAllHistoryKpi(d.data || []);
      } catch (e) {}
    }
  };

  const openRevisi = async (id) => {
    setUi(p => ({ ...p, err: '', msg: '', id, v: 'revisi', ldR: true }));
    try {
      const r = await fetch(`/api/kamus/${id}`); const d = await r.json();
      if (!d.data) throw new Error('KPI tidak ditemukan');
      const k = d.data;
      setUi(p => ({ ...p, stat: k.status }));
      setForm(Object.keys(INIT_FORM).reduce((a, key) => ({ ...a, [key]: k[key] ?? '' }), {}));
    } catch (e) { setUi(p => ({ ...p, err: e.message || 'Gagal memuat' })); } 
    finally { setUi(p => ({ ...p, ldR: false })); }
  };

  const goBack = () => { setUi(p => ({ ...p, v: 'list', id: null, stat: '', err: '', msg: '' })); setForm(INIT_FORM); };

  const setF = (k) => (e) => {
    const val = e.target ? e.target.value : e;
    setForm(p => {
      const up = { ...p, [k]: val };
      if (k.startsWith('target_') && k !== 'target_tahunan') {
        const t = BULAN.reduce((sum, b) => sum + (parseFloat(b === k.replace('target_', '') ? val : up[`target_${b}`]) || 0), 0);
        up.target_tahunan = t > 0 ? t.toFixed(2) : '';
      }
      return up;
    });
  };

  const handleAutoFill = (kpiData) => {
    setForm(p => ({
      ...p,
      nama_kpi: kpiData.nama_kpi || '',
      definisi_kpi: kpiData.definisi_kpi || '',
      tujuan_kpi: kpiData.tujuan_kpi || '',
      tipe_kpi: kpiData.tipe_kpi || '',
      formula_penilaian: kpiData.formula_penilaian || '',
      jenis_pengukuran: kpiData.jenis_pengukuran || '',
      polaritas: kpiData.polaritas || '',
      frekuensi: kpiData.frekuensi || '',
      sumber_data: kpiData.sumber_data || '',
      satuan: kpiData.satuan || '',
      validitas: kpiData.validitas || '',
      nilai_maksimum: kpiData.nilai_maksimum || ''
    }));
  };

  const handleSubmit = async (status) => {
    if (!form.nama_kpi.trim()) return setUi(p => ({ ...p, err: 'Nama KPI wajib diisi' }));
    if (!form.perspektif_bsc) return setUi(p => ({ ...p, err: 'Perspektif BSC wajib dipilih' }));
    if (!form.definisi_kpi.trim()) return setUi(p => ({ ...p, err: 'Definisi KPI wajib diisi' }));

    setUi(p => ({ ...p, err: '', ldF: true }));
    try {
      const isRev = ui.v === 'revisi';
      const payloadBody = { ...form, status, periode }; 

      const r = await fetch(isRev ? `/api/kamus/${ui.id}` : '/api/kamus', { 
        method: isRev ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payloadBody) 
      });

      if (!r.ok) throw new Error((await r.json()).error || 'Gagal menyimpan');
      setUi(p => ({ ...p, msg: status === 'draft' ? 'Draft berhasil disimpan!' : 'KPI berhasil dikirim!' })); 
      setTimeout(goBack, 1200);
    } catch (e) { setUi(p => ({ ...p, err: e.message })); } 
    finally { setUi(p => ({ ...p, ldF: false })); }
  };

  const filtered = kamus.filter(k => (!flt.s || k.status === flt.s) && (k.nama_kpi?.toLowerCase().includes(flt.q.toLowerCase()) || k.perspektif_bsc?.toLowerCase().includes(flt.q.toLowerCase())));
  const formatTgl = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

  const suggestedKpis = allHistoryKpi.filter(k => 
    k.nama_kpi?.toLowerCase().includes(searchRiwayat.toLowerCase()) && 
    k.periode !== periode
  );

  return (
    <>
      <style>{CSS}</style>

      {/* LIST VIEW */}
      {ui.v === 'list' && (
        <div>
          <div className="page-header">
            <h1>Kamus KPI Saya {periode ? `(${periode})` : ''}</h1>
            <button className="btn btn-primary" onClick={openTambah}>
              {Ico.Add} Tambah Kamus KPI
            </button>
          </div>

          <div className="toolbar">
            <div className="search-box">
              {Ico.Search}
              <input placeholder="Cari nama KPI..." value={flt.q} onChange={e => setFlt(p => ({ ...p, q: e.target.value }))} />
            </div>

            <select className="filter-select" value={flt.s} onChange={e => setFlt(p => ({ ...p, s: e.target.value }))}>
              <option value="">Semua Status</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.l}</option>)}
            </select>
          </div>

          <div className="table-wrap">
            {ui.ldL ? <div className="loading-overlay">{Ico.Spin} Memuat data...</div> : 
             filtered.length === 0 ? (
              <div className="loading-overlay" style={{ flexDirection: 'column', gap: 12 }}>
                {Ico.Empty}
                <p>{flt.q || flt.s ? 'Tidak ada hasil pencarian.' : `Belum ada KPI di tahun ${periode}. Klik "+ Tambah Kamus KPI" untuk mulai.`}</p>
              </div>
            ) : (
              <table>
                <thead><tr><th>#</th><th>Nama KPI</th><th>Perspektif BSC</th><th>Tanggal</th><th>Status</th></tr></thead>
                <tbody>
                  {filtered.map((k, i) => (
                    <tr key={k.id}>
                      <td style={{ color: '#b0bcc8', fontSize: 13 }}>{i + 1}</td>
                      <td><span style={{ fontWeight: 600, color: '#1a2b4a' }}>{k.nama_kpi}</span></td>
                      <td style={{ fontSize: 13, color: '#7a8b9a' }}>{k.perspektif_bsc || '-'}</td>
                      <td style={{ fontSize: 13, color: '#7a8b9a', whiteSpace: 'nowrap' }}>{formatTgl(k.created_at)}</td>
                      <td><StatBadge s={k.status} /></td>
                      {/* Di sini bagian <td> yang berisi tombol aksi dihapus 
                      */}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* FORM VIEW */}
      {(ui.v === 'tambah' || ui.v === 'revisi') && (
        <div>
          <div className="page-header">
            <div>
              <h1>{ui.v === 'revisi' ? (ui.stat === 'revisi' ? 'Perbaiki Revisi KPI' : 'Revisi Kamus KPI') : `Tambah Kamus KPI (${periode})`}</h1>
              <p style={{ fontSize: 14, color: '#7a8b9a', margin: '4px 0 0' }}>Field bertanda <span style={{ color: '#dc2626' }}>*</span> wajib diisi.</p>
            </div>
            <button className="btn btn-secondary" onClick={goBack}>{Ico.Back} Kembali</button>
          </div>

          {ui.ldR ? <div className="loading-overlay">{Ico.Spin} Memuat data KPI...</div> : (
            <>
              <InformasiDasarForm form={form} set={setF} handleAutoFill={handleAutoFill} />
              <KarakteristikKPIForm form={form} set={setF} />
              <TargetValidasiForm form={form} set={setF} />

              {ui.err && <div className="error-box">{Ico.Err}{ui.err}</div>}
              {ui.msg && <div className="success-box">{Ico.Succ}{ui.msg}</div>}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, padding: '20px 0' }}>
                {ui.stat !== 'revisi' && <button className="btn btn-secondary" onClick={() => handleSubmit('draft')} disabled={ui.ldF}>Simpan Draft</button>}
                <button className="btn btn-primary" onClick={() => handleSubmit('submitted')} disabled={ui.ldF}>
                  {ui.ldF ? <><div className="spinner" /> Menyimpan...</> : (ui.stat === 'revisi' ? 'Submit' : 'Submit KPI')}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}