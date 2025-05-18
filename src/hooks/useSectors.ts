// src/hooks/useSectors.ts

import { useState, useEffect } from 'react';

// Interface que define o formato de um setor
export interface Sector {
  id: string;
  name: string;
  weight: number;
}

// Hook para buscar a lista de setores do tenant
export function useSectors() {
  // estados: lista de setores e indicador de loading
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  // Base da API: usa proxy '/api' em dev ou URL real em produção via VITE_API_URL
  const API = import.meta.env.VITE_API_URL ?? '';

  // Função que faz GET /sectors
  const fetchSectors = () => {
    setLoading(true); // (re)ativa indicador de loading

    // lê token JWT do localStorage
    const token = localStorage.getItem('token');

    // faz fetch para `${API}/sectors`
    fetch(`${API}/sectors`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Falha ao carregar setores');
        return res.json();
      })
      .then((data: Sector[]) => {
        // atualiza lista de setores
        setSectors(data);
      })
      .catch(err => {
        console.error('Erro em useSectors:', err);
      })
      .finally(() => {
        // desliga indicador de loading
        setLoading(false);
      });
  };

  // dispara a busca ao montar o componente que usa este hook
  useEffect(fetchSectors, [API]);

  // retorna dados e função de refresh para componentes chamarem
  return { sectors, loading, refresh: fetchSectors };
}
