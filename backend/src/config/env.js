import 'dotenv/config';

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number.parseInt(process.env.PORT ?? '4000', 10),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL ?? '',
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? '',
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m',
  refreshTokenExpiresDays: Number.parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS ?? '30', 10),
  loginMaxFailedAttempts: Number.parseInt(process.env.LOGIN_MAX_FAILED_ATTEMPTS ?? '5', 10),
  loginLockMinutes: Number.parseInt(process.env.LOGIN_LOCK_MINUTES ?? '15', 10),
};
