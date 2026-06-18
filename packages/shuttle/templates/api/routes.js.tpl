import { Router, asyncHandler } from "@domount/shuttle/server";
import { store } from "#server/store.js";
import { create{{Feature}}Service } from "#server/services/{{featureKebab}}.service.js";

const router = Router();
const service = create{{Feature}}Service(store);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await service.list());
  }),
);

export default router;
