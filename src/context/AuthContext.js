import { jsx as _jsx } from "react/jsx-runtime";
// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, } from 'react';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Carrega usuário se houver token
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        fetch('/api/me', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => {
            if (!res.ok)
                throw new Error('Sessão expirada');
            return res.json();
        })
            .then((data) => setUser(data))
            .catch(() => {
            localStorage.removeItem('token');
            setUser(null);
        })
            .finally(() => setLoading(false));
    }, []);
    const login = async (email, password) => {
        const res = await fetch('/api/login', {
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
        // Busca perfil
        const meRes = await fetch('/api/me', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const meData = await meRes.json();
        setUser(meData);
    };
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, loading, login, logout }, children: children }));
};
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    return ctx;
};
