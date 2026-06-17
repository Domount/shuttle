import { Router } from "express";
import { asyncHandler } from "@domount/shuttle/server";
import { store } from "#server/store.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const active = {
      operatingPrinciples: await store.readMemoryFile("active/operating-principles.md"),
      currentPreferences: await store.readMemoryFile("active/current-preferences.md"),
    };
    const archive = await store.listMemoryFiles("archive");
    res.json({ active, archive });
  }),
);

export default router;
