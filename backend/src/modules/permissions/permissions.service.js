import { ALL_PERMISSIONS } from './permissions.constants.js';
import { ROLE_CODES, ROLE_PERMISSIONS } from './permissions.map.js';

const knownPermissions = new Set(ALL_PERMISSIONS);

export function getPermissionsForRole(roleCode) {
  if (roleCode === ROLE_CODES.SYSADMIN) {
    return [...ALL_PERMISSIONS];
  }

  return [...(ROLE_PERMISSIONS[roleCode] ?? [])];
}

export function hasPermission(roleCode, permission) {
  if (!knownPermissions.has(permission)) {
    return false;
  }

  return getPermissionsForRole(roleCode).includes(permission);
}
