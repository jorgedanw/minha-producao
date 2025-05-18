// src/hooks/useOrders.ts

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

// Hook para buscar todas as ordens do tenant
export function useOrders() {
  // estados para lista de ordens e carregamento
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Base da API: usa proxy em dev ou URL de produção via VITE_API_URL
  const API = import.meta.env.VITE_API_URL ?? '';

  // Função que busca as ordens
  const fetchOrders = () => {
    setLoading(true); // opcional: reinicia indicador de loading
    const token = localStorage.getItem('token');

    // GET /orders na API completa
    fetch(`${API}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao carregar ordens');
        return res.json();
      })
      .then((data: Order[]) => setOrders(data))
      .catch(err => {
        console.error('Erro em useOrders:', err);
      })
      .finally(() => setLoading(false));
  };

  // Chama fetchOrders ao montar o hook
  useEffect(fetchOrders, [API]);

  // Retorna lista, indicador de loading e função de refresh
  return { orders, loading, refresh: fetchOrders };
}
