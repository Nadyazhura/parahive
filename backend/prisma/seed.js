import 'dotenv/config';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const roles = ['SYSADMIN', 'CLUBHEAD', 'FLIGHTMANAGER', 'PILOT'];
const pilotStatuses = ['student', 'active', 'inactive'];
const pilotRanks = ['none', 'third_rank', 'second_rank', 'first_rank', 'above_first'];

function getSysadminEnv() {
  const values = {
    login: process.env.SEED_SYSADMIN_LOGIN,
    email: process.env.SEED_SYSADMIN_EMAIL,
    password: process.env.SEED_SYSADMIN_PASSWORD,
    fullName: process.env.SEED_SYSADMIN_FULL_NAME,
  };

  const required = ['login', 'email', 'password'];
  const missing = required.filter((key) => !values[key]);
  const allMissing = missing.length === required.length;

  if (allMissing) {
    return null;
  }

  if (missing.length > 0) {
    throw new Error(`Missing required SYSADMIN seed env vars: ${missing.map((key) => `SEED_SYSADMIN_${key.toUpperCase()}`).join(', ')}`);
  }

  if (values.password.length < 12) {
    throw new Error('SEED_SYSADMIN_PASSWORD must be at least 12 characters long.');
  }

  return values;
}

async function seedDictionary(model, codes) {
  await model.createMany({
    data: codes.map((code) => ({ code })),
    skipDuplicates: true,
  });
}

async function seedFirstSysadmin() {
  const sysadmin = getSysadminEnv();

  if (!sysadmin) {
    console.info('SYSADMIN seed skipped: SEED_SYSADMIN_LOGIN, SEED_SYSADMIN_EMAIL, and SEED_SYSADMIN_PASSWORD are not set.');
    return;
  }

  const existingSysadminCount = await prisma.user.count({
    where: { roleCode: 'SYSADMIN' },
  });

  if (existingSysadminCount > 0) {
    console.info('SYSADMIN seed skipped: at least one SYSADMIN already exists.');
    return;
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ login: sysadmin.login }, { email: sysadmin.email }],
    },
  });

  if (existingUser) {
    throw new Error('Refusing to promote an existing user to SYSADMIN during seed. Use unique SEED_SYSADMIN_LOGIN and SEED_SYSADMIN_EMAIL.');
  }

  const argon2 = await import('argon2');
  const passwordHash = await argon2.hash(sysadmin.password, {
    type: argon2.argon2id,
  });

  await prisma.user.create({
    data: {
      login: sysadmin.login,
      email: sysadmin.email,
      passwordHash,
      roleCode: 'SYSADMIN',
      pilotProfile: {
        create: {
          fullName: sysadmin.fullName ?? sysadmin.login,
          statusCode: 'active',
          rankCode: 'none',
        },
      },
    },
  });

  console.info(`SYSADMIN user created: ${sysadmin.login}`);
}

async function main() {
  await seedDictionary(prisma.role, roles);
  await seedDictionary(prisma.pilotStatus, pilotStatuses);
  await seedDictionary(prisma.pilotRank, pilotRanks);
  await seedFirstSysadmin();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
