import { Router } from "express";
import { getPublicBio } from "../controllers/bio.controller";

const router = Router();

router.get("/bio/:username", getPublicBio);

export default router;
