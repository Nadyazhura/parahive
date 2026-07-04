import { getPrismaClient } from '../../db/prisma.js';
import { forbidden, notFound } from '../auth/auth.errors.js';
import { PERMISSIONS } from '../permissions/permissions.constants.js';
import { hasPermission } from '../permissions/permissions.service.js';
import {
  normalizeRankCode,
  normalizeRoleCode,
  normalizeStatusCode,
  parseBooleanQuery,
  parsePagination,
  requiredString,
} from '../users/users.validation.js';

const pilotInclude = {
  pilotProfile: true,
};

function canReadAll(roleCode) {
  return hasPermission(roleCode, PERMISSIONS.PILOTS_READ_ALL);
}

function canReadPublic(roleCode) {
  return hasPermission(roleCode, PERMISSIONS.PILOTS_READ_PUBLIC);
}

function canReadOwnProfile(roleCode) {
  return hasPermission(roleCode, PERMISSIONS.PILOT_PROFILES_READ_OWN);
}

function buildFilters(query, { extended }) {
  const where = {};

  if (query.statusCode) {
    where.pilotProfile = {
      is: {
        ...(where.pilotProfile?.is ?? {}),
        statusCode: normalizeStatusCode(query.statusCode),
      },
    };
  }

  if (query.rankCode) {
    where.pilotProfile = {
      is: {
        ...(where.pilotProfile?.is ?? {}),
        rankCode: normalizeRankCode(query.rankCode),
      },
    };
  }

  if (extended && query.roleCode) {
    where.roleCode = normalizeRoleCode(query.roleCode);
  }

  if (extended) {
    const blocked = parseBooleanQuery(query.blocked, 'blocked');

    if (blocked !== undefined) {
      where.blocked = blocked;
    }
  }

  if (query.search) {
    const search = requiredString(query.search, 'search', { max: 255 });
    const publicSearch = [{ pilotProfile: { is: { fullName: { contains: search, mode: 'insensitive' } } } }];

    where.OR = extended
      ? [
          ...publicSearch,
          { login: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ]
      : publicSearch;
  }

  return where;
}

export async function listPilots(query, auth) {
  const prisma = getPrismaClient();
  const extended = canReadAll(auth.roleCode);
  const { limit, offset } = parsePagination(query);
  const where = buildFilters(query, { extended });

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      include: pilotInclude,
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
    extended,
  };
}

export async function getPilotById(id, auth) {
  const user = await getPrismaClient().user.findUnique({
    where: { id },
    include: pilotInclude,
  });

  if (!user) {
    throw notFound('Pilot not found.');
  }

  if (user.id === auth.userId) {
    if (!canReadOwnProfile(auth.roleCode)) {
      throw forbidden('Permission denied.');
    }

    return {
      user,
      view: 'full',
    };
  }

  if (canReadAll(auth.roleCode)) {
    return {
      user,
      view: 'full',
    };
  }

  if (canReadPublic(auth.roleCode)) {
    return {
      user,
      view: 'public',
    };
  }

  throw forbidden('Permission denied.');
}
