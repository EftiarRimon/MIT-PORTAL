require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  let done = 0;
  for (const u of users) {
    if (u.password.startsWith('$2')) continue; // already hashed
    const hash = await bcrypt.hash(u.password, 10);
    await prisma.user.update({ where: { email: u.email }, data: { password: hash } });
    done++;
  }
  console.log(`Hashed ${done} of ${users.length} users`);
}

main().finally(() => prisma.$disconnect());
