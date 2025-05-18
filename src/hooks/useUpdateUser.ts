// src/hooks/useUpdateUser.ts

import { useState } from 'react';

interface UpdateUserInput {
  name?: string;
  password?: string;
}

// Hook para atualizar um usuário e chamar onSuccess ao concluir
export function useUpdateUser(onSuccess: () => void) {
  // estados de carregamento e erro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Base da API: uses proxy '/api' in dev or production URL via VITE_API_URL
  const API = import.meta.env.VITE_API_URL ?? '';

  /**
   * Atualiza dados de um usuário
   * @param id ID do usuário
   * @param input campos a atualizar (name e/ou password)
   */
  const updateUser = async (id: string, input: UpdateUserInput) => {
    setLoading(true);
    setError(null);

    try {
      // Lê token JWT armazenado
      const token = localStorage.getItem('token');

      // Faz PATCH na rota /users/:id
      const res = await fetch(`${API}/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // inclui token no header
        },
        body: JSON.stringify(input), // envia name e/ou password
      });

      // Se status não for 2xx, lê corpo de erro antes de lançar
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || 'Falha ao atualizar usuário');
      }

      // Consome JSON de resposta (usuário atualizado)
      await res.json();

      // Callback de sucesso: por exemplo, recarregar lista de usuários
      onSuccess();
    } catch (e: any) {
      // Seta mensagem de erro para exibir no componente
      setError(e.message);
    } finally {
      // Desliga indicador de carregamento
      setLoading(false);
    }
  };

  return { updateUser, loading, error };
}
