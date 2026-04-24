'use client';

import { useState, useEffect, useMemo } from 'react';
import StatCard from '@/components/ui/StatCard';

const Skel = ({ w = '100%', h = '14px', r = '6px' }) => <span style={{ display: 'inline-block', width: w, height: h, background: '#eef2f7', borderRadius: r, animation: 'pulse 1.2s infinite' }} />;

const NOTIF_STYLE = {
  info:    { bg: '#f8fafc', border: '#3b7dd8' },
  warning: { bg: '#fffbeb', border: '#f59e0b' },
  success: { bg: '#f0fdf4', border: '#10b981' },
};

export default function AdminDashboard() {
  const [rawData, setRawData] = useState({ kar: [], kam: [], notices: [], load: true });
  const [showModalNotif, setShowModalNotif] = useState(false);
  const [showModalKaryawan, setShowModalKaryawan] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); 
  
  // 1. STATE PERIODE (Default akan diisi dari Header)
  const [periode, setPeriode] = useState('');

  // 2. EFFECT UNTUK SINKRONISASI DENGAN HEADER.JSX
  useEffect(() => {
    // Fungsi untuk membaca periode dari Header
    const syncPeriodeFromHeader = () => {
      const savedYear = localStorage.getItem('periodeKamus');
      if (savedYear) {
        setPeriode(savedYear);
      } else {
        setPeriode(new Date().getFullYear().toString()); // Fallback tahun ini
      }
    };

    // Jalankan sekali saat halaman dimuat
    syncPeriodeFromHeader();

    // Dengarkan event perubahan dari Header.jsx
    window.addEventListener('periodeChanged', syncPeriodeFromHeader);

    // Bersihkan listener saat komponen di-unmount
    return () => {
      window.removeEventListener('periodeChanged', syncPeriodeFromHeader);
    };
  }, []);

  // Effect untuk Fetch Data Awal
  useEffect(() => {
    (async () => {
      try {
        const [rKar, rKam, rNotif] = await Promise.all([
          fetch('/api/karyawan').catch(() => null),
          fetch('/api/kamus?all=true').catch(() => null),
          fetch('/api/notifikasi').catch(() => null) 
        ]);

        const kar = rKar && rKar.ok ? ((await rKar.json()).data || []) : [];
        const kam = rKam && rKam.ok ? ((await rKam.json()).data || []) : [];
        const notices = rNotif && rNotif.ok ? ((await rNotif.json()).data || []) : [];
        
        setRawData({ kar, kam, notices, load: false });
      } catch { 
        setRawData(p => ({ ...p, load: false })); 
      }
    })();
  }, []);

  // Filter Data Berdasarkan Periode
  const dashboardData = useMemo(() => {
    const { kar, kam, notices, load } = rawData;
    
    // Pastikan string periode cocok. Mengabaikan filter jika periode kosong
    const filteredKam = !periode 
      ? kam 
      : kam.filter(item => {
          const itemTahun = item.tahun || (item.created_at ? item.created_at.substring(0, 4) : '');
          return String(itemTahun) === String(periode);
        });

    const count = (s) => filteredKam.filter(k => k.status === s).length;

    const mappedKaryawanStatus = kar.map(k => {
      const idKaryawan = String(k.id);
      const kamusKaryawan = filteredKam.filter(kamusItem => kamusItem && kamusItem.dibuat_oleh && String(kamusItem.dibuat_oleh) === idKaryawan);
      
      const draft = kamusKaryawan.filter(item => item.status === 'draft').length;
      const submitted = kamusKaryawan.filter(item => item.status === 'submitted').length;
      const reviewed = kamusKaryawan.filter(item => item.status === 'reviewed').length;
      const approved = kamusKaryawan.filter(item => item.status === 'approved').length;

      return {
        id: k.id,
        nama: k.nama,
        sudahMembuat: kamusKaryawan.length > 0,
        stats: { draft, submitted, reviewed, approved, total: kamusKaryawan.length }
      };
    });

    return {
      load,
      notices,
      stat: { 
        kar: kar.length, 
        kam: filteredKam.length, 
        drf: count('draft'), 
        sub: count('submitted'), 
        rev: count('reviewed'), 
        app: count('approved') 
      },
      karyawanStatus: mappedKaryawanStatus
    };
  }, [rawData, periode]);

  const { stat, karyawanStatus, notices, load } = dashboardData;

  const filteredKaryawan = karyawanStatus.filter(k => 
    k.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const cards = [
    { l: 'Total Karyawan', v: stat?.kar, c: '#3b7dd8', h: '/admin/karyawan' },
    { l: 'Total Kamus KPI',v: stat?.kam, c: '#1a2b4a', h: '/admin/monitoring' },
    { l: 'Draft',          v: stat?.drf, c: '#6b7280', h: '/admin/monitoring' },
    { l: 'Submitted',      v: stat?.sub, c: '#d97706', h: '/admin/monitoring' },
    { l: 'Reviewed',       v: stat?.rev, c: '#2563eb', h: '/admin/monitoring' },
    { l: 'Approved',       v: stat?.app, c: '#10b981', h: '/admin/monitoring' },
  ];

  return (
    <>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
        .section-card { background:#fff; border-radius:14px; padding:24px; box-shadow:0 1px 8px rgba(0,0,0,.06); }
        .view-all-link { font-size:13px; color:#3b7dd8; font-weight:600; text-decoration:none; background:transparent; border:none; cursor:pointer; padding:0; font-family:inherit; }
        .view-all-link:hover { opacity:0.8; }
        
        .karyawan-list::-webkit-scrollbar { width: 6px; }
        .karyawan-list::-webkit-scrollbar-track { background: #f0f4f8; border-radius: 4px; }
        .karyawan-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

        .search-input { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; outline: none; transition: border-color 0.2s; color: #1a2b4a; background-color: #ffffff; }
        .search-input:focus { border-color: #3b7dd8; }

        @media (max-width: 768px){ .bottom-grid { grid-template-columns:1fr !important; } }
        
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:999; display:flex; justify-content:center; align-items:center; padding:20px; animation: fadeIn 0.2s ease; }
        .modal-content { background:#fff; width:100%; max-width:900px; max-height:85vh; border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.15); display:flex; flex-direction:column; animation: slideUp 0.3s ease; }
        .modal-header { padding:20px 24px; border-bottom:1px solid #f0f4f8; display:flex; justify-content:space-between; align-items:center; }
        .modal-body { padding:24px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      
      <div>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2b4a', marginBottom: 8 }}>Dashboard Admin</h1>
          <p style={{ color: '#7a8b9a', fontSize: 14, margin: 0 }}>Selamat datang di panel Administrator Kamus KPI.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
          {cards.map(s => (
            <StatCard key={s.l} label={s.l} value={s.v} color={s.c} href={s.h} loading={load} />
          ))}
        </div>

        <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          
          {/* SECTION STATUS PEMBUATAN KAMUS */}
          <div className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a2b4a', margin: 0 }}>Status Pembuatan Kamus</h2>
              <button onClick={() => setShowModalKaryawan(true)} className="view-all-link">Lihat semua &rarr;</button>
            </div>
            <p style={{ fontSize: 13, color: '#7a8b9a', marginBottom: 22 }}>Daftar karyawan dan status pembuatan kamus KPI.</p>
            
            {load ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Skel h="48px" r="8px" /><Skel h="48px" r="8px" /><Skel h="48px" r="8px" />
              </div>
            ) : karyawanStatus.length === 0 ? (
              <p style={{ fontSize: 14, color: '#b0bcc8', textAlign: 'center', padding: '32px 0' }}>Belum ada data karyawan.</p>
            ) : (
              <div className="karyawan-list" style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 6 }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 4px', borderBottom: '2px solid #f0f4f8' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>NAMA KARYAWAN</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>STATUS KAMUS</span>
                </div>

                {karyawanStatus.slice(0, 5).map((k) => (
                  <div key={k.id} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 16px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1a2b4a' }}>{k.nama}</span>
                      <span style={{ 
                        fontSize: 11, 
                        fontWeight: 700, 
                        padding: '4px 10px', 
                        borderRadius: 99, 
                        color: k.sudahMembuat ? '#059669' : '#dc2626', 
                        background: k.sudahMembuat ? '#d1fae5' : '#fee2e2' 
                      }}>
                        {k.sudahMembuat ? 'Sudah' : 'Belum'}
                      </span>
                    </div>
                    
                    {k.sudahMembuat && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 2 }}>
                        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>Draft: <b>{k.stats.draft}</b></span>
                        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#fef3c7', color: '#d97706' }}>Sub: <b>{k.stats.submitted}</b></span>
                        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#dbeafe', color: '#2563eb' }}>Rev: <b>{k.stats.reviewed}</b></span>
                        <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: '#d1fae5', color: '#059669' }}>App: <b>{k.stats.approved}</b></span>
                      </div>
                    )}
                  </div>
                ))}
                {karyawanStatus.length > 5 && (
                  <p style={{ fontSize: 12, textAlign: 'center', color: '#94a3b8', marginTop: 10 }}>Menampilkan 5 dari {karyawanStatus.length} karyawan.</p>
                )}
              </div>
            )}
          </div>

          {/* SECTION NOTICE BOARD */}
          <div className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a2b4a', margin: 0 }}>Notice board</h2>
              <button onClick={() => setShowModalNotif(true)} className="view-all-link">View all &rarr;</button>
            </div>
            <div style={{ borderTop: '1px solid #f0f4f8', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {load ? (
                <><Skel h="60px" r="8px" /><Skel h="60px" r="8px" /></>
              ) : notices.length === 0 ? (
                <div style={{ fontSize: 13, color: '#7a8b9a', textAlign: 'center', padding: '20px 0' }}>Belum ada pemberitahuan.</div>
              ) : (
                notices.slice(0, 5).map((n) => {
                  const style = NOTIF_STYLE[n.tipe] || NOTIF_STYLE.info;
                  return (
                    <div key={n.id} style={{ padding: '14px', background: style.bg, borderRadius: 8, borderLeft: `3px solid ${style.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a2b4a' }}>{n.judul}</div>
                        <div style={{ fontSize: 10, color: '#a0aec0', whiteSpace: 'nowrap', marginLeft: 8 }}>{n.waktu_teks}</div>
                      </div>
                      <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{n.pesan}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KARYAWAN */}
      {showModalKaryawan && (
        <div className="modal-overlay" onClick={() => setShowModalKaryawan(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a2b4a', margin: 0 }}>Status Karyawan</h2>
                <p style={{ fontSize: 12, color: '#7a8b9a', margin: 0 }}>Total {karyawanStatus.length} karyawan</p>
              </div>
              <button onClick={() => { setShowModalKaryawan(false); setSearchTerm(''); }} style={{ background: '#f4f6f9', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f4f8' }}>
              <input 
                type="text" 
                placeholder="Cari nama karyawan..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            <div className="modal-body">
              {filteredKaryawan.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Karyawan tidak ditemukan.</div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 4px', borderBottom: '2px solid #f0f4f8', marginBottom: '4px' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>NAMA KARYAWAN</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>STATUS KAMUS</span>
                  </div>
                  {filteredKaryawan.map((k) => (
                    <div key={`modal-${k.id}`} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a2b4a' }}>{k.nama}</span>
                        <span style={{ 
                          fontSize: 12, 
                          fontWeight: 700, 
                          padding: '5px 12px', 
                          borderRadius: 99, 
                          color: k.sudahMembuat ? '#059669' : '#dc2626', 
                          background: k.sudahMembuat ? '#d1fae5' : '#fee2e2' 
                        }}>
                          {k.sudahMembuat ? 'Sudah Membuat' : 'Belum Membuat'}
                        </span>
                      </div>

                      {k.sudahMembuat && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: '#f1f5f9', color: '#64748b' }}>Draft: <b>{k.stats.draft}</b></span>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: '#fef3c7', color: '#d97706' }}>Submitted: <b>{k.stats.submitted}</b></span>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: '#dbeafe', color: '#2563eb' }}>Reviewed: <b>{k.stats.reviewed}</b></span>
                          <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: '#d1fae5', color: '#059669' }}>Approved: <b>{k.stats.approved}</b></span>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOTIFIKASI */}
      {showModalNotif && (
        <div className="modal-overlay" onClick={() => setShowModalNotif(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a2b4a', margin: 0 }}>Semua Pemberitahuan</h2>
              <button onClick={() => setShowModalNotif(false)} style={{ background: '#f4f6f9', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', color: '#64748b' }}>✕</button>
            </div>
            <div className="modal-body">
              {notices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Tidak ada pemberitahuan.</div>
              ) : (
                notices.map((n) => {
                  const style = NOTIF_STYLE[n.tipe] || NOTIF_STYLE.info;
                  return (
                    <div key={`modal-notif-${n.id}`} style={{ padding: '16px', background: style.bg, borderRadius: 10, borderLeft: `4px solid ${style.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a2b4a' }}>{n.judul}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{n.waktu_teks}</div>
                      </div>
                      <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{n.pesan}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}