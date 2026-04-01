'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Icon, ROLE_LABEL } from './Sidebar';

const LABELS = {
    '/user': 'Dashboard', '/user/kamus': 'Kamus KPI Saya', '/user/kamus/tambah': 'Tambah KPI',
    '/key-partner': 'Dashboard', '/key-partner/review': 'Review Kamus',
    '/admin': 'Dashboard', '/admin/tambah-karyawan': 'Tambah Karyawan', '/admin/karyawan': 'Kelola Karyawan', '/admin/monitoring': 'Monitoring',
    '/manajemen': 'Dashboard', '/manajemen/approval': 'Approval Kamus',
};

export default function Header({ onMenuToggle, sidebarOpen, onLogout, loggingOut }) {
    const pathname = usePathname() || '';
    const roleLabel = ROLE_LABEL[pathname.split('/')[1]] || pathname.split('/')[1];
    
    const [drop, setDrop] = useState(false);
    const [u, setU] = useState({});

    useEffect(() => {
        fetch('/api/auth/me').then(r => r.json()).then(d => d.user && setU(d.user)).catch(() => {});
    }, []);

    const name = u.nama || roleLabel;
    const initial = name.charAt(0).toUpperCase();

    return (
        <div className="topbar">
        <button className="mobile-toggle" onClick={onMenuToggle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a2b4a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {sidebarOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
            </svg>
        </button>

        <span className="topbar-title">{LABELS[pathname] || 'Dashboard'}</span>

        <div className="topbar-right">
            <button className="profile-btn" onClick={() => setDrop(!drop)}>
            <div className="profile-avatar">{initial}</div>
            <span className="profile-name">{name}</span>
            <svg className={`profile-chevron ${drop ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
            </svg>
            </button>

            {drop && (
            <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setDrop(false)} />
                <div className="profile-dropdown">
                <div className="dropdown-header">
                    <div className="dropdown-nama">{name}</div>
                    <div className="dropdown-unit">{u.unit_kerja ? `Dept: ${u.unit_kerja}` : 'Kamus KPI System'}</div>
                    <span className="dropdown-role">{roleLabel}</span>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item danger" onClick={onLogout} disabled={loggingOut}>
                    <Icon name="logout" size={15} />
                    {loggingOut ? 'Keluar...' : 'Keluar'}
                </button>
                </div>
            </>
            )}
        </div>
        </div>
    );
}