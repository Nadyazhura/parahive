import { asyncHandler } from '../../utils/async-handler.js';
import { presentFullPilot } from '../pilots/pilots.presenter.js';
import { presentMyProfile } from './profile.presenter.js';
import * as profileService from './profile.service.js';

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await profileService.getOwnProfile(req.auth.userId);

  return res.json(presentMyProfile(user));
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await profileService.updateOwnProfile(req.auth.userId, req.body);

  return res.json(presentMyProfile(user));
});

export const updatePilotProfile = asyncHandler(async (req, res) => {
  const user = await profileService.updatePilotProfile(req.params.id, req.body, req.auth);

  return res.json({
    pilot: presentFullPilot(user),
  });
});
