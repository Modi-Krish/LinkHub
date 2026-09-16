import { Router } from "express";
import * as linkController from "../controllers/link.controller";
import { validate } from "../middleware/validate.middleware";
import { protect } from "../middleware/auth.middleware";
import { linkCreateLimiter } from "../middleware/rateLimit.middleware";
import { createLinkSchema } from "../validators/link.validator";

const router = Router();

router.use(protect); // All link routes are protected

router.post("/", linkCreateLimiter, validate(createLinkSchema), linkController.create);
router.get("/", linkController.list);
router.get("/:id", linkController.get);
router.delete("/:id", linkController.remove);

export default router;
