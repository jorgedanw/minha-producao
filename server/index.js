// server/index.js

// 1) Carrega variáveis de ambiente (.env)
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

// 2) Instancia o Prisma Client para acessar o Postgres
const prisma = new PrismaClient();

// 3) Cria a aplicação Express
const app = express();

// 4) Middleware CORS: libera localhost em dev e qualquer subdomínio vercel.app em prod
app.use(cors({
  origin: (origin, callback) => {
    // sem origin (curl, Postman) ou em localhost → ok
    if (!origin || origin.startsWith('http://localhost')) {
      return callback(null, true);
    }
    // qualquer subdomínio *.vercel.app → ok
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    // caso contrário, bloqueia
    return callback(new Error('CORS não autorizado pelo servidor'), false);
  },
  methods: ['GET','POST','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// 5) Middleware para parse automático de JSON
app.use(express.json());

// 6) Health-check público
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 7) Login: valida usuário e retorna JWT
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: 'Usuário ou senha inválidos' });

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenantId },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (err) {
    console.error('Erro no POST /api/login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// 8) Middleware de autenticação para proteger rotas seguintes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.userId = payload.userId;
    req.tenantId = payload.tenantId;
    next();
  });
}

// 9) Perfil do usuário logado
app.get('/api/me', authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, name: true, email: true, tenantId: true }
  });
  res.json(user);
});

// 10) CRUD Setores
app.get('/api/sectors', authenticateToken, async (req, res) => {
  const sectors = await prisma.sector.findMany({
    where: { tenantId: req.tenantId },
    orderBy: { weight: 'asc' }
  });
  res.json(sectors);
});

app.post('/api/sectors', authenticateToken, async (req, res) => {
  const { name, weight } = req.body;
  if (!name || typeof weight !== 'number')
    return res.status(400).json({ error: 'Nome e peso (número) são obrigatórios' });

  const sector = await prisma.sector.create({
    data: { name, weight, tenantId: req.tenantId }
  });
  res.status(201).json(sector);
});

app.patch('/api/sectors/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, weight } = req.body;
  const data = {};
  if (name !== undefined) data.name = name;
  if (weight !== undefined) {
    if (typeof weight !== 'number')
      return res.status(400).json({ error: 'Peso deve ser um número' });
    data.weight = weight;
  }
  const sector = await prisma.sector.update({ where: { id }, data });
  res.json(sector);
});

app.delete('/api/sectors/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    // primeiro remove os steps que dependem deste setor
    await prisma.orderStep.deleteMany({ where: { sectorId: id } });
    await prisma.sector.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao deletar setor:', err);
    res.status(500).json({ error: 'Falha ao deletar setor' });
  }
});

// 11) CRUD Ordens
app.post('/api/orders', authenticateToken, async (req, res) => {
  const { color, delivery } = req.body;
  if (!color || !delivery)
    return res.status(400).json({ error: 'Cor e tipo de entrega são obrigatórios' });

  const sectors = await prisma.sector.findMany({ where: { tenantId: req.tenantId } });
  if (sectors.length === 0)
    return res.status(400).json({ error: 'Nenhum setor configurado para este tenant' });

  const order = await prisma.order.create({ data: { color, delivery, tenantId: req.tenantId } });
  const steps = await Promise.all(
    sectors.map(s =>
      prisma.orderStep.create({ data: { orderId: order.id, sectorId: s.id, status: 'pending' } })
    )
  );
  res.status(201).json({ order, steps });
});

app.get('/api/orders', authenticateToken, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { tenantId: req.tenantId },
    include: { orderSteps: { include: { sector: true }, orderBy: { id: 'asc' } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(orders);
});

app.patch('/api/orders/:orderId/steps/:stepId', authenticateToken, async (req, res) => {
  const { stepId } = req.params;
  const { status } = req.body;
  if (!['pending', 'in_progress', 'done'].includes(status))
    return res.status(400).json({ error: 'Status inválido' });

  const data = { status };
  if (status === 'in_progress') data.startedAt = new Date();
  if (status === 'done') data.finishedAt = new Date();

  const step = await prisma.orderStep.update({ where: { id: stepId }, data });
  res.json(step);
});

// 12) CRUD Usuários
app.get('/api/users', authenticateToken, async (req, res) => {
  const users = await prisma.user.findMany({
    where: { tenantId: req.tenantId },
    select: { id: true, name: true, email: true }
  });
  res.json(users);
});

app.post('/api/users', authenticateToken, async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios' });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists)
    return res.status(400).json({ error: 'E-mail já cadastrado' });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hash, tenantId: req.tenantId }
  });
  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

app.patch('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;
  const data = {};
  if (name !== undefined) data.name = name;
  if (password !== undefined) data.password = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true }
  });
  res.json(user);
});

app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  if (id === req.userId)
    return res.status(400).json({ error: 'Não é possível deletar a si mesmo' });
  await prisma.user.delete({ where: { id } });
  res.status(204).end();
});

// 13) Inicia o servidor na porta definida em .env (fallback 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
