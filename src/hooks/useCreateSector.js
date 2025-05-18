// src/hooks/useCreateSector.ts
import { useState } from 'react';
// Hook para criar um setor e chamar onSuccess para recarregar
export function useCreateSector(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const createSector = async (input) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/sectors', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(input),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || 'Falha ao criar setor');
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
    return { createSector, loading, error };
}
