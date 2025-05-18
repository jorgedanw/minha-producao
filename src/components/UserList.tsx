import React, { useState } from 'react';
import { useUsers, AppUser } from '../hooks/useUsers';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { useDeleteUser } from '../hooks/useDeleteUser';

export function UserList() {
  const { users, loading, refresh } = useUsers();
  const { updateUser, loading: updLoading, error: updError } = useUpdateUser(refresh);
  const { deleteUser, loading: delLoading, error: delError } = useDeleteUser(refresh);

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');

  if (loading) return <p>Carregando usuários…</p>;

  return (
    <ul>
      {users.map(u => (
        <li key={u.id} style={{ marginBottom: '0.5rem' }}>
          {editId === u.id ? (
            <>
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Nome"
                style={{ marginRight: '0.5rem' }}
              />
              <input
                type="password"
                value={editPassword}
                onChange={e => setEditPassword(e.target.value)}
                placeholder="Nova senha"
                style={{ marginRight: '0.5rem' }}
              />
              <button
                onClick={() => {
                  updateUser(u.id, { name: editName, password: editPassword });
                  setEditId(null);
                }}
                disabled={updLoading}
              >
                {updLoading ? 'Salvando…' : 'Salvar'}
              </button>
              <button onClick={() => setEditId(null)}>Cancelar</button>
              {updError && <span style={{ color: 'red', marginLeft:'0.5rem' }}>{updError}</span>}
            </>
          ) : (
            <>
              <strong>{u.name}</strong> ({u.email})
              <button
                onClick={() => {
                  setEditId(u.id);
                  setEditName(u.name);
                  setEditPassword('');
                }}
                style={{ marginLeft: '1rem' }}
              >
                Editar
              </button>
              <button
                onClick={() => deleteUser(u.id)}
                disabled={delLoading}
                style={{ marginLeft: '0.5rem' }}
              >
                Excluir
              </button>
              {delError && <span style={{ color: 'red', marginLeft:'0.5rem' }}>{delError}</span>}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
