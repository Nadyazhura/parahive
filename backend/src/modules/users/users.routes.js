import { Router } from 'express';

import { requireAuth } from '../auth/require-auth.js';
import { PERMISSIONS } from '../permissions/permissions.constants.js';
import { requirePermission } from '../permissions/require-permission.js';
import * as usersController from './users.controller.js';

export const usersRouter = Router();

usersRouter.get('/', requireAuth, requirePermission(PERMISSIONS.USERS_READ_ALL), usersController.listUsers);
usersRouter.post('/', requireAuth, requirePermission(PERMISSIONS.USERS_CREATE), usersController.createUser);
usersRouter.patch('/:id', requireAuth, requirePermission(PERMISSIONS.USERS_UPDATE), usersController.updateUser);
usersRouter.patch('/:id/role', requireAuth, requirePermission(PERMISSIONS.ROLES_ASSIGN), usersController.updateUserRole);
usersRouter.patch('/:id/block', requireAuth, requirePermission(PERMISSIONS.USERS_BLOCK), usersController.updateUserBlocked);
usersRouter.post('/:id/reset-password', requireAuth, requirePermission(PERMISSIONS.AUTH_RESET_USER_PASSWORD), usersController.resetUserPassword);

export default usersRouter;
