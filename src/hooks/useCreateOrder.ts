// src/hooks/useCreateOrder.ts

import { useState } from 'react';

interface CreateOrderInput {
  color: string;
  delivery: string;
}

export function useCreateOrder(onSuccess: () => void) {
  // controla estado de carregamento e possíveis erros
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // base da API: em dev proxy '/api', em prod usa VITE_API_URL
  const API = import.meta.env.VITE_API_URL ?? '';

  // função para criar uma nova ordem
  const createOrder = async (input: CreateOrderInput) => {
    setLoading(true);
    setError(null);
    try {
      // busca token armazenado
      const token = localStorage.getItem('token');

      // chama POST /orders na API completa
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // autenticação
        },
        body: JSON.stringify(input), // envia cor e entrega
      });

      // lança erro se status != 2xx
      if (!res.ok) {
        throw new Error('Falha ao criar ordem');
      }

      // consome resposta (pode conter order e steps)
      await res.json();

      // se tudo certo, executa callback (atualizar lista)
      onSuccess();
    } catch (e: any) {
      // define mensagem de erro para exibição
      setError(e.message);
    } finally {
      // sempre desliga o loading
      setLoading(false);
    }
  };

  // retorna função e estados para o componente usar
  return { createOrder, loading, error };
}
