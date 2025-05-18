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
  // Estado do usuário e do carregamento
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Base da API: em dev usa proxy '/api', em prod usa a URL configurada
  const API = import.meta.env.VITE_API_URL ?? '';

  // Ao montar o provider, tenta carregar o perfil se existir token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Sem token: não carrega nada
      setLoading(false);
      return;
    }

    // Faz GET /me na API autenticada
    fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) {
          // Se 401/403, token inválido ou expirado
          throw new Error('Sessão expirada');
        }
        return res.json();
      })
      .then((data: User) => {
        // Ajusta usuário no contexto
        setUser(data);
      })
      .catch(() => {
        // Em erro, remove token e zera usuário
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => {
        // Sempre desliga o loading
        setLoading(false);
      });
  }, [API]);

  // Função de login: chama POST /login e depois GET /me
  const login = async (email: string, password: string) => {
    // POST /login com email e senha
    const res = await fetch(`${API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      // Em caso de erro 4xx/5xx, tenta ler mensagem
      const err = await res.json().catch(() => null);
      throw new Error(err?.error || 'Erro no login');
    }

    // Lê token retornado
    const { token } = await res.json();
    localStorage.setItem('token', token);

    // Após login, busca perfil do usuário
    const meRes = await fetch(`${API}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData: User = await meRes.json();
    setUser(meData);
  };

  // Função de logout: remove token e limpa usuário
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

// Hook para usar o contexto
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
