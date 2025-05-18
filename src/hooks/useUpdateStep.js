import { useState } from 'react';
export function useUpdateStep(onSuccess) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const updateStep = async (orderId, stepId, status) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/orders/${orderId}/steps/${stepId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Falha ao atualizar step');
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
    return { updateStep, loading, error };
}
