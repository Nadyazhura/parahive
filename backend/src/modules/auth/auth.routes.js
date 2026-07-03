import { Router } from 'express';

import * as authController from './auth.controller.js';
import { requireAuth } from './require-auth.js';

export const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', requireAuth, authController.logout);
authRouter.get('/me', requireAuth, authController.me);
authRouter.post('/change-password', requireAuth, authController.changePassword);

export default authRouter;
