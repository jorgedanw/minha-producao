import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useCreateUser } from '../hooks/useCreateUser';
export function UserForm() {
    const { createUser, loading, error } = useCreateUser(() => window.location.reload());
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (_jsxs("div", { style: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' }, children: [_jsx("input", { placeholder: "Nome", value: name, onChange: e => setName(e.target.value) }), _jsx("input", { placeholder: "E-mail", value: email, onChange: e => setEmail(e.target.value) }), _jsx("input", { type: "password", placeholder: "Senha", value: password, onChange: e => setPassword(e.target.value) }), _jsx("button", { onClick: () => {
                    createUser({ name, email, password });
                    setName('');
                    setEmail('');
                    setPassword('');
                }, disabled: loading, children: loading ? 'Criando…' : 'Criar Usuário' }), error && _jsx("span", { style: { color: 'red' }, children: error })] }));
}
