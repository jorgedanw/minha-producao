// src/hooks/useDeleteUser.ts
import { useState } from 'react';
export function useDeleteUser(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const deleteUser = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok && res.status !== 204) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || 'Falha ao deletar usuário');
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
    return { deleteUser, loading, error };
}
