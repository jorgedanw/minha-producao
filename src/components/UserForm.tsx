import React, { useState } from 'react';
import { useCreateUser } from '../hooks/useCreateUser';

export function UserForm() {
  const { createUser, loading, error } = useCreateUser(() => window.location.reload());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={() => {
        createUser({ name, email, password });
        setName(''); setEmail(''); setPassword('');
      }} disabled={loading}>
        {loading ? 'Criando…' : 'Criar Usuário'}
      </button>
      {error && <span style={{ color: 'red' }}>{error}</span>}
    </div>
  );
}
