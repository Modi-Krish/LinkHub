import { Router } from "express";
import * as bioController from "../controllers/bio.controller";
import { protect } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  updateBioProfileSchema,
  addSocialLinkSchema,
  reorderSocialLinksSchema,
} from "../validators/bio.validator";

const router = Router();

router.use(protect);

router.get("/profile", bioController.getProfile);
router.put("/profile", validate(updateBioProfileSchema), bioController.updateProfile);

router.post("/links", validate(addSocialLinkSchema), bioController.addSocialLink);
router.put("/links/:id", validate(addSocialLinkSchema), bioController.updateSocialLink);
router.delete("/links/:id", bioController.deleteSocialLink);
router.patch("/links/reorder", validate(reorderSocialLinksSchema), bioController.reorderSocialLinks);

export default router;
