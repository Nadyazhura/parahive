import { forbidden, unauthorized } from '../auth/auth.errors.js';
import { hasPermission } from './permissions.service.js';

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.auth?.roleCode) {
      return next(unauthorized('Authentication is required.'));
    }

    if (!hasPermission(req.auth.roleCode, permission)) {
      return next(forbidden('Permission denied.'));
    }

    return next();
  };
}
