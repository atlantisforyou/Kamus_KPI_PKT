'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STAT_CFG = {
  draft:     { l: 'Draft',     c: '#6b7280', bg: '#f3f4f6' },
  submitted: { l: 'Submitted', c: '#d97706', bg: '#fef3c7' },
  reviewed:  { l: 'Reviewed',  c: '#2563eb', bg: '#dbeafe' },
  approved:  { l: 'Approved',  c: '#16a34a', bg: '#dcfce7' },
};

const CSS = `*{box-sizing:border-box}.welcome{margin-bottom:24px}.welcome h1{font-size:22px;font-weight:700;color:#1a2b4a;margin-bottom:4px}.welcome p{font-size:14px;color:#7a8b9a}.stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:24px}.stat-card{background:#fff;border-radius:12px;padding:16px 18px;box-shadow:0 1px 6px rgba(0,0,0,.06);border-left:4px solid var(--c)}.stat-num{font-size:26px;font-weight:700;color:var(--c)}.stat-lbl{font-size:11px;color:#7a8b9a;margin-top:2px;font-weight:500}.main-row{display:grid;grid-template-columns:1fr 300px;gap:16px;align-items:start}@media (max-width:768px){.main-row{grid-template-columns:1fr}}.section-title{font-size:15px;font-weight:700;color:#1a2b4a;margin-bottom:12px}.section-sub{font-size:12px;color:#7a8b9a;margin-bottom:12px;margin-top:-8px}.table-wrap{background:#fff;border-radius:14px;box-shadow:0 1px 8px rgba(0,0,0,.06);overflow:hidden}table{width:100%;border-collapse:collapse}th{text-align:left;padding:10px 14px;font-size:10px;font-weight:700;color:#7a8b9a;text-transform:uppercase;letter-spacing:.5px;background:#f8fafc;border-bottom:1px solid #e8edf2}td{padding:11px 14px;font-size:13px;color:#374151;border-bottom:1px solid #f0f4f8;vertical-align:middle}tr:last-child td{border-bottom:none}tr:hover td{background:#fafbfc}.empty{text-align:center;padding:40px;color:#b0bcc8;font-size:13px}.cta-card{background:linear-gradient(160deg,#1a2b4a 0,#243d6a 100%);border-radius:14px;padding:24px 22px;display:flex;flex-direction:column;gap:16px}.cta-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.1);border-radius:20px;padding:4px 12px;font-size:11px;font-weight:600;color:rgba(255,255,255,.7);width:fit-content}.cta-title{font-size:16px;font-weight:700;color:#fff;margin:0}.cta-desc{font-size:12px;color:rgba(255,255,255,.55);margin:4px 0 0}.cta-num{font-size:36px;font-weight:800;color:#fff;line-height:1}.cta-num-lbl{font-size:11px;color:rgba(255,255,255,.5);margin-top:2px}.btn-cta{padding:11px 0;background:#3b7dd8;color:#fff;border:none;border-radius:10px;font-size:13px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;text-decoration:none;text-align:center;transition:background .2s;display:block}.btn-cta:hover{background:#2563eb}.skeleton{background:linear-gradient(90deg,#f0f4f8 25%,#e8edf2 50%,#f0f4f8 75%);background-size:200% 100%;animation:shimmer 1.2s infinite;border-radius:6px;height:13px}@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`;

const Ico = {
  Empty: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#b0bcc8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  Warn:  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
};

const StatBadge = ({ s }) => {
  const c = STAT_CFG[s] || { l: s, c: '#6b7280', bg: '#f3f4f6' };
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: c.bg, color: c.c, whiteSpace: 'nowrap' }}>{c.l}</span>;
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
      <style>{CSS}</style>
      <div className="welcome">
        <h1>Dashboard Key Partner</h1>
        <p>Review dan teruskan pengajuan Kamus KPI dari karyawan ke Manajemen.</p>
      </div>

      <div className="stats-grid">
        {[{ l: 'Total KPI', v: s.tot, c: '#1a2b4a' }, { l: 'Draft', v: s.drf, c: '#6b7280' }, { l: 'Reviewed', v: s.rev, c: '#2563eb' }, { l: 'Approved', v: s.app, c: '#16a34a' }].map(x => (
          <div key={x.l} className="stat-card" style={{ '--c': x.c }}><div className="stat-num">{ld ? '...' : x.v}</div><div className="stat-lbl">{x.l}</div></div>
        ))}
      </div>

      <div className="main-row">
        <div>
          <div className="section-title">Riwayat Review</div><div className="section-sub">KPI yang sudah kamu proses</div>
          <div className="table-wrap">
            {ld ? (
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[1,2,3].map(i => <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 90px', gap: 12 }}><div className="skeleton" /><div className="skeleton" style={{ width: '70%' }} /><div className="skeleton" style={{ borderRadius: 20 }} /></div>)}
              </div>
            ) : h.length === 0 ? <div className="empty"><div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>{Ico.Empty}</div><p>Belum ada riwayat review.</p></div> : (
              <table>
                <thead><tr><th>Nama KPI</th><th>Pengaju</th><th>Tanggal</th><th>Status</th></tr></thead>
                <tbody>
                  {h.map(k => (
                    <tr key={k.id}>
                      <td><div style={{ fontWeight: 600, color: '#1a2b4a', fontSize: 13 }}>{k.nama_kpi}</div>{k.perspektif_bsc && <div style={{ fontSize: 11, color: '#b0bcc8', marginTop: 1 }}>{k.perspektif_bsc}</div>}</td>
                      <td><div style={{ fontWeight: 500, fontSize: 12 }}>{k.pembuat_nama || '-'}</div><div style={{ fontSize: 11, color: '#7a8b9a' }}>{k.pembuat_unit || ''}</div></td>
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
          <div className="section-title">Aksi Cepat</div><div className="section-sub">&nbsp;</div>
          <div className="cta-card">
            <div>
              <div className="cta-badge">{Ico.Warn} Perlu Ditinjau</div>
              <div style={{ marginTop: 14 }}><div className="cta-num">{ld ? '...' : s.sub}</div><div className="cta-num-lbl">KPI menunggu review</div></div>
            </div>
            <div><p className="cta-title">Review Kamus KPI</p><p className="cta-desc">Periksa dan teruskan pengajuan KPI dari karyawan ke Manajemen.</p></div>
            <Link href="/key-partner/review" className="btn-cta">Mulai Review →</Link>
          </div>
        </div>
      </div>
    </>
  );
}