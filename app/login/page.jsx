'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import logoPkt from '../../data/logopkt.png';
import homeBg from '../../data/Home.png';

const Ico = {
  Err:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Succ:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Login: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Back:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Hint:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b7dd8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
};

// ─── CSS (MINIFIED) ───
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Merriweather:wght@700&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Plus Jakarta Sans',sans-serif;background:#f0f4f8}.page{min-height:100vh;display:flex;background:#f0f4f8}.left{width:45%;background:linear-gradient(135deg,rgba(26,43,74,.92),rgba(26,43,74,.85)),url('${homeBg.src}');background-size:cover;background-position:center;display:flex;flex-direction:column;justify-content:space-between;padding:52px 56px;position:relative;overflow:hidden}.left::before{content:'';position:absolute;top:-120px;right:-120px;width:420px;height:420px;border-radius:50%;background:rgba(255,255,255,.04)}.left::after{content:'';position:absolute;bottom:-80px;left:-80px;width:320px;height:320px;border-radius:50%;background:rgba(255,255,255,.03)}.brand{display:flex;align-items:center;gap:14px;z-index:1}.brand-icon{width:312.5px;height:100px;display:flex;align-items:center;justify-content:center}.brand-icon img{width:100%;height:100%;object-fit:contain}.hero-text{z-index:1}.hero-text h1{font-family:Merriweather,serif;font-size:36px;color:#fff;line-height:1.3;margin-bottom:20px;letter-spacing:-.5px}.hero-text h1 span{color:#6aaff5}.hero-text p{font-size:15px;color:rgba(255,255,255,.55);line-height:1.7;max-width:320px}.right{flex:1;display:flex;align-items:center;justify-content:center;padding:40px}.card{background:#fff;border-radius:20px;padding:48px 44px;width:100%;max-width:420px;box-shadow:0 4px 40px rgba(0,0,0,.08);position:relative}.card-header{margin-bottom:36px}.card-header h2{font-size:26px;font-weight:700;color:#0f1c2e;letter-spacing:-.5px;margin-bottom:8px}.card-header p{font-size:14px;color:#7a8b9a;line-height:1.5}.field{margin-bottom:20px}.field label{display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:8px;letter-spacing:.2px}.field input{width:100%;padding:13px 16px;border:1.5px solid #e5eaf0;border-radius:10px;font-size:15px;font-family:'Plus Jakarta Sans',sans-serif;color:#0f1c2e;background:#fafbfc;transition:all .2s;outline:0}.field input::placeholder{color:#b0bcc8}.field input:focus{border-color:#3b7dd8;background:#fff;box-shadow:0 0 0 3px rgba(59,125,216,.12)}.link-forgot{display:block;text-align:right;font-size:13px;font-weight:600;color:#3b7dd8;text-decoration:none;margin-top:-10px;margin-bottom:20px;cursor:pointer;transition:color .2s}.link-forgot:hover{color:#243d6a;text-decoration:underline}.link-back{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#7a8b9a;cursor:pointer;margin-bottom:24px;transition:color .2s}.link-back:hover{color:#3b7dd8}.error-box,.success-box{border-radius:10px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px}.error-box{background:#fff5f5;border:1px solid #fecaca}.error-box span{font-size:13px;color:#dc2626;font-weight:500}.success-box{background:#ecfdf5;border:1px solid #a7f3d0}.success-box span{font-size:13px;color:#059669;font-weight:500}.btn-primary{width:100%;padding:14px;background:#f4623a;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:.2px;margin-top:8px}.btn-primary:hover:not(:disabled){background:#243d6a;box-shadow:0 4px 16px rgba(26,43,74,.25)}.btn-primary:active:not(:disabled){transform:scale(.99)}.btn-primary:disabled{opacity:.6;cursor:not-allowed}.spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.hint{margin-top:24px;padding-top:20px;border-top:1px solid #f0f4f8;display:flex;align-items:flex-start;gap:10px}.hint-icon{width:28px;height:28px;background:#eff6ff;border-radius:7px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}.hint p{font-size:12.5px;color:#7a8b9a;line-height:1.6}.hint p strong{color:#374151;font-weight:600}@media (max-width:768px){.page{flex-direction:column}.left{width:100%;padding:36px 28px;min-height:auto}.hero-text h1{font-size:26px}.right{padding:28px 20px}.card{padding:32px 24px}}`;

