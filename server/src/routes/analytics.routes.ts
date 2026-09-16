import { Router } from "express";
import * as analyticsController from "../controllers/analytics.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.get("/summary", analyticsController.getSummary);
router.get("/:id/analytics", analyticsController.getLinkAnalytics);

export default router;
