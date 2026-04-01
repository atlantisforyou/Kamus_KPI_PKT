'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Menyesuaikan konfigurasi status dengan sistem terbaru
const STATUS_CONFIG = {
  draft:     { label: 'Draft',     color: '#6b7280', bg: '#f3f4f6' },
  submitted: { label: 'Submitted', color: '#d97706', bg: '#fef3c7' },
  reviewed:  { label: 'Reviewed',  color: '#2563eb', bg: '#dbeafe' },
  approved:  { label: 'Approved',  color: '#16a34a', bg: '#dcfce7' },
};

function StatusBadge({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
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

  // Memperbarui perhitungan stats sesuai permintaan (Total KPI, Draft, Reviewed, Approved)
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
          gap: 12px; margin-bottom: 28px;
        }
        .stat-card {
          background: #fff; border-radius: 12px; padding: 18px 20px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.06);
          border-left: 4px solid var(--c);
        }
        .stat-num { font-size: 28px; font-weight: 700; color: var(--c); }
        .stat-lbl { font-size: 12px; color: #7a8b9a; margin-top: 3px; font-weight: 500; }

        .section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .section-header h2 { font-size: 16px; font-weight: 700; color: #1a2b4a; }
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

        /* CTA */
        .btn-cta {
          padding: 11px 24px; background: #3b7dd8; color: #fff;
          border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif; cursor: pointer;
          text-decoration: none; white-space: nowrap;
          transition: background 0.2s;
        }
        .btn-cta:hover { background: #2563eb; }

        .empty { text-align: center; padding: 40px; color: #7a8b9a; font-size: 14px; }
        .loading { text-align: center; padding: 40px; color: #7a8b9a; font-size: 14px; }
      `}</style>

      <div className="welcome">
        <h1>Dashboard</h1>
        <p>Selamat datang! Kelola dan pantau pengajuan Kamus KPI kamu di sini.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          { label: 'Total KPI', val: stats.total,    c: '#1a2b4a' },
          { label: 'Draft',     val: stats.draft,    c: '#6b7280' },
          { label: 'Reviewed',  val: stats.reviewed, c: '#2563eb' },
          { label: 'Approved',  val: stats.approved, c: '#16a34a' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ '--c': s.c }}>
            <div className="stat-num">{s.val}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabel KPI Terbaru */}
      <div className="section-header">
        <h2>KPI Terbaru</h2>
        <Link href="/user/kamus" className="link-all">Lihat semua →</Link>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">⏳ Memuat data...</div>
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