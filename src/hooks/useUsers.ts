// src/hooks/useUsers.ts

import { useState, useEffect } from 'react';

export interface AppUser {
  id: string;
  name: string;
  email: string;
}

// Hook para buscar a lista de usuários do tenant
export function useUsers() {
  // estados para lista de usuários e indicador de loading
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Base da API: usa proxy '/api' em dev ou URL de produção via VITE_API_URL
  const API = import.meta.env.VITE_API_URL ?? '';

  // Função que faz GET /users
  const fetchUsers = () => {
    setLoading(true); // (re)ativa indicador de loading
    const token = localStorage.getItem('token');

    fetch(`${API}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao carregar usuários');
        return res.json();
      })
      .then((data: AppUser[]) => {
        // atualiza lista de usuários
        setUsers(data);
      })
      .catch(err => {
        console.error('Erro em useUsers:', err);
      })
      .finally(() => {
        // desliga indicador de loading
        setLoading(false);
      });
  };

  // dispara a busca ao montar o componente que usa este hook
  useEffect(fetchUsers, [API]);

  // retorna dados e função de refresh para componentes chamarem
  return { users, loading, refresh: fetchUsers };
}
