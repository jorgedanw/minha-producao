import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Login.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
        navigate('/dashboard');
    };
    return (_jsxs("form", { onSubmit: handleSubmit, style: { maxWidth: 300, margin: 'auto', padding: '2rem' }, children: [_jsx("h1", { children: "Login" }), _jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("label", { htmlFor: "email", children: "E-mail" }), _jsx("br", {}), _jsx("input", { id: "email", type: "email", required: true, placeholder: "seu@exemplo.com", value: email, onChange: e => setEmail(e.target.value), style: { width: '100%' } })] }), _jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("label", { htmlFor: "password", children: "Senha" }), _jsx("br", {}), _jsx("input", { id: "password", type: "password", required: true, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: password, onChange: e => setPassword(e.target.value), style: { width: '100%' }, autoComplete: "current-password" })] }), _jsx("button", { type: "submit", style: { width: '100%' }, children: "Entrar" })] }));
}
