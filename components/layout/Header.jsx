'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Icon, ROLE_LABEL } from './Sidebar';

const LABELS = {
  '/user': 'Dashboard', '/user/kamus': 'Kamus KPI Saya', '/user/rekap': 'Monitoring KPI Saya',
  '/key-partner': 'Dashboard', '/key-partner/review': 'Review Kamus',
  '/admin': 'Dashboard', '/admin/rekap': 'Monitoring Kamus KPI', '/admin/karyawan': 'Kelola Karyawan', '/admin/monitoring': 'Katalog',
  '/manajemen': 'Dashboard', '/manajemen/approval': 'Approval Kamus',
};

export default function Header({ onLogout, loggingOut }) {
  const pathname = usePathname() || '';
  const roleLabel = ROLE_LABEL[pathname.split('/')[1]] || pathname.split('/')[1];
  
  const [dropProfile, setDropProfile] = useState(false);
  const [dropPeriode, setDropPeriode] = useState(false);
  
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({ length: currentYear - 2023 + 1 }, (_, i) => currentYear - i);

  const [u, setU] = useState({});

  useEffect(() => {
    const savedYear = localStorage.getItem('periodeKamus');
    if (savedYear) {
      setSelectedYear(parseInt(savedYear));
    } else {
      localStorage.setItem('periodeKamus', currentYear.toString());
    }
  }, [currentYear]);

  const handleYearChange = (y) => {
    setSelectedYear(y);
    setDropPeriode(false);
    
    localStorage.setItem('periodeKamus', y.toString());
    window.dispatchEvent(new Event('periodeChanged'));
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => d.user && setU(d.user))
      .catch(() => {});
  }, []);

  const name = u.nama || roleLabel;
  const initial = name.charAt(0).toUpperCase();
  
  const roleDisplay = u.npk ? `NPK: ${u.npk}` : (u.unit_kerja || roleLabel);

  return (
    <>
      <style>{`
        .topbar-modern {
          display: flex; justify-content: space-between; align-items: center;
          height: 70px; background: #ffffff; padding: 0 24px;
          border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 40;
        }

        .topbar-left { display: flex; align-items: center; gap: 16px; }
        
        .topbar-title { font-size: 18px; font-weight: 800; color: #0f4b8f; }

        .topbar-right { display: flex; align-items: center; gap: 24px; }

        /* Periode Dropdown */
        .periode-selector {
          display: flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: #475569; cursor: pointer;
          background: #f8fafc; padding: 6px 12px; border-radius: 8px; border: 1px solid #e2e8f0;
          transition: background 0.2s;
        }
        .periode-selector:hover { background: #f1f5f9; }
        
        .periode-dropdown-menu {
          position: absolute; top: 45px; left: 0;
          background: #ffffff; border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border: 1px solid #f1f5f9; width: 120px;
          display: flex; flex-direction: column; overflow: hidden;
        }
        .periode-item {
          padding: 10px 16px; font-size: 13px; font-weight: 600; color: #1e293b;
          background: none; border: none; text-align: left; cursor: pointer;
          transition: background 0.2s;
        }
        .periode-item:hover { background: #f1f5f9; }
        .periode-item.active { background: #eff6ff; color: #0f4b8f; font-weight: 700; }

        /* Profile */
        .profile-btn {
          display: flex; align-items: center; gap: 12px;
          background: none; border: none; cursor: pointer; text-align: left; padding: 0;
        }
        .profile-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: #0f4b8f; color: white; display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 16px;
        }
        .profile-info { display: flex; flex-direction: column; }
        .profile-name { font-size: 13px; font-weight: 700; color: #1e293b; }
        .profile-role { font-size: 11px; color: #64748b; font-weight: 500; }

        /* Profile Dropdown Popup */
        .profile-dropdown-menu {
          position: absolute; top: 50px; right: 0;
          background: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border: 1px solid #f1f5f9; width: 160px; display: flex; flex-direction: column; overflow: hidden;
        }
        .dropdown-item-danger {
          display: flex; align-items: center; gap: 10px; padding: 12px 16px; font-size: 13px; font-weight: 600;
          background: none; border: none; width: 100%; text-align: left; cursor: pointer;
          color: #ef4444; transition: background 0.2s;
        }
        .dropdown-item-danger:hover { background: #fef2f2; }

        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
          .topbar-right { gap: 16px; }
        }
      `}</style>

      <header className="topbar-modern">
        <div className="topbar-left">
          <span className="topbar-title">
            {LABELS[pathname] || 'Dashboard'}
          </span>
        </div>

        <div className="topbar-right">
          
          <div style={{ position: 'relative' }} className="hide-mobile">
            <button className="periode-selector" onClick={() => setDropPeriode(!dropPeriode)}>
              Periode: {selectedYear}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: dropPeriode ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {dropPeriode && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setDropPeriode(false)} />
                <div className="periode-dropdown-menu" style={{ zIndex: 200 }}>
                  {years.map(y => (
                    <button 
                      key={y} 
                      className={`periode-item ${selectedYear === y ? 'active' : ''}`}
                      onClick={() => handleYearChange(y)}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button className="profile-btn" onClick={() => setDropProfile(!dropProfile)}>
              <div className="profile-avatar">{initial}</div>
              <div className="profile-info hide-mobile">
                <span className="profile-name">{name}</span>
                <span className="profile-role">{roleDisplay}</span>
              </div>
            </button>

            {dropProfile && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setDropProfile(false)} />
                <div className="profile-dropdown-menu" style={{ zIndex: 200 }}>
                  <button className="dropdown-item-danger" onClick={onLogout} disabled={loggingOut}>
                    <Icon name="logout" size={16} />
                    {loggingOut ? 'Keluar...' : 'Keluar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}