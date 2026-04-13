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
    <span style={{ padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>
  );
}

function KpiCard({ kpi, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: '1px solid #e8edf2', borderRadius: 10, marginBottom: 8, overflow: 'hidden', background: '#fff' }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', background: open ? '#f8fafc' : '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
          <span style={{ width: 26, height: 26, borderRadius: 6, background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#7a8b9a', flexShrink: 0 }}>{idx + 1}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, color: '#1a2b4a', fontSize: 14 }}>{kpi.nama_kpi}</div>
            {kpi.perspektif_bsc && <div style={{ fontSize: 12, color: '#7a8b9a', marginTop: 1 }}>{kpi.perspektif_bsc}</div>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 12 }}>
          <StatusBadge status={kpi.status} />
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
      {open && (
        <div style={{ padding: '16px', borderTop: '1px solid #f0f4f8', background: '#fafbfc' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px 24px' }}>
            {[
              ['Sasaran Strategis', kpi.sasaran_strategis],
              ['Definisi KPI',      kpi.definisi_kpi],
              ['Tujuan KPI',        kpi.tujuan_kpi],
              ['Tipe KPI',          kpi.tipe_kpi],
              ['Formula Penilaian', kpi.formula_penilaian],
              ['Jenis Pengukuran',  kpi.jenis_pengukuran],
              ['Polaritas',         kpi.polaritas],
              ['Frekuensi',         kpi.frekuensi],
              ['Satuan',            kpi.satuan],
              ['Target Tahunan',    kpi.target_tahunan],
              ['Sumber Data',       kpi.sumber_data],
            ].map(([lbl, val]) => val ? (
              <div key={lbl} style={{ display: 'flex', gap: 8, fontSize: 13, alignItems: 'flex-start' }}>
                <span style={{ color: '#7a8b9a', fontWeight: 500, minWidth: 130, flexShrink: 0 }}>{lbl}</span>
                <span style={{ color: '#1a2b4a', fontWeight: 500 }}>{val}</span>
              </div>
            ) : null)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserRekapPage() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/rekap')
      .then(r => r.json())
      .then(d => setData((d.data || [])[0] || null))
      .finally(() => setLoading(false));
  }, []);

  const filteredKpi = (data?.kpi || []).filter(k =>
    !search ||
    k.nama_kpi?.toLowerCase().includes(search.toLowerCase()) ||
    k.perspektif_bsc?.toLowerCase().includes(search.toLowerCase()) ||
    k.sasaran_strategis?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = (data?.kpi || []).filter(k => k.status === s).length;
    return acc;
  }, {});

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .search-box { flex: 1; min-width: 200px; display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid #e5eaf0; border-radius: 10px; padding: 0 14px; }
        .search-box input { flex: 1; border: none; outline: none; font-size: 14px; padding: 10px 0; background: transparent; color: #1a2b4a; font-family: 'Plus Jakarta Sans', sans-serif; }
        .search-box input::placeholder { color: #b0bcc8; }
      `}</style>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2b4a', marginBottom: 6 }}>Rekap KPI Saya</h1>
        <p style={{ fontSize: 14, color: '#7a8b9a' }}>Ringkasan semua KPI yang telah kamu buat beserta detailnya.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#7a8b9a' }}>⏳ Memuat data rekap...</div>
      ) : !data ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#7a8b9a' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p>Belum ada data KPI.</p>
        </div>
      ) : (
        <>
          {/* Profile card */}
          <div style={{ background: 'linear-gradient(135deg, #1a2b4a 0%, #243d6a 100%)', borderRadius: 14, padding: '24px 28px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 22 }}>{data.nama?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: '#fff', fontSize: 18 }}>{data.nama}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{data.npk} {data.unit_kerja ? `· ${data.unit_kerja}` : ''}</div>
              </div>
            </div>
            {/* Stats */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { label: 'Total KPI',  val: data.kpi.length,    c: '#fff' },
                { label: 'Approved',   val: counts.approved,    c: '#86efac' },
                { label: 'Proses',     val: (counts.menunggu_review || 0) + (counts.menunggu_approval || 0), c: '#fde68a' },
                { label: 'Draft',      val: counts.draft,       c: 'rgba(255,255,255,0.5)' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: s.c }}>{s.val ?? 0}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <div className="search-box">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="Cari nama KPI atau perspektif..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* KPI list */}
          {filteredKpi.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, color: '#b0bcc8' }}>
              <p>{search ? 'Tidak ada KPI yang cocok.' : 'Belum ada KPI yang diisi.'}</p>
            </div>
          ) : (
            filteredKpi.map((kpi, idx) => <KpiCard key={kpi.id} kpi={kpi} idx={idx} />)
          )}
        </>
      )}
    </>
  );
}