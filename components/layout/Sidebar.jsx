'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MENUS = {
  user: [{ href: '/user', label: 'Dashboard', icon: 'home' }, { href: '/user/kamus', label: 'Kamus KPI', icon: 'book' }],
  'key-partner': [{ href: '/key-partner', label: 'Dashboard', icon: 'home' }, { href: '/key-partner/review', label: 'Review Kamus', icon: 'clipboard' }, { href: '/key-partner/kamus', label: 'Kamus KPI', icon: 'book' }],
  admin: [{ href: '/admin', label: 'Dashboard', icon: 'home' }, { href: '/admin/karyawan', label: 'Kelola Karyawan', icon: 'users' }, { href: '/admin/monitoring', label: 'Monitoring', icon: 'bar-chart' }],
  manajemen: [{ href: '/manajemen', label: 'Dashboard', icon: 'home' }, { href: '/manajemen/approval', label: 'Approval Kamus', icon: 'check-circle' }],
};

export const ROLE_LABEL = { user: 'User', 'key-partner': 'Key Partner', admin: 'Administrator', manajemen: 'Manajemen' };

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
    'menu-unfold': <><line x1="4" y1="5" x2="20" y2="5"/><line x1="4" y1="19" x2="20" y2="19"/><polyline points="14 16 20 12 14 8"/><line x1="4" y1="10" x2="10" y2="10"/><line x1="4" y1="14" x2="10" y2="14"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

export default function Sidebar({ isOpen, onClose, isCollapsed, toggleCollapse }) {
  const pathname = usePathname() || '';
  const role = pathname.split('/')[1] || '';
  
  return (
    <>
      <style>{`
        .sidebar{transition:width .15s ease-in-out;overflow-x:hidden;white-space:nowrap;position:sticky;top:0;height:100vh}
        .sidebar.collapsed{width:80px}
        .sidebar.collapsed .role-badge,.sidebar.collapsed .nav-text{display:none}
        .sidebar.collapsed .sidebar-brand,.sidebar.collapsed .nav-item{justify-content:center}
        .sidebar.collapsed .nav-item{padding:14px 0}
        .toggle-btn{position:absolute;right:-14px;top:40px;width:28px;height:28px;background:#fff;color:#1a2b4a;border:1px solid #e5eaf0;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,.1);z-index:50;transition:transform .2s,background .2s}
        .toggle-btn:hover{transform:scale(1.1);background:#f4f6f9}
        .toggle-btn-collapsed{background:transparent;border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:8px;transition:transform .2s}
        .toggle-btn-collapsed:hover{transform:scale(1.1)}
        @media(max-width:768px){.toggle-btn{display:none}.sidebar.collapsed{width:260px}.sidebar.collapsed .nav-text{display:block}}
      `}</style>

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`.trim()}>
        {!isCollapsed && (
          <button className="toggle-btn" onClick={toggleCollapse} title="Tutup Sidebar"><Icon name="menu-fold" /></button>
        )}

        <div className="sidebar-brand">
          {isCollapsed ? (
            <button className="toggle-btn-collapsed" onClick={toggleCollapse} title="Buka Sidebar"><Icon name="menu-unfold" size={20} /></button>
          ) : (
            <>
              <div className="brand-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>
              <div><div className="brand-text">Kamus KPI</div><div className="brand-sub">Management System</div></div>
            </>
          )}
        </div>

        <div className="role-badge">{ROLE_LABEL[role] || role}</div>

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
      </aside>
    </>
  );
}