// ─── KOMPONEN HELPER ───
const Fld = ({ l, val, onChange, t = "text", p, max, st, autoF }) => (
  <div className="field">
    <label>{l}</label>
    <input type={t} placeholder={p} value={val} onChange={onChange} maxLength={max} style={st} autoFocus={autoF} autoComplete="off" />
  </div>
);

// ─── FUNGSI UTAMA HALAMAN ───
export default function LoginPage() {
  const router = useRouter();
  const [ui, setUi] = useState({ v: 'login', ld: false, err: '', suc: '' });
  const [f, setF]   = useState({ nama: '', npk: '', loginPass: '', email: '', otp: '', pass: '' });

  const setView = (v) => setUi({ v, ld: false, err: '', suc: '' });
  const upd = (k, v) => setF(p => ({ ...p, [k]: v }));

  const isAdmin = f.nama.trim().toLowerCase() === 'admin';

  const req = async (url, body, onSucc) => {
    setUi(p => ({ ...p, err: '', suc: '', ld: true }));
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Terjadi kesalahan');
      onSucc(d);
    } catch (e) { setUi(p => ({ ...p, err: e.message, ld: false })); }
  };

  const actions = {
    login: (e) => {
      e.preventDefault();
      
      if (isAdmin) {
        if (!f.nama?.trim() || !f.loginPass?.trim()) {
          return setUi(p => ({ ...p, err: 'Nama dan Password wajib diisi untuk Admin' }));
        }
        req('/api/auth/login', { nama: f.nama, password: f.loginPass, isAdmin: true }, (d) => router.push(d.redirect));
      } else {
        if (!f.nama?.trim() || !f.npk?.trim()) {
          return setUi(p => ({ ...p, err: 'Nama dan NPK wajib diisi' }));
        }
        req('/api/auth/login', { nama: f.nama, npk: f.npk, isAdmin: false }, (d) => router.push(d.redirect));
      }
    },

    forgot: (e) => {
      e.preventDefault();
      if (!f.email?.trim()) return setUi(p => ({ ...p, err: 'Email wajib diisi' }));
      req('/api/auth/recovery', { action: 'request_otp', email: f.email }, () => setUi(p => ({ ...p, v: 'verify', suc: 'Kode OTP telah dikirim ke email Anda.', ld: false })));
    },
    verify: (e) => {
      e.preventDefault();
      if (!f.otp?.trim()) return setUi(p => ({ ...p, err: 'Kode OTP wajib diisi' }));
      req('/api/auth/recovery', { action: 'verify_otp', email: f.email, otp: f.otp }, () => setUi(p => ({ ...p, v: 'reset', suc: 'OTP valid! Silakan masukkan password baru.', err: '', ld: false })));
    },
    reset: (e) => {
      e.preventDefault();
      if (!f.pass?.trim()) return setUi(p => ({ ...p, err: 'Password Baru wajib diisi' }));
      req('/api/auth/recovery', { action: 'reset_password', email: f.email, otp: f.otp, newPassword: f.pass }, () => {
        setUi(p => ({ ...p, suc: 'Password berhasil diubah! Silakan login.', ld: false }));
        setF(p => ({ ...p, otp: '', pass: '', email: '', loginPass: '' }));
        setTimeout(() => setView('login'), 2000);
      });
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="page">
        <div className="left">
          <div className="brand"><div className="brand-icon"><img src={logoPkt.src} alt="Logo PKT" /></div></div>
          <div className="hero-text">
            <h1>Sistem Pengelolaan <span>Indikator Kinerja</span> Perusahaan</h1>
            <p>Platform terpadu untuk mendefinisikan, mereview, dan menyetujui Key Performance Indicator secara terstruktur.</p>
          </div>
        </div>

        <div className="right">
          <div className="card">
            
            {ui.v === 'login' && (
              <>
                <div className="card-header">
                  <h2>Selamat Datang</h2>
                  <p>{isAdmin ? 'Masuk sebagai Administrator' : 'Masuk menggunakan Nama dan NPK kamu'}</p>
                </div>
                <form onSubmit={actions.login}>
                  <Fld l="Nama Lengkap" val={f.nama} onChange={(e) => upd('nama', e.target.value)} p="Masukkan nama lengkap sesuai data" autoF />
                  
                  {!isAdmin && (
                    <Fld l="NPK" val={f.npk} onChange={(e) => upd('npk', e.target.value.toUpperCase())} p="Masukkan NPK kamu" st={{ letterSpacing: 1, fontWeight: 500 }} />
                  )}
                  
                  {isAdmin && (
                    <Fld l="Password" val={f.loginPass} onChange={(e) => upd('loginPass', e.target.value)} t="password" p="Masukkan password admin" />
                  )}
                  
                  <div className="link-forgot" onClick={() => setView('forgot')}>Lupa Password?</div>
                  {ui.err && <div className="error-box">{Ico.Err}<span>{ui.err}</span></div>}
                  
                  <button type="submit" className="btn-primary" disabled={ui.ld}>
                    {ui.ld ? <><div className="spinner" /> Memverifikasi...</> : <>Masuk {Ico.Login}</>}
                  </button>
                </form>
                <div className="hint"><div className="hint-icon">{Ico.Hint}</div><p><strong>Info:</strong> NPK otomatis dikonversi ke huruf kapital. Ketik 'Admin' pada kolom nama untuk login Administrator.</p></div>
              </>
            )}

            {ui.v === 'forgot' && (
              <>
                <div className="link-back" onClick={() => setView('login')}>{Ico.Back} Kembali ke Login</div>
                <div className="card-header"><h2>Lupa Password?</h2><p>Masukkan email yang terdaftar untuk menerima kode OTP reset password.</p></div>
                <form onSubmit={actions.forgot}>
                  <Fld l="Email Perusahaan" val={f.email} onChange={(e) => upd('email', e.target.value)} t="email" p="contoh@pupukkaltim.com" autoF />
                  {ui.err && <div className="error-box">{Ico.Err}<span>{ui.err}</span></div>}
                  <button type="submit" className="btn-primary" disabled={ui.ld}>{ui.ld ? <><div className="spinner" /> Mengirim...</> : 'Kirim Kode OTP'}</button>
                </form>
              </>
            )}

            {ui.v === 'verify' && (
              <>
                <div className="link-back" onClick={() => setView('forgot')}>{Ico.Back} Kembali ganti Email</div>
                <div className="card-header"><h2>Verifikasi OTP</h2><p>Masukkan 6 digit kode OTP yang telah dikirim ke <strong>{f.email}</strong>.</p></div>
                <form onSubmit={actions.verify}>
                  <Fld l="Kode OTP" val={f.otp} onChange={(e) => upd('otp', e.target.value)} p="Masukkan 6 digit angka" max="6" st={{ letterSpacing: 3, fontWeight: 600, textAlign: 'center' }} autoF />
                  {ui.err && <div className="error-box">{Ico.Err}<span>{ui.err}</span></div>}
                  {ui.suc && <div className="success-box">{Ico.Succ}<span>{ui.suc}</span></div>}
                  <button type="submit" className="btn-primary" disabled={ui.ld}>{ui.ld ? <><div className="spinner" /> Memverifikasi...</> : 'Verifikasi OTP'}</button>
                </form>
              </>
            )}

            {ui.v === 'reset' && (
              <>
                <div className="card-header"><h2>Buat Password Baru</h2><p>OTP berhasil diverifikasi. Silakan masukkan password baru Anda.</p></div>
                <form onSubmit={actions.reset}>
                  <Fld l="Password Baru" val={f.pass} onChange={(e) => upd('pass', e.target.value)} t="password" p="Minimal 8 karakter" autoF />
                  {ui.err && <div className="error-box">{Ico.Err}<span>{ui.err}</span></div>}
                  {ui.suc && <div className="success-box">{Ico.Succ}<span>{ui.suc}</span></div>}
                  <button type="submit" className="btn-primary" disabled={ui.ld}>{ui.ld ? <><div className="spinner" /> Memproses...</> : 'Simpan Password Baru'}</button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}