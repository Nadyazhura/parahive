import { asyncHandler } from '../../utils/async-handler.js';
import { presentManagedUser, presentManagedUsers } from './users.presenter.js';
import * as usersService from './users.service.js';

export const listUsers = asyncHandler(async (req, res) => {
  const result = await usersService.listUsers(req.query);

  return res.json({
    items: presentManagedUsers(result.items),
    total: result.total,
    limit: result.limit,
    offset: result.offset,
  });
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await usersService.createUser(req.body);

  return res.status(201).json({
    user: presentManagedUser(user),
  });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await usersService.updateUser(req.params.id, req.body);

  return res.json({
    user: presentManagedUser(user),
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await usersService.updateUserRole(req.params.id, req.body);

  return res.json({
    user: presentManagedUser(user),
  });
});

export const updateUserBlocked = asyncHandler(async (req, res) => {
  const user = await usersService.updateUserBlocked(req.params.id, req.body);

  return res.json({
    user: presentManagedUser(user),
  });
});

export const resetUserPassword = asyncHandler(async (req, res) => {
  const user = await usersService.resetUserPassword(req.params.id, req.body);

  return res.json({
    user: presentManagedUser(user),
  });
});
