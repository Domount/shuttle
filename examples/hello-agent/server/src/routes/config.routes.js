import { Router } from "express";
import { asyncHandler } from "@domount/shuttle/server";
import { getConfig, updateConfigSettings } from "#server/services/config.service.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await getConfig());
  }),
);

router.patch(
  "/settings",
  asyncHandler(async (req, res) => {
    const { agent } = req.body || {};
    const patch = {};
    if (agent) patch.agent = agent;
    res.json(await updateConfigSettings(patch));
  }),
);

export default router;
