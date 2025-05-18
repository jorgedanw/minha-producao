// src/hooks/useUpdateSector.ts

import { useState } from 'react';
import type { Sector } from './useSectors';

interface UpdateSectorInput {
  name?: string;
  weight?: number;
}

// Hook para atualizar um setor e chamar onSuccess
export function useUpdateSector(onSuccess: () => void) {
  // estados de carregamento e erro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Base da API: proxy em dev ou URL em produção via VITE_API_URL
  const API = import.meta.env.VITE_API_URL ?? '';

  /**
   * Função para chamar PATCH /sectors/:id
   */
  const updateSector = async (id: string, input: UpdateSectorInput) => {
    setLoading(true);
    setError(null);

    try {
      // busca token JWT
      const token = localStorage.getItem('token');

      // faz PATCH para atualizar o setor
      const res = await fetch(`${API}/sectors/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // autenticação
        },
        body: JSON.stringify(input), // envia o nome ou peso (ou ambos)
      });

      // se não for 2xx, lê mensagem de erro
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || 'Falha ao atualizar setor');
      }

      // consome resposta (setor atualizado)
      await res.json();

      // callback de sucesso para recarregar lista
      onSuccess();
    } catch (e: any) {
      // seta mensagem de erro para exibição
      setError(e.message);
    } finally {
      // desliga indicador de carregamento
      setLoading(false);
    }
  };

  return { updateSector, loading, error };
}
