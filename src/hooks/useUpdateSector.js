// src/hooks/useUpdateSector.ts
import { useState } from 'react';
// Hook para atualizar um setor e chamar onSuccess
export function useUpdateSector(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const updateSector = async (id, input) => {
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
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setLoading(false);
        }
    };
    return { updateSector, loading, error };
}
