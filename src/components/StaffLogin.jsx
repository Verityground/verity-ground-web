import React, { useState } from 'react';
import { Shield, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function StaffLogin() {
  const { loginUser, navigate } = useAuth();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDevPresets, setShowDevPresets] = useState(false);

  // Preset khusus untuk akun Staff saja (Bukan Admin)
  const staffPreset = { label: 'Staff Editor', password: 'bisayukbisa18' };

  const handleSelectStaffPreset = () => {
    setPassword(staffPreset.password);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 350));

      const result = loginUser({ password });
      if (result.success) {
        if (result.user.role === 'superadmin' || result.user.role === 'staff') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setErrorMsg(result.error || 'Password akses tidak valid atau tidak memiliki izin.');
      }
    } catch (err) {
      console.error('Staff login error:', err);
      setErrorMsg('Terjadi kesalahan internal saat mencoba masuk.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white relative overflow-hidden">
      
      {/* Top Header */}
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
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Internal Control</span>
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

      {/* Main Centered Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-white mx-auto shadow-inner">
                <Shield className="w-5 h-5 text-zinc-200" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Staff & Control Portal
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Masukkan password otorisasi untuk mengakses sistem studio.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Password Akses */}
              <div className="space-y-1.5 text-left">
                <div className="flex items-center justify-between">
                  <label htmlFor="staff-password" className="block text-xs font-medium text-zinc-300">
                    Password Akses
                  </label>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Super Admin / Staff
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="staff-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    placeholder="Masukkan password..."
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

              {/* Error Notice */}
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
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
                    <span>Memverifikasi Otorisasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Mode Pengujian Khusus Staff (Hanya Staff, bukan Admin) */}
            <div className="pt-2 border-t border-zinc-800/40">
              <button
                type="button"
                onClick={() => setShowDevPresets(!showDevPresets)}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1 w-full cursor-pointer"
              >
                <span>{showDevPresets ? 'Sembunyikan Mode Pengujian' : 'Mode Pengujian (Khusus Staff)'}</span>
              </button>

              {showDevPresets && (
                <div className="mt-2.5 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-1.5 animate-fade-in text-left">
                  <span className="text-[10px] text-zinc-400 font-mono block">Klik untuk mengisi otomatis Staff:</span>
                  <button
                    type="button"
                    onClick={handleSelectStaffPreset}
                    className="w-full py-1.5 px-2 text-xs rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-600 text-center cursor-pointer transition-colors"
                  >
                    Staff Editor (Auto-fill)
                  </button>
                </div>
              )}
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
