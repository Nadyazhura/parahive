import { asyncHandler } from '../../utils/async-handler.js';
import { presentExtendedPilot, presentFullPilot, presentPublicPilot } from './pilots.presenter.js';
import * as pilotsService from './pilots.service.js';

export const listPilots = asyncHandler(async (req, res) => {
  const result = await pilotsService.listPilots(req.query, req.auth);
  const presenter = result.extended ? presentExtendedPilot : presentPublicPilot;

  return res.json({
    items: result.items.map(presenter),
    total: result.total,
    limit: result.limit,
    offset: result.offset,
  });
});

export const getPilot = asyncHandler(async (req, res) => {
  const result = await pilotsService.getPilotById(req.params.id, req.auth);
  const pilot = result.view === 'public' ? presentPublicPilot(result.user) : presentFullPilot(result.user);

  return res.json({ pilot });
});
