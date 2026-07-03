import { presentUser } from './auth.presenter.js';
import * as authService from './auth.service.js';

function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, req);

  return res.json({
    user: presentUser(result.user),
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body);

  return res.json({
    user: presentUser(result.user),
    accessToken: result.accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.auth);

  return res.status(204).send();
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.auth.userId);

  return res.json({
    user: presentUser(user),
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword({
    userId: req.auth.userId,
    currentPassword: req.body.currentPassword,
    newPassword: req.body.newPassword,
  });

  return res.status(204).send();
});
