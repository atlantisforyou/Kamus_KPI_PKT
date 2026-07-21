'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import logopkt from '../../data/logopkt.png';
import homeBg from '../../data/Home.png';

// Icons
const stroke = { fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

const Ico = {
  Err:    <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} stroke="#dc2626"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Succ:   <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} stroke="#059669"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Login:  <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Back:   <svg width="16" height="16" viewBox="0 0 24 24" {...stroke} stroke="currentColor"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Eye:    <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: <svg width="18" height="18" viewBox="0 0 24 24" {...stroke} stroke="currentColor"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
};

// Styles

const CSS = (bg) => `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Merriweather:wght@700&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Plus Jakarta Sans',sans-serif;background:#f0f4f8}
  input::-ms-reveal,input::-ms-clear{display:none}
  .page{min-height:100vh;display:flex;background:#f0f4f8}
  .left{width:45%;background:linear-gradient(135deg,rgba(26,43,74,.92),rgba(26,43,74,.85)),url('${bg}') center/cover no-repeat;display:flex;flex-direction:column;justify-content:space-between;padding:52px 56px;position:relative;overflow:hidden}
  .left::before,.left::after{content:'';position:absolute;border-radius:50%}
  .left::before{top:-120px;right:-120px;width:420px;height:420px;background:rgba(255,255,255,.04)}
  .left::after{bottom:-80px;left:-80px;width:320px;height:320px;background:rgba(255,255,255,.03)}
  .brand{display:flex;align-items:center;gap:14px;z-index:1}
  .brand-icon{width:312.5px;height:100px;display:flex;align-items:center;justify-content:center}
  .brand-icon img{width:100%;height:100%;object-fit:contain}
  .hero-text{z-index:1}
  .hero-text h1{font-family:Merriweather,serif;font-size:36px;color:#fff;line-height:1.3;margin-bottom:20px;letter-spacing:-.5px}
  .hero-text h1 span{color:#6aaff5}
  .hero-text p{font-size:15px;color:rgba(255,255,255,.55);line-height:1.7;max-width:320px}
  .right{flex:1;display:flex;align-items:center;justify-content:center;padding:40px}
  .card{background:#fff;border-radius:20px;padding:48px 44px;width:100%;max-width:420px;box-shadow:0 4px 40px rgba(0,0,0,.08)}
  .card-header{margin-bottom:36px}
  .card-header h2{font-size:26px;font-weight:700;color:#0f1c2e;letter-spacing:-.5px;margin-bottom:8px}
  .card-header p{font-size:14px;color:#7a8b9a;line-height:1.5}
  .field{margin-bottom:20px}
  .field label{display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:8px;letter-spacing:.2px}
  .field input{width:100%;padding:13px 16px;border:1.5px solid #e5eaf0;border-radius:10px;font-size:15px;font-family:'Plus Jakarta Sans',sans-serif;color:#0f1c2e;background:#fafbfc;transition:all .2s;outline:0}
  .field input::placeholder{color:#b0bcc8}
  .field input:focus{border-color:#3b7dd8;background:#fff;box-shadow:0 0 0 3px rgba(59,125,216,.12)}
  .link-forgot{display:block;text-align:right;font-size:13px;font-weight:600;color:#3b7dd8;text-decoration:none;margin-top:-10px;margin-bottom:20px;cursor:pointer;transition:color .2s}
  .link-forgot:hover{color:#243d6a;text-decoration:underline}
  .link-back{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#7a8b9a;cursor:pointer;margin-bottom:24px;transition:color .2s}
  .link-back:hover{color:#3b7dd8}
  .error-box,.success-box{border-radius:10px;padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px}
  .error-box{background:#fff5f5;border:1px solid #fecaca}
  .error-box span{font-size:13px;color:#dc2626;font-weight:500}
  .success-box{background:#ecfdf5;border:1px solid #a7f3d0}
  .success-box span{font-size:13px;color:#059669;font-weight:500}
  .btn-primary{width:100%;padding:14px;background:#f4623a;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:.2px;margin-top:8px}
  .btn-primary:hover:not(:disabled){background:#243d6a;box-shadow:0 4px 16px rgba(26,43,74,.25)}
  .btn-primary:active:not(:disabled){transform:scale(.99)}
  .btn-primary:disabled{opacity:.6;cursor:not-allowed}
  .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  @media(max-width:768px){.page{flex-direction:column}.left{width:100%;padding:36px 28px;min-height:auto}.hero-text h1{font-size:26px}.right{padding:28px 20px}.card{padding:32px 24px}}
`;
function Field({ label, value, onChange, type = 'text', placeholder, maxLength, style, autoFocus, isPassword, showPassword, onToggle }) {
  return (
    <div className="field">
      <label>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          value={value} onChange={onChange} placeholder={placeholder}
          maxLength={maxLength} autoFocus={autoFocus} autoComplete="off"
          style={{ ...style, paddingRight: isPassword ? '42px' : '16px' }}
        />
        {isPassword && (
          <button type="button" onClick={onToggle} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7a8b9a', display: 'flex', padding: '4px' }}>
            {showPassword ? Ico.EyeOff : Ico.Eye}
          </button>
        )}
      </div>
    </div>
  );
}

