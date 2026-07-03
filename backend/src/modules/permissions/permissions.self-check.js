import assert from 'node:assert/strict';

import { ALL_PERMISSIONS, PERMISSIONS } from './permissions.constants.js';
import { ROLE_CODES } from './permissions.map.js';
import { getPermissionsForRole, hasPermission } from './permissions.service.js';

assert.deepEqual(getPermissionsForRole(ROLE_CODES.SYSADMIN), ALL_PERMISSIONS);
assert.equal(hasPermission(ROLE_CODES.SYSADMIN, PERMISSIONS.USERS_BLOCK), true);
assert.equal(hasPermission(ROLE_CODES.CLUBHEAD, PERMISSIONS.ROLES_ASSIGN), true);
assert.equal(hasPermission(ROLE_CODES.FLIGHTMANAGER, PERMISSIONS.USERS_CREATE), false);
assert.equal(hasPermission(ROLE_CODES.PILOT, PERMISSIONS.PILOTS_READ_ALL), false);
assert.deepEqual(getPermissionsForRole('UNKNOWN_ROLE'), []);
assert.equal(hasPermission('UNKNOWN_ROLE', PERMISSIONS.PILOTS_READ_PUBLIC), false);
assert.equal(hasPermission(ROLE_CODES.SYSADMIN, 'unknown:permission'), false);
