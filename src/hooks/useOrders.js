import { useState, useEffect } from 'react';
// Busca todas as ordens do tenant
export function useOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchOrders = () => {
        const token = localStorage.getItem('token');
        fetch('/api/orders', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then((data) => setOrders(data))
            .finally(() => setLoading(false));
    };
    useEffect(fetchOrders, []);
    return { orders, loading, refresh: fetchOrders };
}
