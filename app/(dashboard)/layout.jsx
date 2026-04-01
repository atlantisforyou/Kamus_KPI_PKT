'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Header  from '@/components/layout/Header';
import '@/app/globals.css';

const CSS = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Plus Jakarta Sans',sans-serif;background:#f4f6f9}.layout{display:flex;min-height:100vh}.sidebar{width:260px;height:100vh;position:sticky;top:0;background:#1a2b4a;display:flex;flex-direction:column;flex-shrink:0;z-index:100;transition:transform .3s ease,width .15s ease-in-out}.sidebar-brand{padding:24px 20px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:12px}.brand-icon{width:36px;height:36px;background:#3b7dd8;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}.brand-text{font-size:15px;font-weight:700;color:#fff;letter-spacing:-.3px}.brand-sub{font-size:11px;color:rgba(255,255,255,.4);margin-top:1px}.role-badge{margin:16px 20px;padding:8px 12px;background:rgba(59,125,216,.15);border:1px solid rgba(59,125,216,.25);border-radius:8px;font-size:12px;color:#6aaff5;font-weight:600;text-transform:uppercase;letter-spacing:.5px}.nav{flex:1;padding:8px 12px;overflow-y:auto}.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;color:rgba(255,255,255,.55);text-decoration:none;font-size:14px;font-weight:500;transition:all .15s;margin-bottom:2px}.nav-item:hover{background:rgba(255,255,255,.07);color:rgba(255,255,255,.85)}.nav-item.active{background:rgba(59,125,216,.2);color:#6aaff5}.sidebar-footer{padding:12px;border-top:1px solid rgba(255,255,255,.08)}.btn-logout{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border-radius:8px;background:0 0;border:none;color:rgba(255,255,255,.45);font-size:14px;font-weight:500;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .15s}.btn-logout:hover{background:rgba(220,38,38,.15);color:#f87171}.main{flex:1;display:flex;flex-direction:column;min-height:100vh;min-width:0}.topbar{background:#fff;border-bottom:1px solid #e8edf2;padding:0 28px;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50}.topbar-title{font-size:15px;font-weight:600;color:#1a2b4a}.topbar-right{display:flex;align-items:center;gap:12px;position:relative}.profile-btn{display:flex;align-items:center;gap:8px;padding:5px 10px 5px 5px;background:#f4f6f9;border-radius:20px;cursor:pointer;border:none;font-family:'Plus Jakarta Sans',sans-serif;transition:background .15s}.profile-btn:hover{background:#e8edf2}.profile-avatar{width:30px;height:30px;background:#3b7dd8;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}.profile-name{font-size:13px;font-weight:600;color:#1a2b4a;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.profile-chevron{transition:transform .2s;color:#7a8b9a}.profile-chevron.open{transform:rotate(180deg)}.profile-dropdown{position:absolute;top:calc(100% + 10px);right:0;background:#fff;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,.12);min-width:220px;overflow:hidden;z-index:200;animation:fadeDown .15s ease}@keyframes fadeDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}.dropdown-header{padding:16px 18px;border-bottom:1px solid #f0f4f8}.dropdown-nama{font-size:14px;font-weight:700;color:#1a2b4a;margin-bottom:3px}.dropdown-unit{font-size:12px;color:#7a8b9a}.dropdown-role{display:inline-block;margin-top:8px;padding:2px 8px;background:#eff6ff;color:#3b7dd8;border-radius:10px;font-size:11px;font-weight:600}.dropdown-divider{height:1px;background:#f0f4f8}.dropdown-item{display:flex;align-items:center;gap:10px;padding:12px 18px;font-size:14px;font-weight:500;color:#374151;cursor:pointer;border:none;background:0 0;width:100%;text-align:left;font-family:'Plus Jakarta Sans',sans-serif;transition:background .15s}.dropdown-item:hover{background:#f8fafc}.dropdown-item.danger{color:#dc2626}.dropdown-item.danger:hover{background:#fff5f5}.content{padding:28px;flex:1}.mobile-toggle{display:none;background:0 0;border:none;cursor:pointer;padding:4px}.overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:99}@media (max-width:768px){.sidebar{position:fixed;transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}.overlay.open{display:block}.mobile-toggle{display:block}.content{padding:20px 16px}}`;

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [ui, setUi] = useState({ open: false, col: false, out: false });

  const logout = async () => {
    setUi(p => ({ ...p, out: true }));
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="layout">
        <div className={`overlay ${ui.open ? 'open' : ''}`} onClick={() => setUi(p => ({ ...p, open: false }))} />

        <Sidebar 
          isOpen={ui.open} 
          onClose={() => setUi(p => ({ ...p, open: false }))} 
          onLogout={logout} 
          loggingOut={ui.out} 
          isCollapsed={ui.col} 
          toggleCollapse={() => setUi(p => ({ ...p, col: !p.col }))} 
        />

        <main className={`main ${ui.col ? 'collapsed' : ''}`}>
          <Header 
            sidebarOpen={ui.open} 
            onMenuToggle={() => setUi(p => ({ ...p, open: !p.open }))} 
            onLogout={logout} 
            loggingOut={ui.out} 
          />
          <div className="content">{children}</div>
        </main>
      </div>
    </>
  );
}