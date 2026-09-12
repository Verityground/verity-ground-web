import React, { useEffect } from 'react';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = ['superadmin', 'staff'] }) {
  const { currentUser, isAuthenticated, navigate } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/staff-portal');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-zinc-400 text-sm">
          <div className="w-4 h-4 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
          <span>Mengarahkan ke halaman login...</span>
        </div>
      </div>
    );
  }

  // Check role authorization: Viewer is strictly barred from Admin Control Center
  if (!allowedRoles.includes(currentUser?.role)) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-5 text-zinc-400 shadow-xl">
          <ShieldAlert className="w-8 h-8 text-rose-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Akses Ditolak (403 Forbidden)
        </h1>
        <p className="text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
          Akun Anda memiliki hak akses <strong>Viewer (Pengunjung)</strong>. Halaman Admin Control Center dikhususkan hanya untuk <strong>Super Admin</strong> dan <strong>Staff</strong> studio.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda Utama</span>
          </button>
        </div>
      </div>
    );
  }

  return children;
}
