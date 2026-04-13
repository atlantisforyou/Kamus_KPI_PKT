'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';

const Skel = ({ w = '100%', h = '14px', r = '6px' }) => (
  <span style={{ display: 'inline-block', width: w, height: h, background: '#eef2f7', borderRadius: r, animation: 'pulse 1.2s infinite' }} />
);

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     color: '#6b7280', bg: '#f3f4f6' },
  submitted: { label: 'Submitted', color: '#d97706', bg: '#fef3c7' },
  reviewed:  { label: 'Reviewed',  color: '#2563eb', bg: '#dbeafe' },
  approved:  { label: 'Approved',  color: '#16a34a', bg: '#dcfce7' },
};

const StatBadge = ({ s }) => {
  const c = STATUS_CONFIG[s?.toLowerCase()] || { label: s, color: '#6b7280', bg: '#f3f4f6' };
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color, whiteSpace: 'nowrap' }}>{c.label}</span>;
};

const Ico = {
  Empty: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  Warn:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
};

export default function KeyPartnerDashboard() {
  const [data, setData] = useState({ s: { drf: 0, sub: 0, rev: 0, app: 0, tot: 0 }, h: [], ld: true });

  useEffect(() => {
    fetch('/api/kamus?all=true').then(r => r.json()).then(d => {
      const l = d.data || [];
      const c = (stat) => l.filter(k => k.status === stat).length;
      setData({
        s: { tot: l.length, drf: c('draft'), sub: c('submitted'), rev: c('reviewed'), app: c('approved') },
        h: l.filter(k => ['reviewed','approved'].includes(k.status)).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)),
        ld: false
      });
    }).catch(() => setData(p => ({ ...p, ld: false })));
  }, []);

  const fmtTgl = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
  const { s, h, ld } = data;

  return (
    <>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}
        .welcome { margin-bottom: 24px; }
        .welcome h1 { font-size: 22px; font-weight: 700; color: #1a2b4a; margin-bottom: 4px; }
        .welcome p { font-size: 14px; color: #7a8b9a; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .main-row { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
        @media (max-width: 768px) { .main-row { grid-template-columns: 1fr; } }
        .section-title { font-size: 15px; font-weight: 700; color: #1a2b4a; margin-bottom: 4px; }
        .section-sub { font-size: 12px; color: #7a8b9a; margin-bottom: 12px; }
        .table-wrap { background: #fff; border-radius: 14px; box-shadow: 0 1px 8px rgba(0,0,0,.06); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { padding: 12px 16px; font-size: 10px; font-weight: 700; color: #7a8b9a; text-transform: uppercase; letter-spacing: .5px; background: #f8fafc; border-bottom: 1px solid #e8edf2; }
        td { padding: 12px 16px; font-size: 13px; color: #374151; border-bottom: 1px solid #f0f4f8; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafbfc; }
        .empty { text-align: center; padding: 40px; color: #b0bcc8; font-size: 13px; }
        .cta-card { background: linear-gradient(160deg, #1a2b4a 0, #243d6a 100%); border-radius: 14px; padding: 24px; display: flex; flex-direction: column; gap: 20px; }
        .cta-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,.1); border-radius: 20px; padding: 4px 12px; font-size: 11px; font-weight: 600; color: rgba(255,255,255,.8); width: fit-content; }
        .cta-title { font-size: 16px; font-weight: 700; color: #fff; margin: 0; }
        .cta-desc { font-size: 12px; color: rgba(255,255,255,.6); margin: 4px 0 0; line-height: 1.5; }
        .cta-num { font-size: 36px; font-weight: 800; color: #fff; line-height: 1; }
        .cta-num-lbl { font-size: 11px; color: rgba(255,255,255,.6); margin-top: 4px; }
        .btn-cta { padding: 10px 0; background: #3b7dd8; color: #fff; border: none; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; text-decoration: none; text-align: center; transition: background .2s; display: block; }
        .btn-cta:hover { background: #2563eb; }
      `}</style>

      <div>
        <div className="welcome">
          <h1>Dashboard Key Partner</h1>
          <p>Review dan teruskan pengajuan Kamus KPI dari karyawan ke Manajemen.</p>
        </div>

        <div className="stats-grid">
          <StatCard label="Total KPI" value={s.tot} color="#1a2b4a" loading={ld} />
          <StatCard label="Draft" value={s.drf} color="#6b7280" loading={ld} />
          <StatCard label="Reviewed" value={s.rev} color="#2563eb" loading={ld} />
          <StatCard label="Approved" value={s.app} color="#10b981" loading={ld} />
        </div>

        <div className="main-row">
          {/* Table Riwayat */}
          <div>
            <div className="section-title">Riwayat Review</div>
            <div className="section-sub">KPI yang sudah kamu proses</div>
            
            <div className="table-wrap">
              {ld ? (
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[1,2,3].map(i => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 90px', gap: 12 }}>
                      <Skel h="14px" w="100%" />
                      <Skel h="14px" w="70%" />
                      <Skel h="20px" w="100%" r="20px" />
                    </div>
                  ))}
                </div>
              ) : h.length === 0 ? (
                <div className="empty">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{Ico.Empty}</div>
                  <p>Belum ada riwayat review.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Nama KPI</th>
                      <th>Pengaju</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {h.map(k => (
                      <tr key={k.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#1a2b4a', fontSize: 13 }}>{k.nama_kpi}</div>
                          {k.perspektif_bsc && <div style={{ fontSize: 11, color: '#b0bcc8', marginTop: 2 }}>{k.perspektif_bsc}</div>}
                        </td>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: 12 }}>{k.pembuat_nama || '-'}</div>
                          <div style={{ fontSize: 11, color: '#7a8b9a' }}>{k.pembuat_unit || ''}</div>
                        </td>
                        <td style={{ fontSize: 12, color: '#7a8b9a', whiteSpace: 'nowrap' }}>{fmtTgl(k.updated_at)}</td>
                        <td><StatBadge s={k.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div>
            <div className="section-sub">&nbsp;</div>
            
            <div className="cta-card">
              <div>
                <div className="cta-badge">
                  {Ico.Warn} Perlu Ditinjau
                </div>
                <div style={{ marginTop: 16 }}>
                  <div className="cta-num">{ld ? <Skel w="40px" h="32px" r="6px" /> : s.sub}</div>
                  <div className="cta-num-lbl">KPI menunggu review</div>
                </div>
              </div>
              
              <div>
                <p className="cta-title">Review Kamus KPI</p>
                <p className="cta-desc">Periksa dan teruskan pengajuan KPI dari karyawan ke Manajemen.</p>
              </div>
              
              <Link href="/key-partner/review" className="btn-cta">
                Mulai Review &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}