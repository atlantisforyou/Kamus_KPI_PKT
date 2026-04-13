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

// ─── KOMPONEN BARIS KPI ──────────────────────────────────────────────
function KpiRow({ kpi, idx, onViewDetail }) {
  return (
    <div style={{ border: '1px solid #e8edf2', borderRadius: 10, marginBottom: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', transition: 'border-color 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
        <span style={{ width: 26, height: 26, borderRadius: 8, background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#7a8b9a', flexShrink: 0 }}>
          {idx + 1}
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: '#1a2b4a', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {kpi.nama_kpi}
          </div>
          <div style={{ fontSize: 12, color: '#7a8b9a', marginTop: 2 }}>
            {kpi.perspektif_bsc || 'Tanpa Perspektif'}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, marginLeft: 12 }}>
        <StatusBadge status={kpi.status} />
        {/* Tombol Detail Baru */}
        <button className="btn-detail-sm" onClick={() => onViewDetail(kpi)}>
          Detail
        </button>
      </div>
    </div>
  );
}

// ─── KOMPONEN KARTU KARYAWAN ─────────────────────────────────────────
function KaryawanCard({ karyawan, defaultOpen = false, search, onViewDetail }) {
  const [open, setOpen] = useState(defaultOpen);

  const filteredKpi = karyawan.kpi.filter(k =>
    !search ||
    k.nama_kpi?.toLowerCase().includes(search.toLowerCase()) ||
    k.perspektif_bsc?.toLowerCase().includes(search.toLowerCase()) ||
    k.sasaran_strategis?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = karyawan.kpi.filter(k => k.status === s).length;
    return acc;
  }, {});

  return (
    <div style={{ background: '#fff', borderRadius: 14, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', marginBottom: 12, overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', cursor: 'pointer', background: open ? '#f8fafc' : '#fff', borderBottom: open ? '1px solid #e8edf2' : 'none', transition: 'background .15s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: '#1a2b4a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{karyawan.nama?.charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#1a2b4a', fontSize: 15 }}>{karyawan.nama}</div>
            <div style={{ fontSize: 12, color: '#7a8b9a', marginTop: 1 }}>
              {karyawan.npk} {karyawan.unit_kerja ? `· ${karyawan.unit_kerja}` : ''}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 11, background: '#f0f4f8', color: '#374151', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
              {karyawan.kpi.length} KPI
            </span>
            {counts.approved > 0 && (
              <span style={{ fontSize: 11, background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{counts.approved} Approved</span>
            )}
            {counts.menunggu_review > 0 && (
              <span style={{ fontSize: 11, background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{counts.menunggu_review} Review</span>
            )}
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s', flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {open && (
        <div style={{ padding: '16px 20px', background: '#fafbfc' }}>
          {filteredKpi.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: '#b0bcc8', fontSize: 13 }}>
              {karyawan.kpi.length === 0 ? 'Belum ada KPI yang diisi.' : 'Tidak ada KPI yang cocok dengan pencarian.'}
            </div>
          ) : (
            filteredKpi.map((kpi, idx) => (
              <KpiRow key={kpi.id} kpi={kpi} idx={idx} onViewDetail={onViewDetail} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── HALAMAN UTAMA ───────────────────────────────────────────────────
export default function RekapPage() {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  const [expandAll, setExpandAll]   = useState(false);
  
  // State untuk menyimpan data KPI yang sedang dibuka detailnya (Modal)
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
        .search-box { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #e5eaf0; border-radius: 10px; padding: 0 14px; }
        .search-box input { flex: 1; border: none; outline: none; font-size: 14px; padding: 10px 0; background: transparent; color: #1a2b4a; font-family: 'Plus Jakarta Sans', sans-serif; }
        .search-box input::placeholder { color: #b0bcc8; }
        .filter-select { padding: 10px 14px; border: 1.5px solid #e5eaf0; border-radius: 10px; font-size: 14px; color: #374151; background: #fff; cursor: pointer; outline: none; font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-toggle { padding: 9px 16px; border: 1.5px solid #e5eaf0; border-radius: 10px; font-size: 13px; font-weight: 600; background: #fff; color: #374151; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all .15s; white-space: nowrap; }
        .btn-toggle:hover { background: #f4f6f9; }
        
        /* Style Tambahan untuk Tombol Detail & Modal Popup */
        .btn-detail-sm { padding: 6px 14px; background: #fff; color: #3b7dd8; border: 1.5px solid #e5eaf0; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; }
        .btn-detail-sm:hover { background: #eff6ff; border-color: #bfdbfe; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 20px; backdrop-filter: blur(4px); }
        
        /* DI SINI UBAHNYA: max-width dinaikkan dari 600px jadi 800px */
        .modal-box { background: #fff; border-radius: 16px; width: 100%; max-width: 800px; max-height: 85vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); display: flex; flex-direction: column; animation: modalIn 0.3s ease-out; }
        
        .modal-header { padding: 20px 24px; border-bottom: 1px solid #f0f4f8; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 10; }
        .modal-body { padding: 24px; }
        .btn-close { background: #f0f4f8; border: none; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #7a8b9a; transition: all 0.2s; }
        .btn-close:hover { background: #e2e8f0; color: #1a2b4a; }
        
        .detail-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        .detail-item { background: #f8fafc; padding: 14px 16px; border-radius: 10px; border: 1px solid #e8edf2; }
        .detail-lbl { display: block; font-size: 12px; color: #7a8b9a; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
        .detail-val { font-size: 14px; color: #1a2b4a; font-weight: 500; line-height: 1.5; }
        
        @keyframes modalIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2b4a', marginBottom: 6 }}>Rekap KPI Unit Kerja</h1>
          <p style={{ fontSize: 14, color: '#7a8b9a' }}>Ringkasan KPI karyawan di unit kerja kamu.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <div style={{ background: '#fff', borderRadius: 10, padding: '8px 16px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', fontSize: 13, color: '#7a8b9a' }}>
            Total <strong style={{ color: '#1a2b4a' }}>{totalKpi}</strong> KPI · <strong style={{ color: '#16a34a' }}>{totalApproved}</strong> Approved
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <button className="btn-toggle" onClick={() => setExpandAll(e => !e)}>
          {expandAll ? '▲ Tutup Karyawan' : '▼ Buka Karyawan'}
        </button>
      </div>

      {/* Content Data */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#7a8b9a' }}>⏳ Memuat data rekap...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#7a8b9a' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p>{search || filterUnit ? 'Tidak ada hasil pencarian.' : 'Belum ada data karyawan.'}</p>
        </div>
      ) : (
        filtered.map(k => (
          <KaryawanCard key={k.id} karyawan={k} defaultOpen={expandAll} search={search} onViewDetail={setSelectedKpi} />
        ))
      )}

      {/* ════════════ MODAL POPUP DETAIL KPI ════════════ */}
      {selectedKpi && (
        <div className="modal-overlay" onClick={() => setSelectedKpi(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            
            {/* Header Modal */}
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a2b4a', margin: 0 }}>Detail KPI</h2>
                <div style={{ fontSize: 13, color: '#7a8b9a', marginTop: 4 }}>{selectedKpi.nama_kpi}</div>
              </div>
              <button className="btn-close" onClick={() => setSelectedKpi(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Isi Modal */}
            <div className="modal-body">
              <div style={{ marginBottom: 20 }}>
                <StatusBadge status={selectedKpi.status} />
              </div>

              <div className="detail-grid">
                {[
                  ['Sasaran Strategis', selectedKpi.sasaran_strategis],
                  ['Perspektif BSC', selectedKpi.perspektif_bsc],
                  ['Definisi KPI', selectedKpi.definisi_kpi],
                  ['Tujuan KPI', selectedKpi.tujuan_kpi],
                  ['Karakteristik', `${selectedKpi.tipe_kpi || '-'} · ${selectedKpi.jenis_pengukuran || '-'} · ${selectedKpi.polaritas || '-'} · ${selectedKpi.frekuensi || '-'}`],
                  ['Formula Penilaian', selectedKpi.formula_penilaian],
                  ['Satuan & Target Tahunan', `${selectedKpi.target_tahunan || '-'} ${selectedKpi.satuan || ''}`],
                  ['Sumber Data', selectedKpi.sumber_data],
                ].map(([lbl, val]) => val && val.replace(/· -/g, '').trim() !== '-' ? (
                  <div key={lbl} className="detail-item">
                    <span className="detail-lbl">{lbl}</span>
                    <span className="detail-val">{val}</span>
                  </div>
                ) : null)}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}