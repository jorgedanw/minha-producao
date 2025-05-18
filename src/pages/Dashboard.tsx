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
    <>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>Dashboard de Produção — {user?.name}</h1>
        <button onClick={logout}>Sair</button>
      </header>

      <main style={{ padding: '2rem' }}>
        {/* === CRUD de Setores === */}
        <section
          aria-labelledby="sectores-title"
          style={{ marginBottom: '2rem' }}
        >
          <h2 id="sectores-title">Configurar Setores</h2>

          {/* Criar Setor */}
          <form
            onSubmit={e => {
              e.preventDefault();
              createSector({ name: newName, weight: newWeight });
              setNewName('');
              setNewWeight(1);
            }}
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1rem',
            }}
          >
            <label htmlFor="new-sector-name" style={{ display: 'none' }}>
              Nome do setor
            </label>
            <input
              id="new-sector-name"
              placeholder="Nome"
              value={newName}
              onChange={e => setNewName(e.target.value)}
            />

            <label htmlFor="new-sector-weight" style={{ display: 'none' }}>
              Peso do setor
            </label>
            <input
              id="new-sector-weight"
              type="number"
              placeholder="Peso"
              value={newWeight}
              onChange={e => setNewWeight(Number(e.target.value))}
            />

            <button type="submit" disabled={creatingSector}>
              {creatingSector ? 'Criando...' : 'Criar Setor'}
            </button>
            {createSectorError && (
              <span style={{ color: 'red' }}>{createSectorError}</span>
            )}
          </form>

          {/* Listar e editar setores */}
          {loadingSectors ? (
            <p>Carregando setores…</p>
          ) : (
            <ul>
              {sectors.map(s => (
                <li key={s.id} style={{ marginBottom: '0.5rem' }}>
                  {editId === s.id ? (
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        updateSector(s.id, { name: editName, weight: editWeight });
                        setEditId(null);
                      }}
                      style={{ display: 'flex', gap: '0.5rem' }}
                    >
                      <label htmlFor={`edit-name-${s.id}`} style={{ display: 'none' }}>
                        Nome do setor
                      </label>
                      <input
                        id={`edit-name-${s.id}`}
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                      />

                      <label
                        htmlFor={`edit-weight-${s.id}`}
                        style={{ display: 'none' }}
                      >
                        Peso do setor
                      </label>
                      <input
                        id={`edit-weight-${s.id}`}
                        type="number"
                        value={editWeight}
                        onChange={e => setEditWeight(Number(e.target.value))}
                      />

                      <button type="submit" disabled={updatingSector}>
                        {updatingSector ? 'Salvando…' : 'Salvar'}
                      </button>
                      <button type="button" onClick={() => setEditId(null)}>
                        Cancelar
                      </button>
                      {updateSectorError && (
                        <span style={{ color: 'red' }}>{updateSectorError}</span>
                      )}
                    </form>
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
                        <span style={{ color: 'red' }}>{deleteSectorError}</span>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* === CRUD de Usuários === */}
        <section aria-labelledby="usuarios-title" style={{ marginBottom: '2rem' }}>
          <h2 id="usuarios-title">Configurar Usuários</h2>
          <UserForm />
          <UserList />
        </section>

        {/* === CRUD de Ordens === */}
        <section aria-labelledby="ordens-title" style={{ marginBottom: '2rem' }}>
          <h2 id="ordens-title">Gestão de Ordens</h2>

          {/* Criar Ordem */}
          <form
            onSubmit={e => {
              e.preventDefault();
              createOrder({ color, delivery });
              setColor('');
              setDelivery('');
            }}
            style={{ marginBottom: '1rem' }}
          >
            <label htmlFor="order-color" style={{ display: 'none' }}>
              Cor da ordem
            </label>
            <input
              id="order-color"
              placeholder="Cor"
              value={color}
              onChange={e => setColor(e.target.value)}
              style={{ marginRight: '0.5rem' }}
            />

            <label htmlFor="order-delivery" style={{ display: 'none' }}>
              Tipo de entrega
            </label>
            <input
              id="order-delivery"
              placeholder="Tipo de entrega"
              value={delivery}
              onChange={e => setDelivery(e.target.value)}
              style={{ marginRight: '0.5rem' }}
            />

            <button type="submit" disabled={creatingOrder}>
              {creatingOrder ? 'Criando…' : 'Criar Ordem'}
            </button>
            {createOrderError && (
              <span style={{ color: 'red', marginLeft: '0.5rem' }}>
                {createOrderError}
              </span>
            )}
          </form>

          {/* Listagem de ordens */}
          {loadingOrders ? (
            <p>Carregando ordens…</p>
          ) : orders.length > 0 ? (
            orders.map((order: Order) => (
              <article
                key={order.id}
                style={{
                  border: '1px solid #999',
                  margin: '1rem 0',
                  padding: '1rem',
                }}
              >
                <h3>Ordem ID: {order.id}</h3>
                <p>
                  <strong>Criada em:</strong>{' '}
                  {new Date(order.createdAt).toLocaleString()}
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
                      <strong>{step.sector.name}:</strong>{' '}
                      <em>{step.status}</em>
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
              </article>
            ))
          ) : (
            <p>Nenhuma ordem criada.</p>
          )}
        </section>
      </main>

      <footer
        style={{
          padding: '1rem',
          borderTop: '1px solid #ccc',
          textAlign: 'center',
        }}
      >
        © 2025 ProdApp
      </footer>
    </>
  );
};
