import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useUpdateUser } from '../hooks/useUpdateUser';
import { useDeleteUser } from '../hooks/useDeleteUser';
export function UserList() {
    const { users, loading, refresh } = useUsers();
    const { updateUser, loading: updLoading, error: updError } = useUpdateUser(refresh);
    const { deleteUser, loading: delLoading, error: delError } = useDeleteUser(refresh);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editPassword, setEditPassword] = useState('');
    if (loading)
        return _jsx("p", { children: "Carregando usu\u00E1rios\u2026" });
    return (_jsx("ul", { children: users.map(u => (_jsx("li", { style: { marginBottom: '0.5rem' }, children: editId === u.id ? (_jsxs(_Fragment, { children: [_jsx("input", { value: editName, onChange: e => setEditName(e.target.value), placeholder: "Nome", style: { marginRight: '0.5rem' } }), _jsx("input", { type: "password", value: editPassword, onChange: e => setEditPassword(e.target.value), placeholder: "Nova senha", style: { marginRight: '0.5rem' } }), _jsx("button", { onClick: () => {
                            updateUser(u.id, { name: editName, password: editPassword });
                            setEditId(null);
                        }, disabled: updLoading, children: updLoading ? 'Salvando…' : 'Salvar' }), _jsx("button", { onClick: () => setEditId(null), children: "Cancelar" }), updError && _jsx("span", { style: { color: 'red', marginLeft: '0.5rem' }, children: updError })] })) : (_jsxs(_Fragment, { children: [_jsx("strong", { children: u.name }), " (", u.email, ")", _jsx("button", { onClick: () => {
                            setEditId(u.id);
                            setEditName(u.name);
                            setEditPassword('');
                        }, style: { marginLeft: '1rem' }, children: "Editar" }), _jsx("button", { onClick: () => deleteUser(u.id), disabled: delLoading, style: { marginLeft: '0.5rem' }, children: "Excluir" }), delError && _jsx("span", { style: { color: 'red', marginLeft: '0.5rem' }, children: delError })] })) }, u.id))) }));
}
