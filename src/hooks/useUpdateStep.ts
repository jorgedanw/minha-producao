// src/hooks/useUpdateStep.ts

import { useState } from 'react';

export function useUpdateStep(onSuccess: () => void) {
  // estados de carregamento e erro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Base da API: usa proxy '/api' em dev ou URL de produção via VITE_API_URL
  const API = import.meta.env.VITE_API_URL ?? '';

  /**
   * Atualiza o status de um step específico
   * @param orderId ID da ordem
   * @param stepId ID do step
   * @param status novo status ('pending' | 'in_progress' | 'done')
   */
  const updateStep = async (
    orderId: string,
    stepId: string,
    status: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Lê token JWT do localStorage
      const token = localStorage.getItem('token');

      // Faz PATCH em /orders/:orderId/steps/:stepId
      const res = await fetch(
        `${API}/orders/${orderId}/steps/${stepId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // inclui token no header
          },
          body: JSON.stringify({ status }), // envia novo status
        }
      );

      // Se não for 2xx, lê JSON de erro e dispara exceção
      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.error || 'Falha ao atualizar step');
      }

      // Consome resposta (step atualizado)
      await res.json();

      // Callback de sucesso para recarregar ordens
      onSuccess();
    } catch (e: any) {
      // Seta mensagem de erro para exibir no componente
      setError(e.message);
    } finally {
      // Desliga indicador de carregamento
      setLoading(false);
    }
  };

  return { updateStep, loading, error };
}
