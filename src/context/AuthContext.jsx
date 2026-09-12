import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'verity_ground_users_v1';
const SESSION_USER_KEY = 'verity_current_user';

const DEFAULT_USERS = [
  {
    id: 'usr-superadmin-1',
    name: 'Super Admin',
    email: 'admin@verityground.com',
    password: 'coklatkopi21',
    role: 'superadmin',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-staff-1',
    name: 'Staff Editor',
    email: 'staff@verityground.com',
    password: 'bisayukbisa18',
    role: 'staff',
    createdAt: '2026-01-02T00:00:00.000Z'
  },
  {
    id: 'usr-viewer-1',
    name: 'Guest Viewer',
    email: 'viewer@verityground.com',
    password: 'viewer123',
    role: 'viewer',
    createdAt: '2026-01-03T00:00:00.000Z'
  }
];

export function AuthProvider({ children }) {
  // 1. Client-Side Routing State
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.pathname || '/';
  });

  // Listen for browser Back/Forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentRoute(path);
      window.scrollTo(0, 0);
    }
  }, []);

  // 2. User Accounts & Session State
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((u) => {
            if (u.role === 'superadmin') return { ...u, password: 'coklatkopi21' };
            if (u.role === 'staff') return { ...u, password: 'bisayukbisa18' };
            return u;
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse users from localStorage', e);
    }
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = sessionStorage.getItem(SESSION_USER_KEY);
      if (savedUser) return JSON.parse(savedUser);
      // Backwards compatibility with legacy boolean flag
      const isLegacyAuth = sessionStorage.getItem('verity_admin_auth') === 'true';
      if (isLegacyAuth) {
        return DEFAULT_USERS[0];
      }
    } catch (e) {
      console.error('Failed to parse current user from sessionStorage', e);
    }
    return null;
  });

  const isAuthenticated = Boolean(currentUser);

  // 3. Auth Actions
  const loginUser = useCallback(
    ({ email, password }) => {
      const trimmedPassword = (password || '').trim();
      const normalizedEmail = (email || '').trim().toLowerCase();

      // 1. Visitor / Viewer Authentication (Requires Email and Password)
      if (normalizedEmail) {
        const foundUser = users.find(
          (u) => u.email.toLowerCase() === normalizedEmail && u.password === trimmedPassword
        );
        if (foundUser) {
          setCurrentUser(foundUser);
          sessionStorage.setItem('verity_admin_auth', 'true');
          sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(foundUser));
          return { success: true, user: foundUser };
        }
        return { success: false, error: 'Email atau password yang Anda masukkan tidak sesuai.' };
      }

      // 2. Staff & Super Admin Control Portal Authentication (Password-Only)
      if (trimmedPassword === 'yukngodinglah123' || trimmedPassword === 'coklatkopi21') {
        const superAdmin = users.find((u) => u.role === 'superadmin') || DEFAULT_USERS[0];
        const userObj = { ...superAdmin, password: 'coklatkopi21' };
        setCurrentUser(userObj);
        sessionStorage.setItem('verity_admin_auth', 'true');
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(userObj));
        return { success: true, user: userObj };
      }

      if (trimmedPassword === 'bisayukbisa18') {
        const staff = users.find((u) => u.role === 'staff') || DEFAULT_USERS[1];
        const userObj = { ...staff, password: 'bisayukbisa18' };
        setCurrentUser(userObj);
        sessionStorage.setItem('verity_admin_auth', 'true');
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(userObj));
        return { success: true, user: userObj };
      }

      return { success: false, error: 'Password akses tidak valid atau tidak memiliki izin.' };
    },
    [users]
  );

  const registerUser = useCallback(
    ({ name, email, password }) => {
      const normalizedEmail = (email || '').trim().toLowerCase();
      if (!name || !normalizedEmail || !password) {
        return { success: false, error: 'Semua kolom formulir pendaftaran wajib diisi.' };
      }

      const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
      if (exists) {
        return { success: false, error: 'Alamat email ini sudah terdaftar. Silakan login.' };
      }

      // STRICT DEFAULT ROLE: Viewer (Pengunjung Publik)
      const newUser = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: 'viewer',
        createdAt: new Date().toISOString()
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      } catch (e) {
        console.error('Failed to save users to localStorage', e);
      }

      return { success: true, user: newUser };
    },
    [users]
  );

  const updateUserRole = useCallback(
    (userId, newRole) => {
      if (currentUser?.role !== 'superadmin') {
        return { success: false, error: 'Hanya Super Admin yang berhak menaikkan atau mengubah role akun.' };
      }

      const updatedUsers = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
      setUsers(updatedUsers);
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      } catch (e) {
        console.error('Failed to update users in localStorage', e);
      }

      if (currentUser?.id === userId) {
        const updatedSelf = { ...currentUser, role: newRole };
        setCurrentUser(updatedSelf);
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(updatedSelf));
      }

      return { success: true };
    },
    [currentUser, users]
  );

  const deleteUser = useCallback(
    (userId) => {
      if (currentUser?.role !== 'superadmin') {
        return { success: false, error: 'Hanya Super Admin yang berhak menghapus akun pengguna.' };
      }
      if (currentUser?.id === userId) {
        return { success: false, error: 'Anda tidak dapat menghapus akun Anda sendiri saat sedang aktif.' };
      }

      const updatedUsers = users.filter((u) => u.id !== userId);
      setUsers(updatedUsers);
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      } catch (e) {
        console.error('Failed to save users after delete', e);
      }
      return { success: true };
    },
    [currentUser, users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem('verity_admin_auth');
    sessionStorage.removeItem(SESSION_USER_KEY);
    navigate('/');
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        currentRoute,
        navigate,
        users,
        currentUser,
        isAuthenticated,
        loginUser,
        registerUser,
        updateUserRole,
        deleteUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
