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

// Cria o contexto de autenticação
const AuthContext = createContext<AuthContextData | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Estados de usuário e carregamento
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Base da API: '' em dev (usa proxy /api), ou VITE_API_URL em prod
  const API = import.meta.env.VITE_API_URL ?? '';
  console.log('[AuthContext] API base is:', API);

  // Ao montar, carrega perfil se existir token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Sessão expirada');
        return res.json();
      })
      .then((data: User) => setUser(data))
      .catch(() => {
        // Em erro, limpa token e usuário
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [API]);

  // Função de login: POST /login + GET /me
  const login = async (email: string, password: string) => {
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

    // Após login, busca perfil
    const meRes = await fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData: User = await meRes.json();
    setUser(meData);
  };

  // Função de logout
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

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return ctx;
};
