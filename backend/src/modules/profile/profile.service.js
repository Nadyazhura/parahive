import { getPrismaClient } from '../../db/prisma.js';
import { badRequest, notFound } from '../auth/auth.errors.js';
import {
  assertKnownKeys,
  assertNoForbiddenKeys,
  assertPlainObject,
  normalizeRankCode,
  normalizeStatusCode,
  optionalDate,
  optionalString,
  requiredString,
} from '../users/users.validation.js';
import { ROLE_CODES } from '../permissions/permissions.map.js';

const userInclude = {
  pilotProfile: true,
};

const ownAllowedFields = [
  'fullName',
  'birthDate',
  'phone',
  'email',
  'telegram',
  'address',
  'emergencyContactName',
  'emergencyContactPhone',
];

const ownForbiddenFields = [
  'role',
  'roleCode',
  'blocked',
  'pilotStatus',
  'pilotStatusCode',
  'statusCode',
  'rank',
  'rankCode',
  'parapro',
  'serviceNotes',
  'password',
  'passwordHash',
  'mustChangePassword',
];

const allAllowedFields = [
  'fullName',
  'birthDate',
  'latinFullName',
  'phone',
  'telegram',
  'address',
  'emergencyContactName',
  'emergencyContactPhone',
  'pilotStatusCode',
  'statusCode',
  'rankCode',
  'parapro',
  'serviceNotes',
];

const flightManagerAllowedFields = ['pilotStatusCode', 'statusCode', 'rankCode', 'parapro', 'serviceNotes'];

function isUniqueConstraintError(error) {
  return error?.code === 'P2002';
}

function profileDataFromBody(body, { includeManagedFields }) {
  const data = {};

  if (body.fullName !== undefined) data.fullName = optionalString(body.fullName, 'fullName');
  if (body.birthDate !== undefined) data.birthDate = optionalDate(body.birthDate, 'birthDate');
  if (body.latinFullName !== undefined) data.latinFullName = optionalString(body.latinFullName, 'latinFullName');
  if (body.phone !== undefined) data.phone = optionalString(body.phone, 'phone', { max: 64 });
  if (body.telegram !== undefined) data.telegram = optionalString(body.telegram, 'telegram', { max: 64 });
  if (body.address !== undefined) data.address = optionalString(body.address, 'address', { max: 4096 });
  if (body.emergencyContactName !== undefined) data.emergencyContactName = optionalString(body.emergencyContactName, 'emergencyContactName');
  if (body.emergencyContactPhone !== undefined) {
    data.emergencyContactPhone = optionalString(body.emergencyContactPhone, 'emergencyContactPhone', { max: 64 });
  }

  if (includeManagedFields) {
    const statusCode = body.statusCode ?? body.pilotStatusCode;

    if (statusCode !== undefined) data.statusCode = normalizeStatusCode(statusCode);
    if (body.rankCode !== undefined) data.rankCode = normalizeRankCode(body.rankCode);
    if (body.parapro !== undefined) data.parapro = optionalString(body.parapro, 'parapro', { max: 32 });
    if (body.serviceNotes !== undefined) data.serviceNotes = optionalString(body.serviceNotes, 'serviceNotes', { max: 4096 });
  }

  return data;
}

async function ensureUserWithProfile(id) {
  const user = await getPrismaClient().user.findUnique({
    where: { id },
    include: userInclude,
  });

  if (!user) {
    throw notFound('User not found.');
  }

  if (!user.pilotProfile) {
    throw notFound('Pilot profile not found.');
  }

  return user;
}

export async function getOwnProfile(userId) {
  return ensureUserWithProfile(userId);
}

export async function updateOwnProfile(userId, body) {
  assertPlainObject(body);
  assertNoForbiddenKeys(body, ownForbiddenFields);
  assertKnownKeys(body, ownAllowedFields);

  const userData = {};
  const profileData = profileDataFromBody(body, { includeManagedFields: false });

  if (body.email !== undefined) {
    userData.email = requiredString(body.email, 'email').toLowerCase();
  }

  if (Object.keys(userData).length === 0 && Object.keys(profileData).length === 0) {
    throw badRequest('No profile fields to update.');
  }

  await ensureUserWithProfile(userId);

  try {
    await getPrismaClient().$transaction([
      Object.keys(userData).length > 0
        ? getPrismaClient().user.update({
            where: { id: userId },
            data: userData,
          })
        : getPrismaClient().user.findUnique({ where: { id: userId } }),
      Object.keys(profileData).length > 0
        ? getPrismaClient().pilotProfile.update({
            where: { userId },
            data: profileData,
          })
        : getPrismaClient().pilotProfile.findUnique({ where: { userId } }),
    ]);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw badRequest('email already exists.');
    }

    throw error;
  }

  return ensureUserWithProfile(userId);
}

export async function updatePilotProfile(userId, body, auth) {
  assertPlainObject(body);
  assertKnownKeys(body, auth?.roleCode === ROLE_CODES.FLIGHTMANAGER ? flightManagerAllowedFields : allAllowedFields);

  const profileData = profileDataFromBody(body, { includeManagedFields: true });

  if (Object.keys(profileData).length === 0) {
    throw badRequest('No profile fields to update.');
  }

  await ensureUserWithProfile(userId);

  await getPrismaClient().pilotProfile.update({
    where: { userId },
    data: profileData,
  });

  return ensureUserWithProfile(userId);
}
