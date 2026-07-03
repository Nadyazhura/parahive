import { getPrismaClient } from '../../db/prisma.js';
import { forbidden, unauthorized } from './auth.errors.js';
import { verifyAccessToken } from './tokens.js';

function getBearerToken(req) {
  const authorization = req.get('authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length).trim();
}

export async function requireAuth(req, res, next) {
  try {
    const token = getBearerToken(req);

    if (!token) {
      throw unauthorized('Access token is required.');
    }

    const payload = verifyAccessToken(token);

    if (!payload.sub || !payload.sessionId) {
      throw unauthorized('Invalid access token.');
    }

    const prisma = getPrismaClient();
    const session = await prisma.authSession.findFirst({
      where: {
        id: payload.sessionId,
        userId: payload.sub,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            roleCode: true,
            blocked: true,
          },
        },
      },
    });

    if (!session?.user) {
      throw unauthorized('Invalid access token.');
    }

    if (session.user.blocked) {
      throw forbidden('User is blocked.');
    }

    req.auth = {
      userId: session.user.id,
      roleCode: session.user.roleCode,
      sessionId: payload.sessionId,
    };

    return next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(unauthorized('Invalid or expired access token.'));
    }

    return next(error);
  }
}
