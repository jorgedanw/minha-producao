// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';

export interface AppUser {
  id: string;
  name: string;
  email: string;
}

export function useUsers() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    fetch('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((data: AppUser[]) => setUsers(data))
      .finally(() => setLoading(false));
  };

  useEffect(fetchUsers, []);
  return { users, loading, refresh: fetchUsers };
}
