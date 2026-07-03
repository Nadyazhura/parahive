import { env } from '../../config/env.js';
import { getPrismaClient } from '../../db/prisma.js';
import { badRequest, forbidden, tooManyRequests, unauthorized } from './auth.errors.js';
import { hashPassword, isPasswordAcceptable, verifyPassword } from './password.js';
import { createAccessToken, createRefreshToken, getRefreshTokenExpiresAt, hashRefreshToken } from './tokens.js';

const userInclude = {
  role: true,
  pilotProfile: true,
};

function normalizeIdentifier(identifier) {
  return identifier.trim();
}

function isLocked(user, now = new Date()) {
  return user.lockedUntil && user.lockedUntil > now;
}

function getLockUntil(now = new Date()) {
  return new Date(now.getTime() + env.loginLockMinutes * 60 * 1000);
}

async function registerFailedLogin(user) {
  const nextFailedAttempts = user.failedLoginAttempts + 1;
  const shouldLock = nextFailedAttempts >= env.loginMaxFailedAttempts;

  await getPrismaClient().user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: nextFailedAttempts,
      lockedUntil: shouldLock ? getLockUntil() : null,
    },
  });
}

async function createSessionForUser(user, req) {
  const prisma = getPrismaClient();
  const refreshToken = createRefreshToken();
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const session = await prisma.authSession.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      userAgent: req.get('user-agent') ?? null,
      ipAddress: req.ip ?? null,
      expiresAt: getRefreshTokenExpiresAt(),
    },
  });

  const accessToken = createAccessToken({
    userId: user.id,
    sessionId: session.id,
    roleCode: user.roleCode,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function login({ loginOrEmail, password }, req) {
  if (typeof loginOrEmail !== 'string' || typeof password !== 'string' || !loginOrEmail.trim() || !password) {
    throw badRequest('loginOrEmail and password are required.');
  }

  const prisma = getPrismaClient();
  const identifier = normalizeIdentifier(loginOrEmail);
  const identifierEmail = identifier.toLowerCase();
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ login: identifier }, { email: identifierEmail }],
    },
    include: userInclude,
  });

  if (!user) {
    throw unauthorized('Invalid login or password.');
  }

  if (user.blocked) {
    throw forbidden('User is blocked.');
  }

  if (isLocked(user)) {
    throw tooManyRequests('Too many failed login attempts. Try again later.');
  }

  const passwordIsValid = await verifyPassword(user.passwordHash, password);

  if (!passwordIsValid) {
    await registerFailedLogin(user);
    throw unauthorized('Invalid login or password.');
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
    include: userInclude,
  });

  const tokens = await createSessionForUser(updatedUser, req);

  return {
    user: updatedUser,
    ...tokens,
  };
}

export async function refresh({ refreshToken }) {
  if (typeof refreshToken !== 'string' || !refreshToken) {
    throw badRequest('refreshToken is required.');
  }

  const prisma = getPrismaClient();
  const refreshTokenHash = hashRefreshToken(refreshToken);
  const session = await prisma.authSession.findUnique({
    where: { refreshTokenHash },
    include: {
      user: {
        include: userInclude,
      },
    },
  });

  if (!session || session.revokedAt || session.expiresAt <= new Date()) {
    throw unauthorized('Invalid refresh token.');
  }

  if (session.user.blocked) {
    throw forbidden('User is blocked.');
  }

  const accessToken = createAccessToken({
    userId: session.user.id,
    sessionId: session.id,
    roleCode: session.user.roleCode,
  });

  return {
    user: session.user,
    accessToken,
  };
}

export async function logout({ userId, sessionId }) {
  const prisma = getPrismaClient();

  await prisma.authSession.updateMany({
    where: {
      id: sessionId,
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function getMe(userId) {
  const user = await getPrismaClient().user.findUnique({
    where: { id: userId },
    include: userInclude,
  });

  if (!user) {
    throw unauthorized('User not found.');
  }

  return user;
}

export async function changePassword({ userId, currentPassword, newPassword }) {
  if (!currentPassword || !newPassword) {
    throw badRequest('currentPassword and newPassword are required.');
  }

  if (!isPasswordAcceptable(newPassword)) {
    throw badRequest('newPassword must be at least 8 characters long.');
  }

  const prisma = getPrismaClient();
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw unauthorized('User not found.');
  }

  const currentPasswordIsValid = await verifyPassword(user.passwordHash, currentPassword);

  if (!currentPasswordIsValid) {
    throw unauthorized('Invalid current password.');
  }

  const passwordHash = await hashPassword(newPassword);
  const now = new Date();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        mustChangePassword: false,
        passwordChangedAt: now,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    }),
    prisma.authSession.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: now,
      },
    }),
  ]);
}
