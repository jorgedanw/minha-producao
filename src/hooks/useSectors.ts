// src/hooks/useSectors.ts
import { useState, useEffect } from 'react';

// Interface do setor
export interface Sector {
  id: string;
  name: string;
  weight: number;
}

// Hook para buscar a lista de setores
export function useSectors() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  // Função que faz GET /api/sectors
  const fetchSectors = () => {
    const token = localStorage.getItem('token');
    fetch('/api/sectors', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((data: Sector[]) => setSectors(data))
      .finally(() => setLoading(false));
  };

  // Busca setores ao montar o hook
  useEffect(fetchSectors, []);

  // Exponha setores, loading e função de refresh
  return { sectors, loading, refresh: fetchSectors };
}
