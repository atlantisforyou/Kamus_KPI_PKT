'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
// Import form komponen untuk fitur Edit/Revisi
import { InformasiDasarForm, KarakteristikKPIForm, TargetValidasiForm } from '@/components/ui/FormComponents';

const BULAN = ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des'];
const B_LBL = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];

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
  Detail: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Revisi: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
};

function StatusBadge({ status, customLabel }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: s.bg, color: s.color, whiteSpace: 'nowrap', border: `1px solid ${s.color}30` }}>
      {customLabel || s.label}
    </span>
  );
}

// MODAL DETAIL KPI (Read-Only)
function KpiDetailModal({ kpi, onClose, onRefresh }) {
  const [loadingApprove, setLoadingApprove] = useState(false);

  const handleBypassApprove = async () => {
    const confirmResult = await Swal.fire({
      title: 'Bypass Admin',
      text: 'Yakin ingin menyetujui KPI ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Setujui!',
      cancelButtonText: 'Batal'
    });

    if (!confirmResult.isConfirmed) return;
    setLoadingApprove(true);
    try {
      const r = await fetch(`/api/kamus/${kpi.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);

      Swal.fire({ title: "Berhasil!", text: "KPI berhasil disetujui oleh Admin!", icon: "success" });
      onRefresh();
      onClose();
    } catch (e) {
      Swal.fire({ title: "Gagal!", text: e.message || 'Terjadi kesalahan', icon: "error" });
    } finally {
      setLoadingApprove(false);
    }
  };

  if (!kpi) return null;

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
          <h3>Detail KPI & Pencapaian</h3>
          <button className="modal-close" onClick={onClose}>{Ico.Close}</button>
        </div>
        
        <div className="modal-body">
          <div className="detail-section">
            <h4>Informasi Dasar & Strategis</h4>
            <DRow l="Nama KPI" v={kpi.nama_kpi} />
            <DRow l="Perspektif BSC" v={kpi.perspektif_bsc} />
            <DRow l="Sasaran Strategis" v={kpi.sasaran_strategis} />
            <DRow l="Definisi KPI" v={kpi.definisi_kpi} />
            <DRow l="Tujuan KPI" v={kpi.tujuan_kpi} />
            <DRow l="Status" v={<StatusBadge status={kpi.status} />} />
          </div>
          
          <div className="detail-section">
            <h4>Karakteristik KPI</h4>
            <DRow l="Tipe KPI" v={kpi.tipe_kpi} />
            <DRow l="Formula" v={kpi.formula_penilaian} />
            <DRow l="Jenis Pengukuran" v={kpi.jenis_pengukuran} />
            <DRow l="Polaritas" v={kpi.polaritas} />
            <DRow l="Frekuensi" v={kpi.frekuensi} />
          </div>
          
          <div className="detail-section">
            <h4>Target & Realisasi Bulanan</h4>
            <div className="target-grid-sm">
              {BULAN.map((b, i) => (
                <div key={b} className="target-cell-sm">
                  <div className="t-lbl">{B_LBL[i]}</div>
                  <div className="t-split">
                    <div className="t-target"><span style={{color:'#7a8b9a', fontSize: 10}}>TGT:</span> {kpi[`target_${b}`] ?? '-'}</div>
                    <div className="t-real"><span style={{color:'#7a8b9a', fontSize: 10}}>REL:</span> {kpi[`realisasi_${b}`] ?? '-'}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 24, fontSize: 14, flexWrap: 'wrap', background: '#f8fafc', padding: '12px 16px', borderRadius: 8, border: '1px solid #e8edf2' }}>
              <span style={{ color: '#7a8b9a' }}>Target Tahunan: <strong style={{ color: '#1a2b4a' }}>{kpi.target_tahunan ?? '-'}</strong></span>
              <span style={{ color: '#7a8b9a' }}>Satuan: <strong style={{ color: '#1a2b4a' }}>{kpi.satuan || '-'}</strong></span>
              <span style={{ color: '#7a8b9a' }}>Sumber Data: <strong style={{ color: '#1a2b4a' }}>{kpi.sumber_data || '-'}</strong></span>
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          {kpi.status !== 'approved' && (
            <button className="btn-modal" style={{ background: '#16a34a', color: '#fff', border: 'none' }} onClick={handleBypassApprove} disabled={loadingApprove}>
              {loadingApprove ? 'Memproses...' : 'Approve KPI'}
            </button>
          )}
          <button className="btn-modal btn-cancel" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

// KOMPONEN KARTU KARYAWAN
function KaryawanCard({ karyawan, defaultOpen = false, search, roleUser, onOpenModal, onRevisi }) {
  const [open, setOpen] = useState(defaultOpen);

  const isEmployeeMatch = search && (
    karyawan.nama?.toLowerCase().includes(search.toLowerCase()) ||
    karyawan.npk?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredKpi = karyawan.kpi?.filter(k =>
    !search ||
    isEmployeeMatch ||
    k.nama_kpi?.toLowerCase().includes(search.toLowerCase()) ||
    k.perspektif_bsc?.toLowerCase().includes(search.toLowerCase()) ||
    k.sasaran_strategis?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const pct = karyawan.progressPct || 0;
  let evalStatus = pct >= 100 ? 'Melampaui Target' : pct > 0 ? 'On Progress' : 'Belum Ada';
  let evalBg = pct >= 100 ? '#dcfce7' : pct > 0 ? '#fef3c7' : '#f1f5f9';
  let evalColor = pct >= 100 ? '#16a34a' : pct > 0 ? '#d97706' : '#64748b';

  const displayDept = karyawan.nama_dept || karyawan.unit_kerja || '-';

  return (
    <div className={`employee-card ${open ? 'expanded' : ''}`}>
      <div className="employee-header" onClick={() => setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
          <div className={`chevron-icon ${open ? 'open' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div className="avatar">{karyawan.nama?.charAt(0).toUpperCase()}</div>
          <div style={{ minWidth: '200px' }}>
            <div className="emp-name">{karyawan.nama}</div>
            <div className="emp-role">NPK: {karyawan.npk || '-'} | {displayDept}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Capaian Kinerja Tahunan</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: evalColor }}>{pct.toFixed(1)}%</div>
          </div>
          <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: evalBg, color: evalColor, whiteSpace: 'nowrap' }}>
            {evalStatus}
          </span>
        </div>
      </div>

      {open && (
        <div className="employee-detail">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
             <div className="detail-title">DAFTAR KPI & TARGET TAHUNAN</div>
             <div style={{ display: 'flex', gap: 10 }}>
               {karyawan.kpi?.length > 0 && (
                  <button onClick={(e) => { e.stopPropagation(); window.open(`/api/rekap/${karyawan.id}/export`, '_blank'); }} className="btn-export">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download Format Penilaian SKT
                  </button>
               )}
             </div>
          </div>
          
          {filteredKpi.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>Belum ada kamus KPI yang disetujui.</div>
          ) : (
          <div className="table-responsive">
              <table className="kpi-table">
                <thead>
                  <tr>
                    <th width="5%">No</th>
                    <th width="30%">KPI & Sasaran</th>
                    <th width="10%">Satuan</th>
                    <th width="15%">Target Tahunan</th>
                    <th width="10%">Target Bulan Ini</th>
                    <th width="10%">Bobot</th>
                    <th width="10%">Status</th>
                    <th width="10%">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKpi.map((kpi, idx) => {
                     const bulanKe = new Date().getMonth(); 
                     const targetSdSekarang = kpi[`target_${BULAN[bulanKe]}`] || '-';

                     return (
                      <tr key={kpi.id || idx}>
                        <td style={{ fontWeight: 600, color: '#64748b' }}>{idx + 1}</td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{kpi.nama_kpi || '-'}</div>
                          <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{kpi.sasaran_strategis || '-'}</div>
                        </td>
                        <td>{kpi.satuan || '-'}</td>
                        <td style={{ fontWeight: 700, color: '#1a2b4a' }}>{kpi.target_tahunan || '-'}</td>
                        <td>{targetSdSekarang}</td>
                        <td>{kpi.bobot ? `${kpi.bobot}%` : '0%'}</td>
                        <td><StatusBadge status={kpi.status} /></td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: 6 }}>
                             <button className="btn-detail" onClick={() => onOpenModal(kpi)}>
                               {Ico.Detail} Detail
                             </button>
                             <button className="btn-revisi" onClick={() => onRevisi(kpi)}>
                               {Ico.Revisi} Revisi
                             </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
  </div>
  );
}

// HALAMAN UTAMA REKAP
export default function RekapPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  
  const [selectedKpi, setSelectedKpi] = useState(null); // Untuk Modal Detail
  const [editKpi, setEditKpi] = useState(null);         // Untuk Modal Revisi (Edit)
  const [roleUser, setRoleUser] = useState('');

  // State untuk form Revisi/Edit
  const [form, setForm] = useState(INIT_FORM);
  const [loadingForm, setLoadingForm] = useState(false);
  
  const loadData = () => {
    fetch('/api/rekap')
      .then(r => r.json())
      .then(d => setData(d.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => setRoleUser(d.user?.role || 'user'))
      .catch(() => {});

    loadData();
  }, []);

  // Handler Update State Form
  const setFormField = (key) => (e) => {
    const val = e.target ? e.target.value : e;
    setForm(prev => {
      const updated = { ...prev, [key]: val };
      // Hitung otomatis Target Tahunan jika target bulan diedit
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

  // KETIKA TOMBOL REVISI DIKLIK
  const handleRevisiClick = (kpi) => {
    // Isi data lama ke dalam state form
    setForm({ ...INIT_FORM, ...kpi });
    setEditKpi(kpi); // Buka modal Edit/Revisi
  };

  // KETIKA TOMBOL SIMPAN DI MODAL REVISI DIKLIK
  const submitRevisi = async () => {
    if (!form.nama_kpi.trim()) return Swal.fire("Peringatan", "Nama KPI wajib diisi!", "warning");

    setLoadingForm(true);
    try {
      // Endpoint PATCH ke ID kpi untuk update isi dari form
      const r = await fetch(`/api/kamus/${editKpi.id}`, { 
        method: 'PATCH', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(form) // Mengirimkan semua data form yang diedit
      });
      
      if (!r.ok) throw new Error();
      
      Swal.fire({ title: "Berhasil!", text: `KPI "${form.nama_kpi}" berhasil direvisi.`, icon: "success" });
      
      setEditKpi(null); // Tutup Modal Edit
      loadData();       // Refresh tabel
    } catch { 
      Swal.fire({ title: "Gagal!", text: 'Terjadi kesalahan saat menyimpan perubahan.', icon: "error" });
    } finally {
      setLoadingForm(false);
    }
  };

  const units = [...new Set(data.map(k => k.nama_dept || k.unit_kerja).filter(Boolean))].sort();

  const filtered = data.filter(k => {
    const empDept = k.nama_dept || k.unit_kerja;
    const matchUnit = filterUnit ? empDept === filterUnit : true;
    
    const matchSearch = !search ||
      k.nama?.toLowerCase().includes(search.toLowerCase()) ||
      k.npk?.toLowerCase().includes(search.toLowerCase()) ||
      k.kpi?.some(kpi =>
        kpi.nama_kpi?.toLowerCase().includes(search.toLowerCase()) ||
        kpi.sasaran_strategis?.toLowerCase().includes(search.toLowerCase())
      );
    return matchUnit && matchSearch;
  });

  return (
    <>
      <style>{`
        /* Global & Layouts */
        .page-container { padding: 24px; background: #f4f8fc; min-height: 100vh; font-family: 'Plus Jakarta Sans', sans-serif; }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .header-title { font-size: 22px; font-weight: 800; color: #0f172a; }

        /* Main White Card Layout */
        .main-card { background: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9; padding: 20px; }

        /* Toolbar / Filters */
        .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
        .filter-group { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
        .filter-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #475569; font-weight: 500; }
        .filter-select { padding: 8px 32px 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 13px; color: #0f172a; background: #fff; cursor: pointer; outline: none; appearance: none; background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e"); background-repeat: no-repeat; background-position: right 8px center; background-size: 14px; }
        
        .search-wrapper { display: flex; align-items: center; gap: 16px; }
        .search-box { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 0 12px; width: 240px; }
        .search-box input { flex: 1; border: none; outline: none; font-size: 13px; padding: 9px 0; background: transparent; color: #0f172a; }

        /* Employee List Styling */
        .employee-list { display: flex; flex-direction: column; gap: 12px; }
        .employee-card { border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; overflow: hidden; transition: all 0.2s; }
        .employee-card.expanded { border-color: #93c5fd; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08); }
        
        /* Employee Header */
        .employee-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; background: #fff; transition: background 0.2s; }
        .employee-card.expanded .employee-header { background: #eff6ff; border-bottom: 1px solid #bfdbfe; }
        .employee-header:hover { background: #f8fafc; }
        
        .chevron-icon { color: #64748b; transition: transform 0.2s; display: flex; align-items: center; justify-content: center; }
        .chevron-icon.open { transform: rotate(180deg); color: #3b82f6; }
        
        .avatar { width: 42px; height: 42px; border-radius: 50%; background: #0f4b8f; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 16px; flex-shrink: 0; }
        
        .emp-name { font-size: 15px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 2px; }
        .emp-role { font-size: 12px; color: #64748b; }

        /* Detail Section */
        .employee-detail { padding: 24px; background: #fff; }
        .detail-title { font-size: 13px; font-weight: 800; color: #0f4b8f; margin-bottom: 0px; letter-spacing: 0.5px; }
        
        /* Buttons inside table */
        .btn-export { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: #1a2b4a; color: #fff; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
        .btn-export:hover { background: #0f172a; }
        
        .table-responsive { width: 100%; overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px; }
        .kpi-table { width: 100%; border-collapse: collapse; text-align: left; }
        .kpi-table th { background: #f8fafc; padding: 14px 16px; font-size: 12px; font-weight: 700; color: #475569; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
        .kpi-table td { padding: 14px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .kpi-table tr:last-child td { border-bottom: none; }
        
        .btn-detail { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; border-radius: 6px; font-size: 12px; font-family: inherit; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-detail:hover { background: #dbeafe; color: #2563eb; }

        /* Style Tombol Revisi */
        .btn-revisi { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: 6px; font-size: 12px; font-family: inherit; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .btn-revisi:hover { background: #fee2e2; color: #b91c1c; }

        /* Modal Styles */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; overflow-y: auto; }
        .modal { background: #fff; border-radius: 16px; width: 100%; max-width: 960px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,.2); animation: modalIn .2s ease; position: relative; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }
        .modal-header { padding: 20px 24px; border-bottom: 1px solid #f0f4f8; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 10; }
        .modal-header h3 { font-size: 16px; font-weight: 700; color: #1a2b4a; margin: 0; }
        .modal-close { width: 32px; height: 32px; border-radius: 8px; background: #f4f6f9; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .15s; }
        .modal-close:hover { background: #e8edf2; }
        .modal-body { padding: 24px; }
        .detail-section { margin-bottom: 24px; }
        .detail-section h4 { font-size: 11px; font-weight: 700; color: #7a8b9a; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f0f4f8; }
        .detail-row { display: grid; grid-template-columns: 160px 1fr; gap: 8px; margin-bottom: 10px; font-size: 14px; }
        .detail-key { color: #7a8b9a; font-weight: 500; }
        .detail-val { color: #1a2b4a; font-weight: 500; }
        
        .target-grid-sm { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
        .target-cell-sm { background: #fff; border-radius: 8px; padding: 10px; text-align: center; border: 1px solid #e8edf2; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
        .target-cell-sm .t-lbl { font-size: 11px; color: #1a2b4a; font-weight: 700; margin-bottom: 6px; text-transform: uppercase; border-bottom: 1px solid #f0f4f8; padding-bottom: 4px; }
        .target-cell-sm .t-split { display: flex; flex-direction: column; gap: 4px; text-align: left; }
        .target-cell-sm .t-target, .target-cell-sm .t-real { font-size: 12px; font-weight: 600; color: #374151; display: flex; justify-content: space-between; }
        .target-cell-sm .t-real { color: #2563eb; }
        
        .modal-actions { display: flex; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0f4f8; justify-content: flex-end; position: sticky; bottom: 0; background: #fff; z-index: 10; }
        .btn-modal { padding: 10px 20px; border-radius: 9px; font-size: 14px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; border: none; transition: all .15s; }
        .btn-cancel { background: #f4f6f9; color: #374151; }
        .btn-cancel:hover { background: #e8edf2; }
        .btn-save { background: #2563eb; color: white; }
        .btn-save:hover { background: #1d4ed8; }

        @media (max-width: 768px) {
          .toolbar { flex-direction: column; align-items: stretch; }
          .filter-group, .search-wrapper { justify-content: space-between; width: 100%; }
          .search-box { width: 100%; }
          .target-grid-sm { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="page-container">
        <div className="header-top">
          <h1 className="header-title">Monitoring dan Rekap Kinerja Berdasarkan Sasaran & Indikator (KPI)</h1>
        </div>

        <div className="main-card">
          
          <div className="toolbar">
            <div className="filter-group">
              <div className="filter-item">
                Unit Kerja: 
                <select className="filter-select" value={filterUnit} onChange={e => setFilterUnit(e.target.value)}>
                  <option value="">Semua</option>
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="search-wrapper">
              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input placeholder="Cari nama karyawan / NPK..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
              <svg style={{ animation: 'spin 2s linear infinite', marginBottom: '8px' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
              <div>Memuat data...</div>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Tidak ada data yang sesuai.</div>
          ) : (
            <div className="employee-list">
              {filtered.map(k => (
                <KaryawanCard 
                  key={k.id} 
                  karyawan={k} 
                  search={search} 
                  roleUser={roleUser}
                  onOpenModal={setSelectedKpi}    // Buka Modal Detail
                  onRevisi={handleRevisiClick}    // Buka Modal Revisi (Edit)
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* --- MODAL DETAIL (READ-ONLY) --- */}
      <KpiDetailModal 
        kpi={selectedKpi} 
        onClose={() => setSelectedKpi(null)} 
        onRefresh={loadData}
      />

      {/* --- MODAL REVISI (EDIT KPI) --- */}
      {editKpi && (
        <div className="modal-overlay" onClick={() => setEditKpi(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Revisi (Edit) Data KPI</h3>
              <button className="modal-close" onClick={() => setEditKpi(null)}>{Ico.Close}</button>
            </div>
            
            <div className="modal-body" style={{ background: '#f4f8fc', padding: '24px' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                 <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', marginTop: 0 }}>
                    Silakan ubah rincian KPI Karyawan di bawah ini secara langsung.
                 </p>
                 {/* Re-use FormComponents yang diimport di atas */}
                 <InformasiDasarForm   form={form} set={setFormField} />
                 <KarakteristikKPIForm form={form} set={setFormField} />
                 <TargetValidasiForm   form={form} set={setFormField} />
              </div>
            </div>
            
            <div className="modal-actions">
              <button className="btn-modal btn-cancel" onClick={() => setEditKpi(null)} disabled={loadingForm}>
                Batal
              </button>
              <button className="btn-modal btn-save" onClick={submitRevisi} disabled={loadingForm}>
                {loadingForm ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}