// src/context/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  tenantId: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Em dev, API fica '', usando proxy '/api'
  // Em prod, VITE_API_URL será algo como 'https://...railway.app/api'
  const API = import.meta.env.VITE_API_URL ?? '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    // GET {API}/me para carregar perfil
    fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Sessão expirada');
        return res.json();
      })
      .then((data: User) => setUser(data))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [API]);

  const login = async (email: string, password: string) => {
    // POST {API}/login
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || 'Erro no login');
    }

    const { token } = await res.json();
    localStorage.setItem('token', token);

    // Depois busca perfil de novo
    const meRes = await fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData: User = await meRes.json();
    setUser(meData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
