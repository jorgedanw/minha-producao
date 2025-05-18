// src/hooks/useCreateUser.ts
import { useState } from 'react';
export function useCreateUser(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const createUser = async (input) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(input),
            });
            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.error || 'Falha ao criar usuário');
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
    return { createUser, loading, error };
}
