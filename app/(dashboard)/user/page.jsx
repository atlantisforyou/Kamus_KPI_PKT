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
  const s = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.draft;
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
      fontWeight: '600', background: s.bg, color: s.color,
    }}>
      {s.label}
    </span>
  );
}

export default function UserDashboard() {
  const [kamus, setKamus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/kamus')
      .then(r => r.json())
      .then(d => setKamus(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: kamus.length,
    draft: kamus.filter(k => k.status === 'draft').length,
    reviewed: kamus.filter(k => k.status === 'reviewed').length,
    approved: kamus.filter(k => k.status === 'approved').length,
  };

  const recent = kamus.slice(0, 5);
  const formatTgl = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

  return (
    <>
      <style>{`
        .welcome { margin-bottom: 28px; }
        .welcome h1 { font-size: 22px; font-weight: 700; color: #1a2b4a; margin-bottom: 6px; }
        .welcome p { font-size: 14px; color: #7a8b9a; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 16px; margin-bottom: 28px;
        }

        .section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .section-header h2 { font-size: 16px; font-weight: 700; color: #1a2b4a; margin: 0; }
        .link-all {
          font-size: 13px; color: #3b7dd8; font-weight: 600;
          text-decoration: none;
        }
        .link-all:hover { text-decoration: underline; }

        .card {
          background: #fff; border-radius: 14px;
          box-shadow: 0 1px 8px rgba(0,0,0,0.06); overflow: hidden;
          margin-bottom: 20px;
        }

        table { width: 100%; border-collapse: collapse; }
        th {
          text-align: left; padding: 11px 16px;
          font-size: 11px; font-weight: 700; color: #7a8b9a;
          text-transform: uppercase; letter-spacing: 0.6px;
          background: #f8fafc; border-bottom: 1px solid #e8edf2;
        }
        td {
          padding: 13px 16px; font-size: 14px; color: #374151;
          border-bottom: 1px solid #f0f4f8; vertical-align: middle;
        }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: #fafbfc; }

        .kpi-name { font-weight: 600; color: #1a2b4a; }

        .empty { text-align: center; padding: 40px; color: #7a8b9a; font-size: 14px; }
        .loading { text-align: center; padding: 40px; color: #7a8b9a; font-size: 14px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>

      <div className="welcome">
        <h1>Dashboard</h1>
        <p>Selamat datang! Kelola dan pantau pengajuan Kamus KPI kamu di sini.</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Total KPI" value={stats.total} color="#1a2b4a" loading={loading} />
        <StatCard label="Draft" value={stats.draft} color="#6b7280" loading={loading} />
        <StatCard label="Reviewed" value={stats.reviewed} color="#2563eb" loading={loading} />
        <StatCard label="Approved" value={stats.approved} color="#16a34a" loading={loading} />
      </div>

      <div className="section-header">
        <h2>KPI Terbaru</h2>
        <Link href="/user/kamus" className="link-all">Lihat semua →</Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            Memuat data...
          </div>
        ) : recent.length === 0 ? (
          <div className="empty">
            Belum ada KPI. <Link href="/user/kamus" style={{ color: '#3b7dd8', fontWeight: 600 }}>Tambah sekarang →</Link>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nama KPI</th>
                <th>Perspektif BSC</th>
                <th>Tanggal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(k => (
                <tr key={k.id}>
                  <td><span className="kpi-name">{k.nama_kpi}</span></td>
                  <td style={{ fontSize: '13px', color: '#7a8b9a' }}>{k.perspektif_bsc || '-'}</td>
                  <td style={{ fontSize: '13px', color: '#7a8b9a', whiteSpace: 'nowrap' }}>{formatTgl(k.created_at)}</td>
                  <td><StatusBadge status={k.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}