// src/hooks/useUpdateUser.ts
import { useState } from 'react';
export function useUpdateUser(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const updateUser = async (id, input) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/users/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(input),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || 'Falha ao atualizar usuário');
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
    return { updateUser, loading, error };
}
