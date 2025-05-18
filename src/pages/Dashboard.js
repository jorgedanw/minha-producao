import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/Dashboard.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSectors } from '../hooks/useSectors';
import { useCreateSector } from '../hooks/useCreateSector';
import { useUpdateSector } from '../hooks/useUpdateSector';
import { useDeleteSector } from '../hooks/useDeleteSector';
import { useOrders } from '../hooks/useOrders';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { useUpdateStep } from '../hooks/useUpdateStep';
// ** Importes dos componentes de Usuários **
import { UserForm } from '../components/UserForm';
import { UserList } from '../components/UserList';
/**
 * Dashboard com CRUD de Setores, Gestão de Ordens e Gestão de Usuários
 */
export const Dashboard = () => {
    // 1) Autenticação: usuário e logout
    const { user, logout } = useAuth();
    // 2) Hooks de Setores
    const { sectors, loading: loadingSectors, refresh: refreshSectors, } = useSectors();
    const { createSector, loading: creatingSector, error: createSectorError, } = useCreateSector(refreshSectors);
    const { updateSector, loading: updatingSector, error: updateSectorError, } = useUpdateSector(refreshSectors);
    const { deleteSector, loading: deletingSector, error: deleteSectorError, } = useDeleteSector(refreshSectors);
    // Estados para inputs de setor
    const [newName, setNewName] = useState('');
    const [newWeight, setNewWeight] = useState(1);
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editWeight, setEditWeight] = useState(1);
    // 3) Hooks de Ordens
    const { orders, loading: loadingOrders, refresh: refreshOrders, } = useOrders();
    const { createOrder, loading: creatingOrder, error: createOrderError, } = useCreateOrder(refreshOrders);
    const { updateStep } = useUpdateStep(refreshOrders);
    const [color, setColor] = useState('');
    const [delivery, setDelivery] = useState('');
    return (_jsxs("div", { style: { padding: '2rem' }, children: [_jsxs("h1", { children: ["Bem-vindo, ", user?.name] }), _jsx("button", { onClick: logout, style: { marginBottom: '1rem' }, children: "Sair" }), _jsxs("section", { style: { marginBottom: '2rem' }, children: [_jsx("h2", { children: "Configurar Setores" }), _jsxs("div", { style: { display: 'flex', gap: '0.5rem', marginBottom: '1rem' }, children: [_jsx("input", { placeholder: "Nome", value: newName, onChange: e => setNewName(e.target.value) }), _jsx("input", { type: "number", placeholder: "Peso", value: newWeight, onChange: e => setNewWeight(Number(e.target.value)) }), _jsx("button", { onClick: () => {
                                    createSector({ name: newName, weight: newWeight });
                                    setNewName('');
                                    setNewWeight(1);
                                }, disabled: creatingSector, children: creatingSector ? 'Criando...' : 'Criar Setor' }), createSectorError && (_jsx("span", { style: { color: 'red' }, children: createSectorError }))] }), loadingSectors ? (_jsx("p", { children: "Carregando setores..." })) : (_jsx("ul", { children: sectors.map(s => (_jsx("li", { style: { marginBottom: '0.5rem' }, children: editId === s.id ? (_jsxs(_Fragment, { children: [_jsx("input", { value: editName, onChange: e => setEditName(e.target.value), style: { marginRight: '0.5rem' } }), _jsx("input", { type: "number", value: editWeight, onChange: e => setEditWeight(Number(e.target.value)), style: { marginRight: '0.5rem' } }), _jsx("button", { onClick: () => {
                                            updateSector(s.id, { name: editName, weight: editWeight });
                                            setEditId(null);
                                        }, disabled: updatingSector, children: updatingSector ? 'Salvando...' : 'Salvar' }), _jsx("button", { onClick: () => setEditId(null), children: "Cancelar" }), updateSectorError && (_jsx("span", { style: { color: 'red', marginLeft: '0.5rem' }, children: updateSectorError }))] })) : (_jsxs(_Fragment, { children: [_jsx("strong", { children: s.name }), " (peso: ", s.weight, ")", _jsx("button", { onClick: () => {
                                            setEditId(s.id);
                                            setEditName(s.name);
                                            setEditWeight(s.weight);
                                        }, style: { marginLeft: '1rem' }, children: "Editar" }), _jsx("button", { onClick: () => deleteSector(s.id), disabled: deletingSector, style: { marginLeft: '0.5rem' }, children: "Excluir" }), deleteSectorError && (_jsx("span", { style: { color: 'red', marginLeft: '0.5rem' }, children: deleteSectorError }))] })) }, s.id))) }))] }), _jsxs("section", { style: { marginBottom: '2rem' }, children: [_jsx("h2", { children: "Configurar Usu\u00E1rios" }), _jsx(UserForm, {}), _jsx(UserList, {})] }), _jsxs("section", { style: { marginBottom: '2rem' }, children: [_jsx("h2", { children: "Gest\u00E3o de Ordens" }), _jsxs("div", { style: { marginBottom: '1rem' }, children: [_jsx("input", { placeholder: "Cor", value: color, onChange: e => setColor(e.target.value), style: { marginRight: '0.5rem' } }), _jsx("input", { placeholder: "Tipo de entrega", value: delivery, onChange: e => setDelivery(e.target.value), style: { marginRight: '0.5rem' } }), _jsx("button", { onClick: () => {
                                    createOrder({ color, delivery });
                                    setColor('');
                                    setDelivery('');
                                }, disabled: creatingOrder, children: creatingOrder ? 'Criando…' : 'Criar Ordem' }), createOrderError && (_jsx("span", { style: { color: 'red', marginLeft: '0.5rem' }, children: createOrderError }))] }), loadingOrders ? (_jsx("p", { children: "Carregando ordens\u2026" })) : orders.length > 0 ? (orders.map((order) => (_jsxs("div", { style: { border: '1px solid #999', margin: '1rem 0', padding: '1rem' }, children: [_jsxs("p", { children: [_jsx("strong", { children: "Ordem ID:" }), " ", order.id] }), _jsxs("p", { children: [_jsx("strong", { children: "Criada em:" }), " ", new Date(order.createdAt).toLocaleString()] }), _jsxs("p", { children: [_jsx("strong", { children: "Cor:" }), " ", order.color] }), _jsxs("p", { children: [_jsx("strong", { children: "Entrega:" }), " ", order.delivery] }), _jsx("h4", { children: "Steps:" }), order.orderSteps.map(step => (_jsxs("div", { style: { display: 'flex', alignItems: 'center', margin: '0.5rem 0' }, children: [_jsxs("span", { children: [_jsxs("strong", { children: [step.sector.name, ":"] }), " ", _jsx("em", { children: step.status })] }), step.status === 'pending' && (_jsx("button", { onClick: () => updateStep(order.id, step.id, 'in_progress'), style: { marginLeft: '1rem' }, children: "Iniciar" })), step.status === 'in_progress' && (_jsx("button", { onClick: () => updateStep(order.id, step.id, 'done'), style: { marginLeft: '1rem' }, children: "Concluir" }))] }, step.id)))] }, order.id)))) : (_jsx("p", { children: "Nenhuma ordem criada." }))] })] }));
};
