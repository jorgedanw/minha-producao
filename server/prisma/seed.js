// server/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

async function main() {
  const prisma = new PrismaClient();

  // (1) Cria um tenant
  const tenant = await prisma.tenant.create({
    data: { name: 'Cliente Demo' }
  });

  // (2) Cria o usuário Admin Demo
  const hashedPassword = await bcrypt.hash('123456', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Admin Demo',
      email: 'admin@demo.com',
      password: hashedPassword,
      tenantId: tenant.id
    }
  });

  // (3) Cria setores padrão
  const sectorNames = [
    'Serralheria',
    'Perfiladeira',
    'Pintura',
    'Solda',
    'Almoxarifado',
    'Expedição',
    'Instalação'
  ];
  await Promise.all(
    sectorNames.map(name =>
      prisma.sector.create({
        data: { name, weight: 1, tenantId: tenant.id }
      })
    )
  );

  console.log('✔ Seed criado:', { tenant, user, sectors: sectorNames });
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
