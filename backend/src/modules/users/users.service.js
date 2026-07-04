import { getPrismaClient } from '../../db/prisma.js';
import { badRequest, notFound } from '../auth/auth.errors.js';
import { hashPassword } from '../auth/password.js';
import {
  assertKnownKeys,
  assertPlainObject,
  normalizeRankCode,
  normalizeRoleCode,
  normalizeStatusCode,
  normalizeTemporaryPassword,
  optionalDate,
  optionalBoolean,
  optionalString,
  parseBooleanQuery,
  parsePagination,
  requiredString,
} from './users.validation.js';

const userInclude = {
  pilotProfile: true,
};

const createUserFields = [
  'login',
  'email',
  'temporaryPassword',
  'roleCode',
  'fullName',
  'birthDate',
  'latinFullName',
  'phone',
  'telegram',
  'address',
  'emergencyContactName',
  'emergencyContactPhone',
  'statusCode',
  'rankCode',
  'parapro',
  'serviceNotes',
];

function isUniqueConstraintError(error) {
  return error?.code === 'P2002';
}

async function ensureUserExists(id) {
  const user = await getPrismaClient().user.findUnique({
    where: { id },
    include: userInclude,
  });

  if (!user) {
    throw notFound('User not found.');
  }

  return user;
}

function normalizeProfileCreateData(body) {
  return {
    fullName: optionalString(body.fullName, 'fullName') ?? null,
    birthDate: optionalDate(body.birthDate, 'birthDate') ?? null,
    latinFullName: optionalString(body.latinFullName, 'latinFullName') ?? null,
    phone: optionalString(body.phone, 'phone', { max: 64 }) ?? null,
    telegram: optionalString(body.telegram, 'telegram', { max: 64 }) ?? null,
    address: optionalString(body.address, 'address', { max: 4096 }) ?? null,
    emergencyContactName: optionalString(body.emergencyContactName, 'emergencyContactName') ?? null,
    emergencyContactPhone: optionalString(body.emergencyContactPhone, 'emergencyContactPhone', { max: 64 }) ?? null,
    statusCode: normalizeStatusCode(body.statusCode),
    rankCode: normalizeRankCode(body.rankCode),
    parapro: optionalString(body.parapro, 'parapro', { max: 32 }) ?? null,
    serviceNotes: optionalString(body.serviceNotes, 'serviceNotes', { max: 4096 }) ?? null,
  };
}

export async function listUsers(query) {
  const prisma = getPrismaClient();
  const { limit, offset } = parsePagination(query);
  const blocked = parseBooleanQuery(query.blocked, 'blocked');
  const where = {};

  if (query.roleCode) {
    where.roleCode = normalizeRoleCode(query.roleCode);
  }

  if (blocked !== undefined) {
    where.blocked = blocked;
  }

  if (query.search) {
    const search = requiredString(query.search, 'search', { max: 255 });
    where.OR = [
      { login: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { pilotProfile: { is: { fullName: { contains: search, mode: 'insensitive' } } } },
    ];
  }

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: userInclude,
      orderBy: [{ pilotProfile: { fullName: 'asc' } }, { login: 'asc' }],
      skip: offset,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items,
    total,
    limit,
    offset,
  };
}

export async function createUser(body) {
  assertPlainObject(body);
  assertKnownKeys(body, createUserFields);

  const login = requiredString(body.login, 'login');
  const email = requiredString(body.email, 'email').toLowerCase();
  const temporaryPassword = normalizeTemporaryPassword(body.temporaryPassword);
  const roleCode = normalizeRoleCode(body.roleCode);
  const passwordHash = await hashPassword(temporaryPassword);
  const profileData = normalizeProfileCreateData(body);

  try {
    return await getPrismaClient().user.create({
      data: {
        login,
        email,
        passwordHash,
        mustChangePassword: true,
        passwordChangedAt: null,
        roleCode,
        blocked: false,
        pilotProfile: {
          create: profileData,
        },
      },
      include: userInclude,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw badRequest('login or email already exists.');
    }

    throw error;
  }
}

export async function updateUser(id, body) {
  assertPlainObject(body);
  assertKnownKeys(body, ['login', 'email']);

  const data = {};

  if (body.login !== undefined) {
    data.login = requiredString(body.login, 'login');
  }

  if (body.email !== undefined) {
    data.email = requiredString(body.email, 'email').toLowerCase();
  }

  if (Object.keys(data).length === 0) {
    throw badRequest('No user fields to update.');
  }

  await ensureUserExists(id);

  try {
    return await getPrismaClient().user.update({
      where: { id },
      data,
      include: userInclude,
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw badRequest('login or email already exists.');
    }

    throw error;
  }
}

export async function updateUserRole(id, body) {
  assertPlainObject(body);
  assertKnownKeys(body, ['roleCode']);
  await ensureUserExists(id);

  return getPrismaClient().user.update({
    where: { id },
    data: {
      roleCode: normalizeRoleCode(body.roleCode),
    },
    include: userInclude,
  });
}

export async function updateUserBlocked(id, body) {
  assertPlainObject(body);
  assertKnownKeys(body, ['blocked']);
  await ensureUserExists(id);

  const blocked = optionalBoolean(body.blocked, 'blocked');

  if (blocked === undefined) {
    throw badRequest('blocked is required.');
  }

  return getPrismaClient().user.update({
    where: { id },
    data: { blocked },
    include: userInclude,
  });
}

export async function resetUserPassword(id, body) {
  assertPlainObject(body);
  assertKnownKeys(body, ['temporaryPassword']);
  await ensureUserExists(id);

  const passwordHash = await hashPassword(normalizeTemporaryPassword(body.temporaryPassword));
  const now = new Date();

  await getPrismaClient().$transaction([
    getPrismaClient().user.update({
      where: { id },
      data: {
        passwordHash,
        mustChangePassword: true,
        passwordChangedAt: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    }),
    getPrismaClient().authSession.updateMany({
      where: {
        userId: id,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    }),
  ]);

  return ensureUserExists(id);
}
