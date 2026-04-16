'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const ROLE_LABEL = { 
  user: 'USER', 
  'key_partner': 'KEY PARTNER', 
  admin: 'ADMINISTRATOR', 
  manajemen: 'MANAJEMEN' 
};

export const Icon = ({ name, size = 16 }) => {
  const paths = {
    home: <><rect x="3" y="3" width="7" height="5" rx="1"/><rect x="14" y="3" width="7" height="9" rx="1"/><rect x="3" y="12" width="7" height="9" rx="1"/><rect x="14" y="16" width="7" height="5" rx="1"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></>,
    upload: <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    'bar-chart': <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    'check-circle': <><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    'menu-fold': <><line x1="4" y1="5" x2="20" y2="5"/><line x1="4" y1="19" x2="20" y2="19"/><polyline points="10 16 4 12 10 8"/><line x1="14" y1="10" x2="20" y2="10"/><line x1="14" y1="14" x2="20" y2="14"/></>,
    'menu-unfold': <><line x1="4" y1="5" x2="20" y2="5"/><line x1="4" y1="19" x2="20" y2="19"/><polyline points="14 16 20 12 14 8"/><line x1="4" y1="10" x2="10" y2="10"/><line x1="4" y1="14" x2="10" y2="14"/></>,
    list: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

export default function Sidebar({ role, user, isOpen, isCollapsed, toggleCollapse, onClose, onLogout, loggingOut }) {
  const pathname = usePathname() || '';
  
  const isManajemenDept = role === 'manajemen' && user?.departemen_id;
  
  const MENUS = {
    user: [
      { href: '/user', label: 'Dashboard', icon: 'home' }, 
      { href: '/user/kamus', label: 'Kamus KPI', icon: 'book' },
      { href: '/user/rekap', label: 'My Progress', icon: 'list' }
    ],
    'key_partner': [
      { href: '/key-partner', label: 'Dashboard', icon: 'home' }, 
      { href: '/key-partner/review', label: 'Review Kamus', icon: 'clipboard' }, 
      { href: '/key-partner/kamus', label: 'Katalog KPI', icon: 'book' },
      { href: '/key-partner/rekap', label: 'Rekap KPI', icon: 'list' }
    ],
    admin: [
      { href: '/admin', label: 'Dashboard', icon: 'home' }, 
      { href: '/admin/karyawan', label: 'Kelola Karyawan', icon: 'users' }, 
      { href: '/admin/monitoring', label: 'Katalog KPI', icon: 'book' },
      { href: '/admin/rekap', label: 'Progress KPI', icon: 'list' }
    ],
    manajemen: [
      { href: '/manajemen', label: 'Dashboard', icon: 'home' },
      { href: '/manajemen/approval', label: 'Approval KPI', icon: 'check-circle' },
      ...(isManajemenDept ? [{ href: '/manajemen/kamus', label: 'Kamus KPI', icon: 'book' }] : []),

      { href: '/manajemen/rekap', label: 'Rekap Data', icon: 'list' } 
    ],
  };

  return (
    <>
      <style>{`
        /* 1. BACKGROUND & LAYOUT UTAMA */
        .sidebar {
          background-color: #162440; /* Biru gelap elegan */
          /* PASTIKAN KAMU PUNYA GAMBAR DAUN BERNAMA bg-daun.png DI FOLDER public */
          background-image: url('/bg-daun.png');
          background-repeat: no-repeat;
          background-position: bottom left;
          background-size: cover;
          transition: width .2s ease-in-out; overflow-x: hidden; white-space: nowrap; 
          position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column;
          border-right: 1px solid #1e2f50;
        }
        
        .sidebar.collapsed { width: 80px; }
        .sidebar.collapsed .role-badge-wrapper, .sidebar.collapsed .nav-text, 
        .sidebar.collapsed .logout-text, .sidebar.collapsed .brand-container { display: none; }
        .sidebar.collapsed .sidebar-brand, .sidebar.collapsed .nav-item, 
        .sidebar.collapsed .btn-logout { justify-content: center; padding-left: 0; padding-right: 0; }
        .sidebar.collapsed .nav-item { padding: 14px 0; }

        /* 2. HEADER BRAND */
        .sidebar-brand { padding: 28px 24px 20px; position: relative; z-index: 10; display: flex; align-items: flex-start; }
        .brand-container { display: flex; flex-direction: column; gap: 4px; }
        .brand-text { color: #ffffff; font-size: 18px; font-weight: 800; line-height: 1.1; letter-spacing: 0.2px; }
        .brand-sub { color: #8ba3b8; font-size: 11px; font-weight: 500; }

        /* 3. ROLE BADGE (Pill Outlined) */
        .role-badge-wrapper { padding: 0 24px 20px; position: relative; z-index: 10; }
        .role-badge { padding: 6px 14px; border: 1px solid #2d436b; color: #8ba3b8; border-radius: 8px; font-size: 10px; font-weight: 700; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px; background: rgba(0,0,0,0.15); }

        /* 4. NAVIGASI MENU */
        .nav { display: flex; flex-direction: column; gap: 6px; padding: 0 16px; z-index: 10; flex: 1; }
        .nav-item { display: flex; align-items: center; padding: 12px 16px; border-radius: 10px; color: #8ba3b8; text-decoration: none; transition: all 0.2s; font-size: 14px; font-weight: 500; }
        .nav-item:hover { background: rgba(255,255,255,0.06); color: #ffffff; }
        
        .nav-item.active { background: #FF6C0C; color: #ffffff; font-weight: 600; box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25); }

        /* 5. FOOTER & TOMBOL LOGOUT */
        .sidebar-footer { padding: 20px 16px; margin-top: auto; position: relative; z-index: 10; }
        .sidebar.collapsed .sidebar-footer { padding: 20px 12px; }
        
        /* Tombol Logout: Default transparan, menyala saat di-hover */
        .btn-logout { display: flex; align-items: center; width: 100%; border: none; background: transparent; color: #8ba3b8; cursor: pointer; padding: 12px 16px; border-radius: 10px; transition: all 0.2s; font-size: 14px; font-weight: 500; }
        .btn-logout:hover { background: rgba(255, 108, 12, 0.1); color: #FF6C0C; font-weight: 600; }
        .sidebar.collapsed .btn-logout { padding: 12px 0; }

        /* 6. TOMBOL COLLAPSE / BUKA TUTUP MENU */
        .toggle-btn { position: absolute; right: 16px; top: 24px; width: 32px; height: 32px; background: transparent; color: #8ba3b8; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 50; transition: all .2s; border-radius: 8px; }
        .toggle-btn:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
        .toggle-btn-collapsed { background: transparent; border: none; color: #8ba3b8; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 8px; transition: all .2s; }
        .toggle-btn-collapsed:hover { color: #fff; transform: scale(1.1); }

        @media(max-width:768px){ 
          .toggle-btn{display:none} 
          .sidebar.collapsed{width:260px} 
          .sidebar.collapsed .role-badge-wrapper, .sidebar.collapsed .nav-text, 
          .sidebar.collapsed .logout-text, .sidebar.collapsed .brand-container {display:flex} 
        }
      `}</style>

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`.trim()}>
        {!isCollapsed && (
          <button className="toggle-btn" onClick={toggleCollapse} title="Tutup Sidebar">
            <Icon name="menu-fold" size={22} />
          </button>
        )}

        <div className="sidebar-brand">
          {isCollapsed ? (
            <button className="toggle-btn-collapsed" onClick={toggleCollapse} title="Buka Sidebar">
              <Icon name="menu-unfold" size={22} />
            </button>
          ) : (
            <div className="brand-container">
              <div className="brand-text">Kamus KPI</div>
              <div className="brand-sub">Management System</div>
            </div>
          )}
        </div>

        <div className="role-badge-wrapper">
          <div className="role-badge">{ROLE_LABEL[role] || role}</div>
        </div>

        {/* Menu Navigasi */}
        <nav className="nav">
          {(MENUS[role] || []).map(({ href, label, icon }) => (
            <Link 
              key={href} href={href} onClick={onClose}
              className={`nav-item ${pathname === href || (href !== `/${role}` && pathname.startsWith(href)) ? 'active' : ''}`} 
            >
              <Icon name={icon} size={18} />
              <span className="nav-text" style={{ marginLeft: isCollapsed ? 0 : 12 }}>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={onLogout} disabled={loggingOut}>
            <Icon name="logout" size={18} />
            <span className="logout-text" style={{ marginLeft: isCollapsed ? 0 : 12 }}>
              {loggingOut ? 'Logout...' : 'Logout'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}