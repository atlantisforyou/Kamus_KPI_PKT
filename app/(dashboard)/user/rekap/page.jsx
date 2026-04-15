'use client';

import { useState, useEffect } from 'react';

const BULAN = ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des'];
const B_LBL = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     color: '#6b7280', bg: '#f3f4f6' },
  submitted: { label: 'Submitted', color: '#d97706', bg: '#fef3c7' },
  reviewed:  { label: 'Reviewed',  color: '#2563eb', bg: '#dbeafe' },
  approved:  { label: 'Approved',  color: '#16a34a', bg: '#dcfce7' },
};

const Ico = {
  Close:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Detail: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
};

function StatusBadge({ status, customLabel }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: s.bg, color: s.color, whiteSpace: 'nowrap', border: `1px solid ${s.color}30` }}>
      {customLabel || s.label}
    </span>
  );
}

// ── KOMPONEN MODAL DETAIL ─────────────────────────────────────────
function KpiDetailModal({ kpi, onClose }) {
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
          <button className="btn-modal btn-cancel" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

// ── KOMPONEN KARTU KARYAWAN ───────────────────────────────────────
function KaryawanCard({ karyawan, defaultOpen = false, search, onOpenModal }) {
  const [open, setOpen] = useState(defaultOpen);

  const filteredKpi = karyawan.kpi?.filter(k =>
    !search ||
    k.nama_kpi?.toLowerCase().includes(search.toLowerCase()) ||
    k.perspektif_bsc?.toLowerCase().includes(search.toLowerCase()) ||
    k.sasaran_strategis?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const totalKpi = karyawan.kpi?.length || 0;
  const approvedKpi = karyawan.kpi?.filter(k => k.status === 'approved').length || 0;
  const progressPct = totalKpi === 0 ? 0 : Math.round((approvedKpi / totalKpi) * 100);
  
  let evalStatus = progressPct >= 100 ? 'Melampaui Target' : progressPct > 0 ? 'On Progress' : 'Belum Ada';
  let evalBg = progressPct >= 100 ? '#dcfce7' : progressPct > 0 ? '#fef3c7' : '#f1f5f9';
  let evalColor = progressPct >= 100 ? '#16a34a' : progressPct > 0 ? '#d97706' : '#64748b';

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
            <div className="emp-role">{karyawan.npk || 'Staff'}</div>
          </div>
        </div>

        <div className="emp-dept">{displayDept}</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, justifyContent: 'flex-end' }}>
          <div className="emp-score-text">
            Progress KPI: <span style={{ color: progressPct === 100 ? '#16a34a' : '#1e293b' }}>{progressPct}%</span>

            {progressPct < 100 && (
              <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '4px', marginTop: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPct}%`, height: '100%', background: '#f59e0b', borderRadius: '4px' }} />
              </div>
            )}
          </div>
          <span style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: evalBg, color: evalColor, whiteSpace: 'nowrap' }}>
            {evalStatus}
          </span>
        </div>
      </div>

      {open && (
        <div className="employee-detail">
          <div className="detail-title">DETAIL KPI INDIVIDU</div>
          
          {filteredKpi.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '13px' }}>Tidak ada KPI.</div>
          ) : (
          <div className="table-responsive">
              {/* Ambil index bulan saat ini secara otomatis */}
              {(() => {
                const indexBulanIni = new Date().getMonth(); // 3 untuk April
                const bulanDb = BULAN[indexBulanIni]; // 'apr'
                const labelBulan = B_LBL[indexBulanIni]; // 'Apr'

                return (
                  <table className="kpi-table">
                    <thead>
                      <tr>
                        <th width="5%">No</th>
                        <th width="30%">Detail KPI</th>
                        <th width="15%">Polaritas</th>
                        <th width="15%">Target Total</th>
                        {/* Header otomatis berubah sesuai bulan saat ini */}
                        <th width="10%">Target s.d {labelBulan}</th>
                        <th width="15%">Realisasi s.d {labelBulan}</th>
                        <th width="10%">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKpi.map((kpi, idx) => {
                        // Tarik data dinamis sesuai bulan ini
                        const targetBulanIni = kpi[`target_${bulanDb}`];
                        const realisasiBulanIni = kpi[`realisasi_${bulanDb}`];

                        return (
                          <tr key={kpi.id || idx}>
                            <td style={{ fontWeight: 600, color: '#64748b' }}>{idx + 1}</td>
                            <td style={{ fontWeight: 600, color: '#0f172a' }}>{kpi.nama_kpi || '-'}</td>
                            <td>{kpi.polaritas || '-'}</td>
                            
                            {/* Target Tahunan */}
                            <td style={{ fontWeight: 600 }}>
                              {kpi.target_tahunan ? `${kpi.target_tahunan} ${kpi.satuan || ''}` : '-'}
                            </td>
                            
                            {/* Target Bulan Ini */}
                            <td>
                              {targetBulanIni ? `${targetBulanIni} ${kpi.satuan || ''}` : '-'}
                            </td>
                            
                            {/* Realisasi Bulan Ini */}
                            <td>
                              {realisasiBulanIni ? `${realisasiBulanIni} ${kpi.satuan || ''}` : '-'}
                            </td>
                            
                            <td>
                              <button 
                                className="btn-detail"
                                onClick={() => onOpenModal(kpi)}
                              >
                                {Ico.Detail} Detail
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          )}

          <div className="eval-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>Total Progress KPI: <span style={{ color: '#16a34a' }}>{progressPct}%</span></span>
              <div style={{ width: '150px', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progressPct}%`, height: '100%', background: '#16a34a', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#475569' }}>
              <span style={{ fontWeight: 700, color: '#0f172a' }}>Evaluasi Akhir:</span> <span style={{ color: evalColor }}>{evalStatus}.</span> 
              <span style={{ marginLeft: '6px' }}>Berdasarkan persetujuan atasan.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── HALAMAN UTAMA REKAP ───────────────────────────────────────────
export default function RekapPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  
  // State untuk menyimpan data KPI yang ingin ditampilkan di Modal
  const [selectedKpi, setSelectedKpi] = useState(null);
  
  useEffect(() => {
    fetch('/api/rekap')
      .then(r => r.json())
      .then(d => setData(d.data || []))
      .finally(() => setLoading(false));
  }, []);

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
        .employee-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; cursor: pointer; background: #fff; transition: background 0.2s; }
        .employee-card.expanded .employee-header { background: #eff6ff; border-bottom: 1px solid #bfdbfe; }
        .employee-header:hover { background: #f8fafc; }
        
        .chevron-icon { color: #64748b; transition: transform 0.2s; display: flex; align-items: center; justify-content: center; }
        .chevron-icon.open { transform: rotate(180deg); color: #3b82f6; }
        
        .avatar { width: 36px; height: 36px; border-radius: 50%; background: #94a3b8; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px; flex-shrink: 0; }
        .employee-card.expanded .avatar { background: #3b82f6; } 
        
        .emp-name { font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; margin-bottom: 2px; }
        .emp-role { font-size: 12px; color: #64748b; }
        .emp-dept { font-size: 13px; color: #334155; font-weight: 500; flex: 1; text-align: center; }
        .emp-score-text { font-size: 13px; font-weight: 700; color: #334155; display: flex; flex-direction: column; align-items: flex-end; }

        /* Employee Details (Table) */
        .employee-detail { padding: 20px; background: #fff; }
        .detail-title { font-size: 12px; font-weight: 800; color: #475569; margin-bottom: 12px; letter-spacing: 0.5px; }
        
        .table-responsive { width: 100%; overflow-x: auto; border: 1px solid #e2e8f0; border-radius: 8px; }
        .kpi-table { width: 100%; border-collapse: collapse; text-align: left; }
        .kpi-table th { background: #f8fafc; padding: 12px 16px; font-size: 12px; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
        .kpi-table td { padding: 14px 16px; font-size: 13px; color: #334155; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .kpi-table tr:last-child td { border-bottom: none; }
        
        /* Tombol Detail Baru */
        .btn-detail {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #eff6ff;
          color: #3b82f6;
          border: 1px solid #bfdbfe;
          border-radius: 6px;
          font-size: 12px;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-detail:hover {
          background: #dbeafe;
          color: #2563eb;
        }

        .eval-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding: 14px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; flex-wrap: wrap; gap: 12px; }

        /* ── MODAL STYLES ── */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
        .modal { background: #fff; border-radius: 16px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,.2); animation: modalIn .2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
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
        
        .target-grid-sm { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
        .target-cell-sm { background: #fff; border-radius: 8px; padding: 10px; text-align: center; border: 1px solid #e8edf2; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
        .target-cell-sm .t-lbl { font-size: 11px; color: #1a2b4a; font-weight: 700; margin-bottom: 6px; text-transform: uppercase; border-bottom: 1px solid #f0f4f8; padding-bottom: 4px; }
        .target-cell-sm .t-split { display: flex; flex-direction: column; gap: 4px; text-align: left; }
        .target-cell-sm .t-target, .target-cell-sm .t-real { font-size: 12px; font-weight: 600; color: #374151; display: flex; justify-content: space-between; }
        .target-cell-sm .t-real { color: #2563eb; }
        
        .modal-actions { display: flex; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0f4f8; justify-content: flex-end; position: sticky; bottom: 0; background: #fff; }
        .btn-modal { padding: 10px 20px; border-radius: 9px; font-size: 14px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; border: none; transition: all .15s; }
        .btn-cancel { background: #f4f6f9; color: #374151; }
        .btn-cancel:hover { background: #e8edf2; }

        @media (max-width: 768px) {
          .toolbar { flex-direction: column; align-items: stretch; }
          .filter-group, .search-wrapper { justify-content: space-between; width: 100%; }
          .search-box { width: 100%; }
          .emp-dept { display: none; }
          .eval-footer { flex-direction: column; align-items: flex-start; }
          .target-grid-sm { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      <div className="page-container">
        <div className="header-top">
          <h1 className="header-title">My Progress KPI</h1>
        </div>

        <div className="main-card">
          
          <div className="toolbar">
            <div className="filter-group">
              <div className="filter-item">
                Departemen: 
                <select className="filter-select" value={filterUnit} onChange={e => setFilterUnit(e.target.value)}>
                  <option value="">Semua</option>
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="filter-item">
                Periode: 
                <select className="filter-select">
                  <option>Q4</option>
                  <option>Q3</option>
                  <option>Q2</option>
                  <option>Q1</option>
                </select>
              </div>
              <div className="filter-item">
                Status: 
                <select className="filter-select">
                  <option>Semua</option>
                  <option>Tercapai</option>
                  <option>On Progress</option>
                </select>
              </div>
            </div>

            <div className="search-wrapper">
              <div className="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
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
                  onOpenModal={setSelectedKpi}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Modal Detail */}
      <KpiDetailModal 
        kpi={selectedKpi} 
        onClose={() => setSelectedKpi(null)} 
      />
    </>
  );
}