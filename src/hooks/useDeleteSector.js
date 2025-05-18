// src/hooks/useDeleteSector.ts
import { useState } from 'react';
// Hook para deletar um setor e chamar onSuccess
export function useDeleteSector(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const deleteSector = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/sectors/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok && res.status !== 204) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || 'Falha ao deletar setor');
            }
            onSuccess();
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setLoading(false);
        }
    };
    return { deleteSector, loading, error };
}
