import { Router } from 'express';

import { requireAuth } from '../auth/require-auth.js';
import { PERMISSIONS } from '../permissions/permissions.constants.js';
import { requirePermission } from '../permissions/require-permission.js';
import { updatePilotProfile } from '../profile/profile.controller.js';
import * as pilotsController from './pilots.controller.js';

export const pilotsRouter = Router();

pilotsRouter.get('/', requireAuth, requirePermission(PERMISSIONS.PILOTS_READ_PUBLIC), pilotsController.listPilots);
pilotsRouter.patch(
  '/:id/profile',
  requireAuth,
  requirePermission(PERMISSIONS.PILOT_PROFILES_UPDATE_ALL),
  updatePilotProfile,
);
pilotsRouter.get('/:id', requireAuth, pilotsController.getPilot);

export default pilotsRouter;
