'use client';

import { useState, useEffect, useCallback } from 'react';
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

const Ico = {
  Close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Plus:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Back:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Warn:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
};

const StatBadge = ({ s }) => {
  const c = STATUS_CONFIG[s] || STATUS_CONFIG.draft;
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.c }}>{c.label}</span>;
};

export default function KamusKeyPartnerPage() {
  const [view, setView]     = useState('list');
  const [data, setData]     = useState([]);
  const [load, setLoad]     = useState(true);
  const [filter, setFilter] = useState({ q: '', stat: '' });

  // Form state
  const [form, setForm]               = useState(INIT_FORM);
  const [loadingForm, setLoadingForm] = useState(false);
  const [error, setError]             = useState('');
  const [successMsg, setSuccessMsg]   = useState('');

  const fetchKamus = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoad(true);
    try {
      const currentYear = localStorage.getItem('periodeKamus') || new Date().getFullYear().toString();
      
      const r = await fetch(`/api/kamus?periode=${currentYear}&t=${Date.now()}`, { 
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      });
      const d = await r.json();
      setData(d.data || []);
    } catch (err) {
      console.error(err);
    } finally { 
      if (!isSilent) setLoad(false); 
    }
  }, []);

  useEffect(() => { 
    if (view === 'list') {
      fetchKamus(); 
    }

    const handlePeriodeChange = () => {
      if (view === 'list') fetchKamus(false);
    };
    
    window.addEventListener('periodeChanged', handlePeriodeChange);
    return () => window.removeEventListener('periodeChanged', handlePeriodeChange);
  }, [view, fetchKamus]);

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

  const handleAutoFill = (kpiData) => {
    setForm(p => ({
      ...p,
      perspektif_bsc: kpiData.perspektif_bsc || p.perspektif_bsc,
      sasaran_strategis: kpiData.sasaran_strategis || p.sasaran_strategis,
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
      const currentYear = localStorage.getItem('periodeKamus') || new Date().getFullYear().toString();
      
      const res  = await fetch('/api/kamus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, status, periode: currentYear }),
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
    btn: { padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: 'Plus Jakarta Sans,sans-serif', cursor: 'pointer', border: 'none', transition: 'all .2s', display: 'inline-flex', alignItems: 'center', gap: 8 }
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
      `}</style>

      {/* LIST */}
      {view === 'list' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2b4a', marginBottom: 6 }}>Kamus KPI Key Partner</h1>
              <p style={{ fontSize: 14, color: '#7a8b9a' }}>Buat standar Kamus KPI sebagai acuan untuk departemen Anda.</p>
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
              <input placeholder="Cari nama KPI..." value={filter.q} onChange={e => setFilter(p => ({ ...p, q: e.target.value }))} />
            </div>
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
                    <th>#</th>
                    <th>Nama KPI</th>
                    <th>Perspektif BSC</th>
                    <th>TimeStamp</th>
                    <th>Status</th>
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

          <InformasiDasarForm   form={form} set={setFormField} handleAutoFill={handleAutoFill} />
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
            <button style={{ ...S.btn, ...S.btnPrimary, background: '#1a2b4a', color: '#fff' }}
              onClick={() => handleSubmit('submitted')} disabled={loadingForm}>
              {loadingForm ? 'Menyimpan...' : 'Submit KPI'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}