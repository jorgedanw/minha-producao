// src/hooks/useCreateSector.ts

import { useState } from 'react';
import type { Sector } from './useSectors';

interface CreateSectorInput {
  name: string;
  weight: number;
}

// Hook para criar um setor e chamar onSuccess para recarregar
export function useCreateSector(onSuccess: () => void) {
  // estados de carregamento e erro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // base da API: usa proxy em dev ou URL em prod
  const API = import.meta.env.VITE_API_URL ?? '';

  const createSector = async (input: CreateSectorInput) => {
    setLoading(true);
    setError(null);
    try {
      // busca token JWT
      const token = localStorage.getItem('token');

      // chama a rota POST /sectors na API completa
      const res = await fetch(`${API}/sectors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // inclui token no header
        },
        body: JSON.stringify(input), // envia { name, weight }
      });

      // se não for 2xx, lê mensagem de erro do corpo
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Falha ao criar setor');
      }

      // consome body (setor criado)
      await res.json();

      // atualiza lista de setores após sucesso
      onSuccess();
    } catch (e: any) {
      // seta mensagem de erro para exibição
      setError(e.message);
    } finally {
      // desliga estado de loading
      setLoading(false);
    }
  };

  return { createSector, loading, error };
}
