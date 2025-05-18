// src/hooks/useUpdateSector.ts
import { useState } from 'react';
import type { Sector } from './useSectors';

interface UpdateSectorInput {
  name?: string;
  weight?: number;
}

// Hook para atualizar um setor e chamar onSuccess
export function useUpdateSector(onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSector = async (
    id: string,
    input: UpdateSectorInput
  ) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/sectors/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || 'Falha ao atualizar setor');
      }
      await res.json();
      onSuccess();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return { updateSector, loading, error };
}
