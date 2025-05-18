import { useState, useEffect } from 'react';

export interface OrderStep {
  id: string;
  status: string;
  startedAt: string | null;
  finishedAt: string | null;
  sector: { name: string };
}

export interface Order {
  id: string;
  createdAt: string;
  color: string;
  delivery: string;
  orderSteps: OrderStep[];
}

// Busca todas as ordens do tenant
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    const token = localStorage.getItem('token');
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((data: Order[]) => setOrders(data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchOrders, []);
  return { orders, loading, refresh: fetchOrders };
}
