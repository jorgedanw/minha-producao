// src/pages/Dashboard.tsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSectors, Sector } from '../hooks/useSectors';
import { useCreateSector } from '../hooks/useCreateSector';
import { useUpdateSector } from '../hooks/useUpdateSector';
import { useDeleteSector } from '../hooks/useDeleteSector';
import { useOrders, Order } from '../hooks/useOrders';
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
  const {
    sectors,
    loading: loadingSectors,
    refresh: refreshSectors,
  } = useSectors();
  const {
    createSector,
    loading: creatingSector,
    error: createSectorError,
  } = useCreateSector(refreshSectors);
  const {
    updateSector,
    loading: updatingSector,
    error: updateSectorError,
  } = useUpdateSector(refreshSectors);
  const {
    deleteSector,
    loading: deletingSector,
    error: deleteSectorError,
  } = useDeleteSector(refreshSectors);

  // Estados para inputs de setor
  const [newName, setNewName] = useState('');
  const [newWeight, setNewWeight] = useState(1);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editWeight, setEditWeight] = useState(1);

  // 3) Hooks de Ordens
  const {
    orders,
    loading: loadingOrders,
    refresh: refreshOrders,
  } = useOrders();
  const {
    createOrder,
    loading: creatingOrder,
    error: createOrderError,
  } = useCreateOrder(refreshOrders);
  const { updateStep } = useUpdateStep(refreshOrders);
  const [color, setColor] = useState('');
  const [delivery, setDelivery] = useState('');

  return (
    <div style={{ padding: '2rem' }}>
      {/* === Cabeçalho === */}
      <h1>Bem-vindo, {user?.name}</h1>
      <button onClick={logout} style={{ marginBottom: '1rem' }}>
        Sair
      </button>

      {/* === CRUD de Setores === */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Configurar Setores</h2>

        {/* Criar Setor */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            placeholder="Nome"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Peso"
            value={newWeight}
            onChange={e => setNewWeight(Number(e.target.value))}
          />
          <button
            onClick={() => {
              createSector({ name: newName, weight: newWeight });
              setNewName('');
              setNewWeight(1);
            }}
            disabled={creatingSector}
          >
            {creatingSector ? 'Criando...' : 'Criar Setor'}
          </button>
          {createSectorError && (
            <span style={{ color: 'red' }}>{createSectorError}</span>
          )}
        </div>

        {/* Listar e editar setores */}
        {loadingSectors ? (
          <p>Carregando setores...</p>
        ) : (
          <ul>
            {sectors.map(s => (
              <li key={s.id} style={{ marginBottom: '0.5rem' }}>
                {editId === s.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <input
                      type="number"
                      value={editWeight}
                      onChange={e => setEditWeight(Number(e.target.value))}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <button
                      onClick={() => {
                        updateSector(s.id, { name: editName, weight: editWeight });
                        setEditId(null);
                      }}
                      disabled={updatingSector}
                    >
                      {updatingSector ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button onClick={() => setEditId(null)}>Cancelar</button>
                    {updateSectorError && (
                      <span style={{ color: 'red', marginLeft: '0.5rem' }}>
                        {updateSectorError}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <strong>{s.name}</strong> (peso: {s.weight})
                    <button
                      onClick={() => {
                        setEditId(s.id);
                        setEditName(s.name);
                        setEditWeight(s.weight);
                      }}
                      style={{ marginLeft: '1rem' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteSector(s.id)}
                      disabled={deletingSector}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      Excluir
                    </button>
                    {deleteSectorError && (
                      <span style={{ color: 'red', marginLeft: '0.5rem' }}>
                        {deleteSectorError}
                      </span>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* === CRUD de Usuários === */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Configurar Usuários</h2>
        <UserForm />
        <UserList />
      </section>

      {/* === CRUD de Ordens === */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Gestão de Ordens</h2>
        {/* Criar Ordem */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            placeholder="Cor"
            value={color}
            onChange={e => setColor(e.target.value)}
            style={{ marginRight: '0.5rem' }}
          />
          <input
            placeholder="Tipo de entrega"
            value={delivery}
            onChange={e => setDelivery(e.target.value)}
            style={{ marginRight: '0.5rem' }}
          />
          <button
            onClick={() => {
              createOrder({ color, delivery });
              setColor('');
              setDelivery('');
            }}
            disabled={creatingOrder}
          >
            {creatingOrder ? 'Criando…' : 'Criar Ordem'}
          </button>
          {createOrderError && (
            <span style={{ color: 'red', marginLeft: '0.5rem' }}>
              {createOrderError}
            </span>
          )}
        </div>

        {/* Listagem de ordens */}
        {loadingOrders ? (
          <p>Carregando ordens…</p>
        ) : orders.length > 0 ? (
          orders.map((order: Order) => (
            <div
              key={order.id}
              style={{ border: '1px solid #999', margin: '1rem 0', padding: '1rem' }}
            >
              <p>
                <strong>Ordem ID:</strong> {order.id}
              </p>
              <p>
                <strong>Criada em:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Cor:</strong> {order.color}
              </p>
              <p>
                <strong>Entrega:</strong> {order.delivery}
              </p>
              <h4>Steps:</h4>
              {order.orderSteps.map(step => (
                <div
                  key={step.id}
                  style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}
                >
                  <span>
                    <strong>{step.sector.name}:</strong> <em>{step.status}</em>
                  </span>
                  {step.status === 'pending' && (
                    <button
                      onClick={() => updateStep(order.id, step.id, 'in_progress')}
                      style={{ marginLeft: '1rem' }}
                    >
                      Iniciar
                    </button>
                  )}
                  {step.status === 'in_progress' && (
                    <button
                      onClick={() => updateStep(order.id, step.id, 'done')}
                      style={{ marginLeft: '1rem' }}
                    >
                      Concluir
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>Nenhuma ordem criada.</p>
        )}
      </section>
    </div>
  );
};
