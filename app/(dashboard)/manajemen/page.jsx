'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STATUS_CONFIG = {
  draft:     { label: 'Draft',      color: '#6b7280', bg: '#f3f4f6' },
  submitted: { label: 'Review',     color: '#d97706', bg: '#fef3c7' }, 
  reviewed:  { label: 'Reviewed',   color: '#2563eb', bg: '#dbeafe' }, 
  revisi:    { label: 'Revisi',     color: '#dc2626', bg: '#fef2f2' }, 
  approved:  { label: 'Approve',    color: '#16a34a', bg: '#dcfce7' }, 
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' };
  return (
    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: s.bg, color: s.color }}>{s.label}</span>
  );
}

export default function ManajemenDashboard() {
  const [stats, setStats]     = useState({ total: 0, reviewed: 0, approved: 0 });
  const [histori, setHistori] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/kamus?all=true')
      .then(r => r.json())
      .then(d => {
        const list = d.data || [];
        
        setStats({
          total:    list.length,
          reviewed: list.filter(k => k.status === 'reviewed').length,
          approved: list.filter(k => k.status === 'approved').length,
        });

        const hist = list
          .filter(k => ['approved', 'revisi'].includes(k.status))
          .sort((a, b) => 
            new Date(b.approved_at || b.updated_at) - new Date(a.approved_at || a.updated_at)
          );
        setHistori(hist);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatTgl = (d) => d
    ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    : '-';

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .welcome { margin-bottom: 28px; }
        .welcome h1 { font-size: 22px; font-weight: 700; color: #1a2b4a; margin-bottom: 6px; }
        .welcome p  { font-size: 14px; color: #7a8b9a; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: #fff; border-radius: 12px; padding: 18px 20px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06); border-left: 4px solid var(--c);
        }
        .stat-num { font-size: 28px; font-weight: 700; color: var(--c); }
        .stat-lbl { font-size: 12px; color: #7a8b9a; margin-top: 3px; }

        .cta-card {
          background: linear-gradient(135deg, #1a2b4a 0%, #243d6a 100%);
          border-radius: 14px; padding: 28px 32px; margin-bottom: 32px;
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
        }
        .cta-text h3 { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .cta-text p  { font-size: 13px; color: rgba(255,255,255,0.6); }
        .btn-cta {
          padding: 11px 24px; background: #3b7dd8; color: #fff; border: none;
          border-radius: 10px; font-size: 14px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
          text-decoration: none; white-space: nowrap; transition: background 0.2s;
        }
        .btn-cta:hover { background: #2563eb; }

        .section-header {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
        }
        .section-title { font-size: 18px; font-weight: 700; color: #1a2b4a; }
        .section-sub   { font-size: 13px; color: #7a8b9a; margin-top: 3px; }

        .table-wrap {
          background: #fff; border-radius: 14px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06); overflow: hidden;
        }
        table { width: 100%; border-collapse: collapse; }
        th {
          text-align: left; padding: 11px 16px; font-size: 11px; font-weight: 700;
          color: #7a8b9a; text-transform: uppercase; letter-spacing: 0.5px;
          background: #f8fafc; border-bottom: 1px solid #e8edf2;
        }
        td {
          padding: 13px 16px; font-size: 14px; color: #374151;
          border-bottom: 1px solid #f0f4f8; vertical-align: middle;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafbfc; }
        .empty { text-align: center; padding: 48px; color: #7a8b9a; font-size: 14px; }

        .skeleton {
          background: linear-gradient(90deg, #f0f4f8 25%, #e8edf2 50%, #f0f4f8 75%);
          background-size: 200% 100%; animation: shimmer 1.2s infinite;
          border-radius: 6px; height: 14px;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <div className="welcome">
        <h1>Dashboard Manajemen</h1>
        <p>Setujui atau kembalikan pengajuan Kamus KPI yang telah direview oleh Key Partner.</p>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total KPI', val: stats.total,    c: '#1a2b4a' },
          { label: 'Reviewed',  val: stats.reviewed, c: '#2563eb' },
          { label: 'Approved',  val: stats.approved, c: '#16a34a' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--c': s.c }}>
            <div className="stat-num">{loading ? '...' : s.val}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="cta-card">
        <div className="cta-text">
          <h3>Approval Kamus KPI</h3>
          <p>Terdapat {loading ? '...' : stats.reviewed} KPI yang menunggu persetujuan kamu.</p>
        </div>
        <Link href="/manajemen/approval" className="btn-cta">Lihat Pengajuan →</Link>
      </div>

      <div>
        <div className="section-header">
          <div>
            <div className="section-title">Riwayat Keputusan</div>
            <div className="section-sub">KPI yang sudah di-approve atau dikembalikan untuk revisi</div>
          </div>
          {!loading && histori.length > 0 && (
            <span style={{ fontSize: '13px', color: '#7a8b9a' }}>{histori.length} entri</span>
          )}
        </div>

        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 100px', gap: '16px' }}>
                  <div className="skeleton" />
                  <div className="skeleton" style={{ width: '70%' }} />
                  <div className="skeleton" style={{ width: '60%' }} />
                  <div className="skeleton" style={{ width: '80px' }} />
                  <div className="skeleton" style={{ width: '70px', borderRadius: '20px' }} />
                </div>
              ))}
            </div>
          ) : histori.length === 0 ? (
            <div className="empty">
              <div style={{ fontSize: '36px', margin: '0 auto 10px', width: 'fit-content' }}>📂</div>
              <p>Belum ada riwayat keputusan.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nama KPI</th>
                  <th>Pengaju</th>
                  <th>Perspektif BSC</th>
                  <th>Tanggal Keputusan</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {histori.map(k => (
                  <tr key={k.id}>
                    <td>
                      <span style={{ fontWeight: 600, color: '#1a2b4a' }}>{k.nama_kpi}</span>
                      {k.catatan_approval && (
                        <div style={{ fontSize: '12px', color: '#7a8b9a', marginTop: '2px' }}>
                          📝 {k.catatan_approval.substring(0, 60)}{k.catatan_approval.length > 60 ? '...' : ''}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{k.pembuat_nama || '-'}</div>
                      <div style={{ fontSize: '12px', color: '#7a8b9a' }}>{k.pembuat_unit || '-'}</div>
                    </td>
                    <td>
                      {k.perspektif_bsc
                        ? <span style={{ background: '#f0f4f8', color: '#374151', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 500 }}>{k.perspektif_bsc}</span>
                        : <span style={{ color: '#b0bcc8' }}>—</span>
                      }
                    </td>
                    <td style={{ fontSize: '13px', color: '#7a8b9a', whiteSpace: 'nowrap' }}>
                      {formatTgl(k.approved_at || k.updated_at)}
                    </td>
                    <td><StatusBadge status={k.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}