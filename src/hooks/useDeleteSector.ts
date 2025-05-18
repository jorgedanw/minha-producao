// src/hooks/useDeleteSector.ts

import { useState } from 'react';

/**
 * Hook para deletar um setor e, em caso de sucesso, chamar onSuccess para recarregar lista
 */
export function useDeleteSector(onSuccess: () => void) {
  // Estado de carregamento e possível erro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Base da API: proxy em dev ou URL em prod via VITE_API_URL
  const API = import.meta.env.VITE_API_URL ?? '';

  /**
   * Função que faz DELETE /sectors/:id
   */
  const deleteSector = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      // Lê token JWT armazenado
      const token = localStorage.getItem('token');

      // Chama o endpoint DELETE
      const res = await fetch(`${API}/sectors/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // inclui token no header
        },
      });

      // Se não for 204 No Content, tenta ler mensagem de erro
      if (res.status !== 204) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || 'Falha ao deletar setor');
      }

      // Callback de sucesso para recarregar lista
      onSuccess();
    } catch (e: any) {
      // Seta mensagem de erro para o componente mostrar
      setError(e.message);
    } finally {
      // Desliga o indicador de carregamento
      setLoading(false);
    }
  };

  return { deleteSector, loading, error };
}
