'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import StatCard from '@/components/ui/StatCard';

const STATUS_CONFIG = {
  draft:     { label: 'Draft',     color: '#6b7280', bg: '#f3f4f6' },
  submitted: { label: 'Submitted', color: '#d97706', bg: '#fef3c7' },
  reviewed:  { label: 'Reviewed',  color: '#2563eb', bg: '#dbeafe' },
  approved:  { label: 'Approved',  color: '#16a34a', bg: '#dcfce7' },
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status?.toLowerCase()] || { label: status, color: '#6b7280', bg: '#f3f4f6' };
  return (
    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: s.bg, color: s.color }}>
      {s.label}
    </span>
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

        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }

        /* Setup Grid untuk Kiri Kanan */
        .main-row { display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }
        @media (max-width: 768px) { .main-row { grid-template-columns: 1fr; } }

        /* Penyesuaian CSS CTA Card agar pas di kolom kanan */
        .cta-card { background: linear-gradient(135deg, #1a2b4a 0%, #243d6a 100%); border-radius: 14px; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
        .cta-text h3 { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 6px; }
        .cta-text p  { font-size: 13px; color: rgba(255,255,255,0.6); line-height: 1.5; }
        .btn-cta { width: 100%; text-align: center; padding: 11px 0; background: #3b7dd8; color: #fff; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer; text-decoration: none; transition: background 0.2s; }
        .btn-cta:hover { background: #2563eb; }

        .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .section-title { font-size: 18px; font-weight: 700; color: #1a2b4a; }
        .section-sub   { font-size: 13px; color: #7a8b9a; margin-top: 3px; }

        .table-wrap { background: #fff; border-radius: 14px; box-shadow: 0 1px 8px rgba(0,0,0,0.06); overflow: hidden; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th { padding: 12px 16px; font-size: 11px; font-weight: 700; color: #7a8b9a; text-transform: uppercase; letter-spacing: 0.5px; background: #f8fafc; border-bottom: 1px solid #e8edf2; }
        td { padding: 14px 16px; font-size: 14px; color: #374151; border-bottom: 1px solid #f0f4f8; vertical-align: middle; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafbfc; }
        .empty { text-align: center; padding: 48px; color: #7a8b9a; font-size: 14px; }

        .skeleton { background: linear-gradient(90deg, #f0f4f8 25%, #e8edf2 50%, #f0f4f8 75%); background-size: 200% 100%; animation: shimmer 1.2s infinite; border-radius: 6px; height: 14px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
      `}</style>

      <div className="welcome">
        <h1>Dashboard Manajemen</h1>
        <p>Setujui atau kembalikan pengajuan Kamus KPI yang telah direview oleh Key Partner.</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total KPI" value={stats.total} color="#1a2b4a" loading={loading} />
        <StatCard label="Reviewed" value={stats.reviewed} color="#2563eb" loading={loading} />
        <StatCard label="Approved" value={stats.approved} color="#16a34a" loading={loading} />
      </div>

      <div className="main-row">
        
        <div>
          <div className="section-header">
            <div>
              <div className="section-title">Riwayat Keputusan</div>
              <div className="section-sub">KPI yang sudah di-approve atau dikembalikan untuk revisi</div>
            </div>
            {!loading && histori.length > 0 && (
              <span style={{ fontSize: '13px', color: '#7a8b9a', fontWeight: '500' }}>{histori.length} entri</span>
            )}
          </div>

          <div className="table-wrap">
            {loading ? (
              <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                          <div style={{ fontSize: '12px', color: '#7a8b9a', marginTop: '4px' }}>
                            📝 {k.catatan_approval.substring(0, 60)}{k.catatan_approval.length > 60 ? '...' : ''}
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{k.pembuat_nama || '-'}</div>
                        <div style={{ fontSize: '12px', color: '#7a8b9a', marginTop: '2px' }}>{k.pembuat_unit || '-'}</div>
                      </td>
                      <td>
                        {k.perspektif_bsc
                          ? <span style={{ background: '#f0f4f8', color: '#374151', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 500 }}>{k.perspektif_bsc}</span>
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

        <div>
          <div className="section-header">
            <div>
              <div className="section-title">Aksi Cepat</div>
              <div className="section-sub">&nbsp;</div>
            </div>
          </div>
          
          <div className="cta-card">
            <div className="cta-text">
              <h3>Approval Kamus KPI</h3>
              <p>Terdapat {loading ? '...' : stats.reviewed} KPI yang menunggu persetujuan kamu untuk masuk ke sistem.</p>
            </div>
            <Link href="/manajemen/approval" className="btn-cta">Lihat Pengajuan →</Link>
          </div>
        </div>

      </div>
    </>
  );
}