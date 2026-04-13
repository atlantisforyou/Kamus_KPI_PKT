'use client';

import { useState, useEffect } from 'react';

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     color: '#6b7280', bg: '#f3f4f6' },
  submitted: { label: 'Submitted', color: '#d97706', bg: '#fef3c7' },
  reviewed:  { label: 'Reviewed',  color: '#2563eb', bg: '#dbeafe' },
  approved:  { label: 'Approved',  color: '#16a34a', bg: '#dcfce7' },
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}

// ─── KOMPONEN MODAL BARU (DITAMBAHKAN KHUSUS UNTUK DETAIL) ───
const BULAN_MODAL = ['jan','feb','mar','apr','mei','jun','jul','agt','sep','okt','nov','des'];
const B_LBL_MODAL = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];

function KpiDetailModal({ kpi, onClose }) {
  if (!kpi) return null;

  const DRow = ({ l, v }) => (
    <div className="detail-row">
      <span className="detail-key">{l}</span>
      <span className="detail-val">{v || '-'}</span>
    </div>
  );

  return (
    <div className="modal-overlay-admin" onClick={onClose}>
      <div className="modal-admin" onClick={e => e.stopPropagation()}>
        <div className="modal-header-admin">
          <h3>Detail KPI & Pencapaian</h3>
          <button className="modal-close-admin" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <div className="modal-body-admin">
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
              {BULAN_MODAL.map((b, i) => (
                <div key={b} className="target-cell-sm">
                  <div className="t-lbl">{B_LBL_MODAL[i]}</div>
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
        
        <div className="modal-actions-admin">
          <button className="btn-modal btn-cancel" onClick={onClose}>Tutup</button>
        </div>
      </div>
    </div>
  );
}

// ─── KOMPONEN KARTU KARYAWAN (TIDAK ADA YANG DIUBAH) ─────────
function KaryawanCard({ karyawan, defaultOpen = false, search, onViewDetail }) {
  const [open, setOpen] = useState(defaultOpen);

  // 1. Ambil bulan saat ini untuk teks di Header Tabel (Contoh: "Apr")
  const namaBulanSekarang = new Date().toLocaleString('id-ID', { month: 'short' });

  // 2. Daftar akhiran nama kolom di database sesuai urutan bulan
  const namaKolomBulan = ['jan', 'feb', 'mar', 'apr', 'mei', 'jun', 'jul', 'agt', 'sep', 'okt', 'nov', 'des'];
  
  // 3. Ambil index bulan saat ini (0 untuk Januari, 3 untuk April, dst)
  const indexBulanIni = new Date().getMonth();
  
  // 4. Dapatkan akhiran kolom untuk bulan ini (Contoh sekarang April, jadi nilainya "apr")
  const bulanDb = namaKolomBulan[indexBulanIni];

  const filteredKpi = karyawan.kpi.filter(k =>
    !search ||
    k.nama_kpi?.toLowerCase().includes(search.toLowerCase()) ||
    k.perspektif_bsc?.toLowerCase().includes(search.toLowerCase()) ||
    k.sasaran_strategis?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #bfdbfe', marginBottom: 16, overflow: 'hidden' }}>
      {/* Header Accordion */}
      <div 
        onClick={() => setOpen(o => !o)}
        style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '16px 20px', cursor: 'pointer', 
          background: open ? '#f8fafc' : '#fff', 
          borderBottom: open ? '1px solid #e2e8f0' : 'none', 
          transition: 'background .15s' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '30%' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b7dd8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
            {karyawan.nama?.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 13, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {karyawan.nama}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
              {karyawan.npk}
            </div>
          </div>
        </div>

        <div className="hide-mobile" style={{ width: '40%', textAlign: 'center', fontSize: 13, color: '#475569', fontWeight: 500 }}>
          {karyawan.unit_kerja || '-'}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '30%', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1e293b' }}>Progress KPI:</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>100%</div>
          </div>
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>
            Melampaui Target
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s', flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* Area Detail yang Terbuka (Tabel) */}
      {open && (
        <div style={{ padding: '20px', background: '#fff' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 16, letterSpacing: 0.5 }}>
            DETAIL KPI INDIVIDU
          </div>
          
          {filteredKpi.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#b0bcc8', fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 8 }}>
              {karyawan.kpi.length === 0 ? 'Belum ada KPI yang diisi.' : 'Tidak ada KPI yang cocok dengan pencarian.'}
            </div>
          ) : (
            <div className="table-container">
              <table className="kpi-table">
                <thead>
                  <tr>
                    <th style={{ width: 50, textAlign: 'center' }}>No</th>
                    <th>Detail KPI</th>
                    <th>Polaritas</th>
                    <th>Target Total</th>
                    {/* Header akan otomatis berubah jadi "Target s.d Apr" dll */}
                    <th>Target s.d {namaBulanSekarang}</th>
                    <th>Realisasi s.d {namaBulanSekarang}</th>
                    <th style={{ textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredKpi.map((kpi, idx) => {
                    // Panggil data secara dinamis berdasarkan bulan ini
                    const targetBulanIni = kpi[`target_${bulanDb}`];
                    const realisasiBulanIni = kpi[`realisasi_${bulanDb}`];

                    // Cek apakah KPI sudah di-approve
                    const isApproved = kpi.status === 'approved';

                    return (
                      <tr key={kpi.id}>
                        <td style={{ textAlign: 'center', color: '#64748b', fontWeight: 500 }}>{idx + 1}</td>
                        <td style={{ fontWeight: 600 }}>{kpi.nama_kpi}</td>
                        <td>{kpi.polaritas || 'Maximize'}</td>
                        
                        {/* Target Tahunan: Kalau ada angka, tampilkan angka + satuan. Kalau kosong, tampilkan '-' saja */}
                        <td>{kpi.target_tahunan ? `${kpi.target_tahunan} ${kpi.satuan || '%'}` : '-'}</td>
                        
                        {/* Target s.d Bulan Ini: Kalau ada angka, tampilkan angka + satuan. Kalau kosong, tampilkan '-' saja */}
                        <td>{targetBulanIni ? `${targetBulanIni} ${kpi.satuan || '%'}` : '-'}</td>
                        
                        {/* Realisasi s.d Bulan Ini */}
                        <td>
                          {!isApproved ? (
                            <span style={{ fontSize: 11, color: '#d97706', background: '#fef3c7', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                              Belum Approved
                            </span>
                          ) : (
                            realisasiBulanIni ? (
                              <span style={{ fontWeight: 700, color: '#10b981' }}>{`${realisasiBulanIni} ${kpi.satuan || '%'}`}</span>
                            ) : '-'
                          )}
                        </td>
                        
                        <td style={{ textAlign: 'center' }}>
                          <button className="btn-detail-outline" onClick={() => onViewDetail(kpi)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                            Detail
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer Progress & Evaluasi */}
          <div className="progress-footer">
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 700, color: '#1e293b', flex: 1, minWidth: 250 }}>
              Total Progress KPI: <span style={{ color: '#10b981', marginLeft: 4, marginRight: 12 }}>100%</span>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div style={{ fontSize: 13, color: '#475569' }}>
              <span style={{ fontWeight: 700, color: '#1e293b' }}>Evaluasi Akhir:</span> <span style={{ color: '#10b981', fontWeight: 600 }}>Melampaui Target.</span> Berdasarkan persetujuan atasan.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── HALAMAN UTAMA (TIDAK ADA LOGIKA YANG DIUBAH) ─────────────
export default function RekapPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [expandAll, setExpandAll]   = useState(false);
  const [selectedKpi, setSelectedKpi] = useState(null);

  useEffect(() => {
    fetch('/api/rekap')
      .then(r => r.json())
      .then(d => setData(d.data || []))
      .finally(() => setLoading(false));
  }, []);

  const units = [...new Set(data.map(k => k.unit_kerja).filter(Boolean))].sort();

  const filtered = data.filter(k => {
    const matchUnit = filterUnit ? k.unit_kerja === filterUnit : true;
    const matchSearch = !search ||
      k.nama?.toLowerCase().includes(search.toLowerCase()) ||
      k.npk?.toLowerCase().includes(search.toLowerCase()) ||
      k.kpi.some(kpi =>
        kpi.nama_kpi?.toLowerCase().includes(search.toLowerCase()) ||
        kpi.perspektif_bsc?.toLowerCase().includes(search.toLowerCase()) ||
        kpi.sasaran_strategis?.toLowerCase().includes(search.toLowerCase())
      );
    return matchUnit && matchSearch;
  });

  const totalKpi      = data.reduce((s, k) => s + k.kpi.length, 0);
  const totalApproved = data.reduce((s, k) => s + k.kpi.filter(p => p.status === 'approved').length, 0);

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .search-box { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 0 14px; }
        .search-box input { flex: 1; border: none; outline: none; font-size: 14px; padding: 10px 0; background: transparent; color: #1e293b; font-family: 'Plus Jakarta Sans', sans-serif; }
        .search-box input::placeholder { color: #94a3b8; }
        .filter-select { padding: 10px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #374151; background: #fff; cursor: pointer; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .table-container { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 16px; background: #fff; }
        .kpi-table { width: 100%; border-collapse: collapse; text-align: left; }
        .kpi-table th { padding: 12px 16px; font-size: 12px; font-weight: 700; color: #475569; background: #f8fafc; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
        .kpi-table td { padding: 14px 16px; font-size: 13px; color: #1e293b; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
        .kpi-table tbody tr:last-child td { border-bottom: none; }
        .kpi-table tbody tr:hover { background: #f8fafc; }
        
        .btn-detail-outline { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; background: #fff; border: 1.5px solid #bfdbfe; color: #3b7dd8; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-detail-outline:hover { background: #eff6ff; border-color: #93c5fd; }
        
        .progress-footer { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .progress-bar-bg { flex: 1; max-width: 250px; height: 6px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: #10b981; border-radius: 4px; }
        
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .progress-footer { flex-direction: column; align-items: flex-start; }
          .progress-bar-bg { max-width: 100%; }
        }

        /* ─── CSS MODAL BARU (HANYA INI YANG DITAMBAHKAN) ─── */
        .modal-overlay-admin { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); z-index: 999; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; backdrop-filter: blur(4px); }
        .modal-admin { background: #fff; border-radius: 16px; width: 100%; max-width: 680px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,.25); animation: modalIn .3s ease-out; display: flex; flex-direction: column; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .modal-header-admin { padding: 20px 24px; border-bottom: 1px solid #f0f4f8; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 10; }
        .modal-header-admin h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0; }
        .modal-close-admin { width: 32px; height: 32px; border-radius: 8px; background: #f0f4f8; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .15s; color: #7a8b9a; }
        .modal-close-admin:hover { background: #e2e8f0; color: #1a2b4a; }
        
        .modal-body-admin { padding: 24px; }
        .detail-section { margin-bottom: 24px; }
        .detail-section h4 { font-size: 11px; font-weight: 700; color: #7a8b9a; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f0f4f8; }
        .detail-row { display: grid; grid-template-columns: 160px 1fr; gap: 8px; margin-bottom: 10px; font-size: 14px; }
        .detail-key { color: #7a8b9a; font-weight: 600; }
        .detail-val { color: #1e293b; font-weight: 500; }
        
        .target-grid-sm { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }
        .target-cell-sm { background: #fff; border-radius: 8px; padding: 10px; text-align: center; border: 1px solid #e8edf2; box-shadow: 0 1px 2px rgba(0,0,0,0.02); }
        .target-cell-sm .t-lbl { font-size: 11px; color: #1e293b; font-weight: 700; margin-bottom: 6px; text-transform: uppercase; border-bottom: 1px solid #f0f4f8; padding-bottom: 4px; }
        .target-cell-sm .t-split { display: flex; flex-direction: column; gap: 4px; text-align: left; }
        .target-cell-sm .t-target, .target-cell-sm .t-real { font-size: 12px; font-weight: 600; color: #374151; display: flex; justify-content: space-between; }
        .target-cell-sm .t-real { color: #2563eb; }
        
        .modal-actions-admin { display: flex; gap: 10px; padding: 16px 24px; border-top: 1px solid #f0f4f8; justify-content: flex-end; position: sticky; bottom: 0; background: #fff; }
        .btn-modal { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; border: none; transition: all .15s; }
        .btn-cancel { background: #f4f6f9; color: #374151; }
        .btn-cancel:hover { background: #e8edf2; color: #1e293b; }

        @media (max-width: 768px) {
          .target-grid-sm { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      {/* Header Halaman */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>Rekap KPI Unit Kerja</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Ringkasan KPI karyawan di unit kerja kamu.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '8px 16px', border: '1px solid #e2e8f0', fontSize: 13, color: '#64748b' }}>
            Total <strong style={{ color: '#1e293b' }}>{totalKpi}</strong> KPI · <strong style={{ color: '#16a34a' }}>{totalApproved}</strong> Approved
          </div>
        </div>
      </div>

      {/* Toolbar Pencarian & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input placeholder="Cari nama, NPK, atau nama KPI..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        {units.length > 0 && (
          <select className="filter-select" value={filterUnit} onChange={e => setFilterUnit(e.target.value)}>
            <option value="">Semua Unit Kerja</option>
            {units.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        )}
      </div>

      {/* Konten Data */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#64748b' }}>⏳ Memuat data rekap...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#64748b' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p>{search || filterUnit ? 'Tidak ada hasil pencarian.' : 'Belum ada data karyawan.'}</p>
        </div>
      ) : (
        filtered.map(k => (
          <KaryawanCard key={k.id} karyawan={k} defaultOpen={expandAll} search={search} onViewDetail={setSelectedKpi} />
        ))
      )}

      {/* ════════════ MODAL POPUP DETAIL KPI YANG DIPANGGIL ════════════ */}
      <KpiDetailModal 
        kpi={selectedKpi} 
        onClose={() => setSelectedKpi(null)} 
      />
    </>
  );
}