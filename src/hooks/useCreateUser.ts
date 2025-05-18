// src/hooks/useCreateUser.ts

import { useState } from 'react';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export function useCreateUser(onSuccess: () => void) {
  // controla o estado de carregamento e possíveis erros
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Base da API: em dev, proxy '/api'; em prod, usa VITE_API_URL
  const API = import.meta.env.VITE_API_URL ?? '';

  async function createUser(input: CreateUserInput) {
    setLoading(true);
    setError(null);

    try {
      // Lê o token JWT do localStorage
      const token = localStorage.getItem('token');

      // Faz POST para /users na URL completa
      const res = await fetch(`${API}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Autoriza a requisição com Bearer token
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });

      // Se o status não estiver entre 200–299, lança erro com mensagem do body (se houver)
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || 'Falha ao criar usuário');
      }

      // Consome a resposta (não usamos o retorno aqui)
      await res.json();

      // Callback de sucesso, geralmente para recarregar a lista de usuários
      onSuccess();
    } catch (e: any) {
      // Sinaliza a mensagem de erro para exibir ao usuário
      setError(e.message);
    } finally {
      // Desliga o estado de carregamento
      setLoading(false);
    }
  }

  return { createUser, loading, error };
}
