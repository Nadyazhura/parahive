import { Router } from 'express';

import { requireAuth } from '../auth/require-auth.js';
import { PERMISSIONS } from '../permissions/permissions.constants.js';
import { requirePermission } from '../permissions/require-permission.js';
import * as profileController from './profile.controller.js';

export const profileRouter = Router();

profileRouter.get('/me', requireAuth, requirePermission(PERMISSIONS.PILOT_PROFILES_READ_OWN), profileController.getMyProfile);
profileRouter.patch('/me', requireAuth, requirePermission(PERMISSIONS.PILOT_PROFILES_UPDATE_OWN), profileController.updateMyProfile);

export default profileRouter;
