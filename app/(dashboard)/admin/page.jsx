'use client';

import { useState, useEffect } from 'react';
import StatCard from '@/components/ui/StatCard';

const Skel = ({ w = '100%', h = '14px', r = '6px' }) => <span style={{ display: 'inline-block', width: w, height: h, background: '#eef2f7', borderRadius: r, animation: 'pulse 1.2s infinite' }} />;

const PBar = ({ l, pct, c, tot, app, load }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1a2b4a' }}>{load ? <Skel w="140px" h="13px" /> : l}</span>
      <span style={{ fontSize: 14, fontWeight: 800, color: c }}>{load ? <Skel w="36px" h="13px" /> : `${pct}%`}</span>
    </div>
    <div style={{ height: 8, background: '#f0f4f8', borderRadius: 99, overflow: 'hidden' }}>
      {load ? <Skel w="100%" h="8px" r="99px" /> : <div style={{ height: '100%', width: `${pct}%`, background: c, borderRadius: 99, transition: 'width 0.8s ease' }} />}
    </div>
    {!load && <p style={{ fontSize: 11, color: '#b0bcc8', marginTop: 4 }}>{app} dari {tot} KPI ({tot === 0 ? '0%' : pct + '%'})</p>}
  </div>
);

const NOTIF_STYLE = {
  info:    { bg: '#f8fafc', border: '#3b7dd8' },
  warning: { bg: '#fffbeb', border: '#f59e0b' },
  success: { bg: '#f0fdf4', border: '#10b981' },
};

export default function AdminDashboard() {
  const [data, setData] = useState({ stat: null, bsc: [], notices: [], load: true });
  const [showModalNotif, setShowModalNotif] = useState(false);

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
        const allNotices = rNotif && rNotif.ok ? ((await rNotif.json()).data || []) : [];
        
        const count = (s) => kam.filter(k => k.status === s).length;
        const bscCats = ['Financial', 'Customer', 'Internal Business Process', 'Learning & Growth'];

        setData({
          stat: { kar: kar.length, kam: kam.length, drf: count('draft'), sub: count('submitted'), rev: count('reviewed'), app: count('approved') },
          bsc: bscCats.map(c => {
            const inCat = kam.filter(k => k.perspektif_bsc?.toLowerCase().includes(c.toLowerCase()));
            const app = inCat.filter(k => k.status === 'approved').length;
            return { l: c, tot: inCat.length, app, pct: inCat.length ? Math.round((app / inCat.length) * 100) : 0 };
          }),
          notices: allNotices,
          load: false
        });
      } catch { setData(p => ({ ...p, load: false })); }
    })();
  }, []);

  const { stat, bsc, notices, load } = data;
  const BSC_COLORS = ['#10b981', '#3b7dd8', '#f59e0b', '#8b5cf6'];
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
        @media (max-width: 768px){ .bottom-grid { grid-template-columns:1fr !important; } }
        
        /* Modal Styles */
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.4); z-index:999; display:flex; justify-content:center; align-items:center; padding:20px; animation: fadeIn 0.2s ease; }
        .modal-content { background:#fff; width:100%; max-width:600px; max-height:85vh; border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.15); display:flex; flex-direction:column; animation: slideUp 0.3s ease; }
        .modal-header { padding:20px 24px; border-bottom:1px solid #f0f4f8; display:flex; justify-content:space-between; align-items:center; }
        .modal-body { padding:24px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2b4a', marginBottom: 8 }}>Dashboard Admin</h1>
        <p style={{ color: '#7a8b9a', fontSize: 14, marginBottom: 28 }}>Selamat datang di panel Administrator Kamus KPI.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
          {cards.map(s => (
            <StatCard key={s.l} label={s.l} value={s.v} color={s.c} href={s.h} loading={load} />
          ))}
        </div>

        <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
          
          <div className="section-card">
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a2b4a', marginBottom: 4 }}>Progres Perspektif BSC</h2>
            <p style={{ fontSize: 13, color: '#7a8b9a', marginBottom: 22 }}>Distribusi dan status approval KPI berdasarkan 4 perspektif Balanced Scorecard.</p>
            {load ? Array.from({ length: 4 }).map((_, i) => <PBar key={i} load />) : 
              !bsc.length ? <p style={{ fontSize: 14, color: '#b0bcc8', textAlign: 'center', padding: '32px 0' }}>Belum ada data KPI.</p> : 
              bsc.map((p, i) => <PBar key={p.l} l={p.l} pct={p.pct} c={BSC_COLORS[i % BSC_COLORS.length]} tot={p.tot} app={p.app} load={false} />)}
          </div>

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

      {showModalNotif && (
        <div className="modal-overlay" onClick={() => setShowModalNotif(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a2b4a', margin: 0 }}>Semua Pemberitahuan</h2>
              <button 
                onClick={() => setShowModalNotif(false)} 
                style={{ background: '#f4f6f9', border: 'none', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              {notices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Tidak ada pemberitahuan.</div>
              ) : (
                notices.map((n) => {
                  const style = NOTIF_STYLE[n.tipe] || NOTIF_STYLE.info;
                  return (
                    <div key={`modal-${n.id}`} style={{ padding: '16px', background: style.bg, borderRadius: 10, borderLeft: `4px solid ${style.border}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#1a2b4a' }}>{n.judul}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: 12 }}>{n.waktu_teks}</div>
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