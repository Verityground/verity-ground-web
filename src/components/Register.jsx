import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { registerUser, navigate } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !email.trim() || !password) {
      setErrorMsg('Semua kolom formulir pendaftaran wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal harus terdiri dari 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 450));

      const res = registerUser({ name, email, password });
      if (res.success) {
        setSuccessMsg('Pendaftaran akun berhasil! Mengalihkan ke halaman login...');
        setTimeout(() => {
          navigate('/login');
        }, 1200);
      } else {
        setErrorMsg(res.error || 'Pendaftaran gagal. Silakan gunakan email lain.');
      }
    } catch (err) {
      console.error('Register error:', err);
      setErrorMsg('Terjadi kendala teknis saat memproses akun baru.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white relative overflow-hidden">
      
      {/* Top Navbar Header */}
      <header className="py-5 px-4 sm:px-8 border-b border-zinc-900 flex items-center justify-between max-w-7xl mx-auto w-full">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center p-1 group-hover:border-zinc-700 transition-colors shrink-0">
            <img src="/logo.png" alt="Verity Ground" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-white">Verity Ground</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Software Studio</span>
          </div>
        </a>

        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </header>

      {/* Main Centered Register Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-white mx-auto shadow-inner">
                <User className="w-5 h-5 text-zinc-200" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Pendaftaran Akun Baru
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Buat akun untuk mengakses ekosistem Verity Ground.
                </p>
              </div>
            </div>

            {/* Strict RBAC Explanation Badge (Default = Viewer) */}
            <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-start gap-2.5 text-left">
              <Shield className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-zinc-400 leading-relaxed">
                <span className="font-semibold text-zinc-200">Default Role: Viewer.</span>{' '}
                Semua pendaftaran publik otomatis berstatus Viewer (Pengunjung). Hak akses internal Admin/Staff hanya dapat diberikan secara langsung oleh Super Administrator.
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="reg-name" className="block text-xs font-medium text-zinc-300">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    placeholder="Contoh: Alex Pratama"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrorMsg(''); }}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="reg-email" className="block text-xs font-medium text-zinc-300">
                  Email Pengguna
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="alex@verityground.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="reg-password" className="block text-xs font-medium text-zinc-300">
                  Password (Min. 6 Karakter)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                    className="w-full pl-10 pr-11 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors min-h-[44px]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="reg-confirm" className="block text-xs font-medium text-zinc-300">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="reg-confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrorMsg(''); }}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/60 border border-zinc-800 rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                  />
                </div>
              </div>

              {/* Alerts */}
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-white text-black font-semibold text-sm rounded-lg hover:bg-zinc-200 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mendaftarkan Akun...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar Akun Baru</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Navigation Link */}
            <div className="text-center pt-2 border-t border-zinc-800/60">
              <p className="text-xs text-zinc-400">
                Sudah memiliki akun?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-white font-medium hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  Masuk ke Akun
                </button>
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center text-xs text-zinc-500 border-t border-zinc-900">
        © {new Date().getFullYear()} Verity Ground. All rights reserved.
      </footer>

    </div>
  );
}
