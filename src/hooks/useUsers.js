// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
export function useUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchUsers = () => {
        const token = localStorage.getItem('token');
        fetch('/api/users', {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then((data) => setUsers(data))
            .finally(() => setLoading(false));
    };
    useEffect(fetchUsers, []);
    return { users, loading, refresh: fetchUsers };
}
