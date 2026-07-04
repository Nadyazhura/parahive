import { ROLE_CODES } from '../permissions/permissions.map.js';
import { badRequest } from '../auth/auth.errors.js';
import { isPasswordAcceptable } from '../auth/password.js';

export const ROLE_CODE_VALUES = Object.freeze(Object.values(ROLE_CODES));
export const STATUS_CODE_VALUES = Object.freeze(['student', 'active', 'inactive']);
export const RANK_CODE_VALUES = Object.freeze(['none', 'third_rank', 'second_rank', 'first_rank', 'above_first']);

export function assertPlainObject(value, label = 'body') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw badRequest(`${label} must be an object.`);
  }
}

export function assertKnownKeys(body, allowedKeys, label = 'body') {
  const unknownKeys = Object.keys(body).filter((key) => !allowedKeys.includes(key));

  if (unknownKeys.length > 0) {
    throw badRequest(`Unknown ${label} fields: ${unknownKeys.join(', ')}.`);
  }
}

export function assertNoForbiddenKeys(body, forbiddenKeys, label = 'body') {
  const presentForbiddenKeys = Object.keys(body).filter((key) => forbiddenKeys.includes(key));

  if (presentForbiddenKeys.length > 0) {
    throw badRequest(`Forbidden ${label} fields: ${presentForbiddenKeys.join(', ')}.`);
  }
}

export function optionalString(value, fieldName, { min = 0, max = 255 } = {}) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    throw badRequest(`${fieldName} must be a string.`);
  }

  const trimmed = value.trim();

  if (trimmed.length < min) {
    throw badRequest(`${fieldName} is too short.`);
  }

  if (trimmed.length > max) {
    throw badRequest(`${fieldName} is too long.`);
  }

  return trimmed;
}

export function requiredString(value, fieldName, options = {}) {
  const result = optionalString(value, fieldName, { min: 1, ...options });

  if (result === undefined || result === null) {
    throw badRequest(`${fieldName} is required.`);
  }

  return result;
}

export function optionalBoolean(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'boolean') {
    throw badRequest(`${fieldName} must be a boolean.`);
  }

  return value;
}

export function optionalDate(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === '') {
    return null;
  }

  if (typeof value !== 'string') {
    throw badRequest(`${fieldName} must be an ISO date string.`);
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) {
    throw badRequest(`${fieldName} must be a valid date.`);
  }

  return date;
}

export function assertEnum(value, values, fieldName) {
  if (!values.includes(value)) {
    throw badRequest(`${fieldName} is invalid.`);
  }
}

export function normalizeRoleCode(roleCode = ROLE_CODES.PILOT) {
  const value = requiredString(roleCode, 'roleCode', { max: 32 });
  assertEnum(value, ROLE_CODE_VALUES, 'roleCode');
  return value;
}

export function normalizeStatusCode(statusCode = 'active') {
  const value = requiredString(statusCode, 'statusCode', { max: 32 });
  assertEnum(value, STATUS_CODE_VALUES, 'statusCode');
  return value;
}

export function normalizeRankCode(rankCode = 'none') {
  const value = requiredString(rankCode, 'rankCode', { max: 32 });
  assertEnum(value, RANK_CODE_VALUES, 'rankCode');
  return value;
}

export function normalizeTemporaryPassword(value) {
  const password = requiredString(value, 'temporaryPassword', { min: 8, max: 256 });

  if (!isPasswordAcceptable(password)) {
    throw badRequest('temporaryPassword must be at least 8 characters long.');
  }

  return password;
}

export function parsePagination(query) {
  const rawLimit = Number.parseInt(query.limit ?? '50', 10);
  const rawOffset = Number.parseInt(query.offset ?? '0', 10);

  if (!Number.isInteger(rawLimit) || rawLimit < 1) {
    throw badRequest('limit must be a positive integer.');
  }

  if (!Number.isInteger(rawOffset) || rawOffset < 0) {
    throw badRequest('offset must be a non-negative integer.');
  }

  return {
    limit: Math.min(rawLimit, 100),
    offset: rawOffset,
  };
}

export function parseBooleanQuery(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw badRequest(`${fieldName} must be true or false.`);
}
