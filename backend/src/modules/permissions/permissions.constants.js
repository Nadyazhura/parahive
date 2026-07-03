export const PERMISSIONS = Object.freeze({
  USERS_READ_ALL: 'users:read_all',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_BLOCK: 'users:block',
  ROLES_ASSIGN: 'roles:assign',
  PILOTS_READ_PUBLIC: 'pilots:read_public',
  PILOTS_READ_ALL: 'pilots:read_all',
  PILOT_PROFILES_READ_OWN: 'pilot_profiles:read_own',
  PILOT_PROFILES_UPDATE_OWN: 'pilot_profiles:update_own',
  PILOT_PROFILES_READ_ALL: 'pilot_profiles:read_all',
  PILOT_PROFILES_UPDATE_ALL: 'pilot_profiles:update_all',
  AUTH_CHANGE_OWN_PASSWORD: 'auth:change_own_password',
  AUTH_RESET_USER_PASSWORD: 'auth:reset_user_password',
  AUTH_LOGOUT_ALL_SESSIONS: 'auth:logout_all_sessions',
});

export const ALL_PERMISSIONS = Object.freeze(Object.values(PERMISSIONS));