const Alert = ({ type, message }) => !message ? null : (
  <div className={type === 'error' ? 'error-box' : 'success-box'}>
    {type === 'error' ? Ico.Err : Ico.Succ}
    <span>{message}</span>
  </div>
);

const SubmitButton = ({ loading, label, loadingLabel }) => (
  <button type="submit" className="btn-primary" disabled={loading}>
    {loading ? <><div className="spinner" />{loadingLabel}</> : label}
  </button>
);

// Main Component
export default function LoginPage() {
  const router = useRouter();
  const [ui, setUi]   = useState({ view: 'login', loading: false, error: '', success: '' });
  const [form, setForm] = useState({ nama: '', npk: '', loginPass: '', email: '', otp: '', pass: '' });
  const [showPassword, setShowPassword] = useState(false);

  const isAdmin = form.nama.trim().toLowerCase() === 'admin';

  const setView  = (view)          => setUi({ view, loading: false, error: '', success: '' });
  const setError = (error)         => setUi(p => ({ ...p, error, loading: false }));
  const set      = (key, val)      => setForm(p => ({ ...p, [key]: val }));
  const field    = (key, extra={}) => ({ value: form[key], onChange: e => set(key, e.target.value), ...extra });

  const apiRequest = async (url, body, onSuccess) => {
    setUi(p => ({ ...p, error: '', success: '', loading: true }));
    try {
      const res  = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan');
      onSuccess(data);
    } catch (err) { setError(err.message); }
  };

  const handlers = {
    login: (e) => {
      e.preventDefault();
      if (isAdmin) {
        if (!form.nama.trim() || !form.loginPass.trim()) return setError('Nama dan Password wajib diisi untuk Admin');
        apiRequest('/api/auth/login', { nama: form.nama, password: form.loginPass, isAdmin: true }, d => router.push(d.redirect));
      } else {
        if (!form.nama.trim() || !form.npk.trim()) return setError('Nama dan NPK wajib diisi');
        apiRequest('/api/auth/login', { nama: form.nama, npk: form.npk, isAdmin: false }, d => router.push(d.redirect));
      }
    },

    forgot: (e) => {
      e.preventDefault();
      if (!form.email.trim()) return setError('Email wajib diisi');
      apiRequest('/api/auth/recovery', { action: 'request_otp', email: form.email },
        () => setUi(p => ({ ...p, view: 'verify', success: 'Kode OTP telah dikirim ke email Anda.', loading: false })));
    },

    verify: (e) => {
      e.preventDefault();
      if (!form.otp.trim()) return setError('Kode OTP wajib diisi');
      apiRequest('/api/auth/recovery', { action: 'verify_otp', email: form.email, otp: form.otp },
        () => setUi(p => ({ ...p, view: 'reset', success: 'OTP valid! Silakan masukkan password baru.', error: '', loading: false })));
    },

    reset: (e) => {
      e.preventDefault();
      if (!form.pass.trim()) return setError('Password Baru wajib diisi');
      apiRequest('/api/auth/recovery', { action: 'reset_password', email: form.email, otp: form.otp, newPassword: form.pass }, () => {
        setUi(p => ({ ...p, success: 'Password berhasil diubah! Silakan login.', loading: false }));
        setForm(p => ({ ...p, otp: '', pass: '', email: '', loginPass: '' }));
        setTimeout(() => setView('login'), 2000);
      });
    },
  };

  const togglePw = () => setShowPassword(p => !p);
  const pw = { isPassword: true, showPassword, onToggle: togglePw };

  return (
    <>
      <style>{CSS(homeBg.src)}</style>
      <div className="page">

        {/* Left Panel */}
        <div className="left">
          <div className="brand">
            <div className="brand-icon"><img src={logopkt.src} alt="Logo PKT" /></div>
          </div>
          <div className="hero-text">
            <h1>Sistem Informasi <span>Kamus Indikator Kinerja</span> Perusahaan</h1>
            <p>Platform terpadu untuk mendefinisikan, mereview, dan menyetujui Key Performance Indicator secara terstruktur.</p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right">
          <div className="card">

            {/* Login */}
            {ui.view === 'login' && <>
              <div className="card-header">
                <h2>Selamat Datang</h2>
                <p>{isAdmin ? 'Masuk sebagai Administrator' : 'Masuk menggunakan Nama dan NPK kamu'}</p>
              </div>
              <form onSubmit={handlers.login}>
                <Field label="Nama Lengkap" placeholder="Masukkan nama lengkap sesuai data" autoFocus {...field('nama')} />
                {isAdmin
                  ? <Field label="Password" placeholder="Masukkan password admin" {...field('loginPass')} {...pw} />
                  : <Field label="NPK" placeholder="Masukkan NPK kamu" style={{ letterSpacing: 1, fontWeight: 500 }}
                      {...field('npk', { onChange: e => set('npk', e.target.value.toUpperCase()) })} {...pw} />
                }
                <div className="link-forgot" onClick={() => setView('forgot')}>Lupa Password?</div>
                <Alert type="error" message={ui.error} />
                <SubmitButton loading={ui.loading} label={<>Masuk {Ico.Login}</>} loadingLabel="Memverifikasi..." />
              </form>
            </>}

            {/* Forgot */}
            {ui.view === 'forgot' && <>
              <div className="link-back" onClick={() => setView('login')}>{Ico.Back} Kembali ke Login</div>
              <div className="card-header">
                <h2>Lupa Password?</h2>
                <p>Masukkan email yang terdaftar untuk menerima kode OTP reset password.</p>
              </div>
              <form onSubmit={handlers.forgot}>
                <Field label="Email Perusahaan" type="email" placeholder="contoh@pupukkaltim.com" autoFocus {...field('email')} />
                <Alert type="error" message={ui.error} />
                <SubmitButton loading={ui.loading} label="Kirim Kode OTP" loadingLabel="Mengirim..." />
              </form>
            </>}

            {/* Verify OTP */}
            {ui.view === 'verify' && <>
              <div className="link-back" onClick={() => setView('forgot')}>{Ico.Back} Kembali ganti Email</div>
              <div className="card-header">
                <h2>Verifikasi OTP</h2>
                <p>Masukkan 6 digit kode OTP yang telah dikirim ke <strong>{form.email}</strong>.</p>
              </div>
              <form onSubmit={handlers.verify}>
                <Field label="Kode OTP" placeholder="Masukkan 6 digit angka" maxLength="6"
                  style={{ letterSpacing: 3, fontWeight: 600, textAlign: 'center' }} autoFocus {...field('otp')} />
                <Alert type="error" message={ui.error} />
                <Alert type="success" message={ui.success} />
                <SubmitButton loading={ui.loading} label="Verifikasi OTP" loadingLabel="Memverifikasi..." />
              </form>
            </>}

            {/* Reset Password */}
            {ui.view === 'reset' && <>
              <div className="card-header">
                <h2>Buat Password Baru</h2>
                <p>OTP berhasil diverifikasi. Silakan masukkan password baru Anda.</p>
              </div>
              <form onSubmit={handlers.reset}>
                <Field label="Password Baru" placeholder="Minimal 8 karakter" autoFocus {...field('pass')} {...pw} />
                <Alert type="error" message={ui.error} />
                <Alert type="success" message={ui.success} />
                <SubmitButton loading={ui.loading} label="Simpan Password Baru" loadingLabel="Memproses..." />
              </form>
            </>}

          </div>
        </div>

      </div>
    </>
  );
}