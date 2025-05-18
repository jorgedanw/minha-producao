// src/pages/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: 'auto', padding: '2rem' }}>
      <h1>Login</h1>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">E-mail</label><br />
        <input
          id="email"
          type="email"
          required
          placeholder="seu@exemplo.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="password">Senha</label><br />
        <input
          id="password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width: '100%' }}
          autoComplete="current-password"
        />
      </div>
      <button type="submit" style={{ width: '100%' }}>
        Entrar
      </button>
    </form>
  );
}
