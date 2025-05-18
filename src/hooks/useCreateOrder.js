import { useState } from 'react';
export function useCreateOrder(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const createOrder = async (input) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(input),
            });
            if (!res.ok)
                throw new Error('Falha ao criar ordem');
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
    return { createOrder, loading, error };
}
