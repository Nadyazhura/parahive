import crypto from 'node:crypto';

import jwt from 'jsonwebtoken';

import { env } from '../../config/env.js';

function getAccessTokenSecret() {
  if (!env.accessTokenSecret) {
    throw new Error('ACCESS_TOKEN_SECRET is not configured.');
  }

  return env.accessTokenSecret;
}

export function createAccessToken({ userId, sessionId, roleCode }) {
  return jwt.sign(
    {
      roleCode,
      sessionId,
    },
    getAccessTokenSecret(),
    {
      expiresIn: env.accessTokenExpiresIn,
      subject: userId,
    },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getAccessTokenSecret());
}

export function createRefreshToken() {
  return crypto.randomBytes(48).toString('base64url');
}

export function hashRefreshToken(refreshToken) {
  return crypto.createHash('sha256').update(refreshToken).digest('hex');
}

export function getRefreshTokenExpiresAt(now = new Date()) {
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + env.refreshTokenExpiresDays);
  return expiresAt;
}
