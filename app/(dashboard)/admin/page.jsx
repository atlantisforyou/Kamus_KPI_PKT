'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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

// MAIN COMPONENT
export default function AdminDashboard() {
  const [data, setData] = useState({ stat: null, bsc: [], load: true });

  useEffect(() => {
    (async () => {
      try {
        const [rKar, rKam] = await Promise.all([fetch('/api/karyawan'), fetch('/api/kamus?all=true')]);
        const [kar, kam] = [((await rKar.json()).data || []), ((await rKam.json()).data || [])];
        
        const count = (s) => kam.filter(k => k.status === s).length;
        const bscCats = ['Financial', 'Customer', 'Internal Business Process', 'Learning & Growth'];

        setData({
          stat: { kar: kar.length, kam: kam.length, drf: count('draft'), sub: count('submitted'), rev: count('reviewed'), app: count('approved') },
          bsc: bscCats.map(c => {
            const inCat = kam.filter(k => k.perspektif_bsc?.toLowerCase().includes(c.toLowerCase()));
            const app = inCat.filter(k => k.status === 'approved').length;
            return { l: c, tot: inCat.length, app, pct: inCat.length ? Math.round((app / inCat.length) * 100) : 0 };
          }),
          load: false
        });
      } catch { setData(p => ({ ...p, load: false })); }
    })();
  }, []);

  const { stat, bsc, load } = data;
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
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}.stat-card{display:flex;flex-direction:column;justify-content:center;background:#fff;border-radius:12px;padding:20px 24px;box-shadow:0 1px 8px rgba(0,0,0,.06);text-decoration:none;transition:all .2s}.stat-card:hover{box-shadow:0 4px 16px rgba(0,0,0,.1);transform:translateY(-2px)}.section-card{background:#fff;border-radius:14px;padding:24px;box-shadow:0 1px 8px rgba(0,0,0,.06)}.act-link{display:block;font-size:13px;color:#3b7dd8;font-weight:600;padding:5px 0;text-decoration:none;transition:color .15s}.act-link:hover{color:#1a2b4a}@media (max-width: 768px){.bottom-grid{grid-template-columns:1fr !important}}`}</style>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a2b4a', marginBottom: 8 }}>Dashboard Admin</h1>
        <p style={{ color: '#7a8b9a', fontSize: 14, marginBottom: 28 }}>Selamat datang di panel Administrator Kamus KPI.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
          {cards.map(s => (
            <Link key={s.l} href={s.h} className="stat-card" style={{ borderLeft: `4px solid ${s.c}` }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: s.c, lineHeight: 1 }}>{load ? <Skel w="50px" h="28px" r="6px" /> : (s.v ?? '-')}</div>
              <div style={{ fontSize: 13, color: '#7a8b9a', marginTop: 6, fontWeight: 500 }}>{s.l}</div>
            </Link>
          ))}
        </div>

        <div className="bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
          <div className="section-card">
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a2b4a', marginBottom: 4 }}>Progres Perspektif BSC</h2>
            <p style={{ fontSize: 13, color: '#7a8b9a', marginBottom: 22 }}>Distribusi dan status approval KPI berdasarkan 4 perspektif Balanced Scorecard.</p>
            {load ? Array.from({ length: 4 }).map((_, i) => <PBar key={i} load />) : 
              !bsc.length ? <p style={{ fontSize: 14, color: '#b0bcc8', textAlign: 'center', padding: '32px 0' }}>Belum ada data KPI.</p> : 
              bsc.map((p, i) => <PBar key={p.l} l={p.l} pct={p.pct} c={BSC_COLORS[i % BSC_COLORS.length]} tot={p.tot} app={p.app} load={false} />)}
          </div>

          <div className="section-card">
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a2b4a', marginBottom: 16 }}>Aksi Cepat</h2>
            <div style={{ borderTop: '1px solid #f0f4f8', paddingTop: 16 }}>
              {[
                { l: '→ Kelola Karyawan', h: '/admin/karyawan' },
                { l: '→ Monitoring KPI',  h: '/admin/monitoring' },
              ].map(a => <Link key={a.h} href={a.h} className="act-link">{a.l}</Link>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}