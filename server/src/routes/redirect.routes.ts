import { Router, Request, Response, NextFunction } from "express";
import { Link } from "../models/Link";
import { logClickEvent } from "../services/analytics.service";
import { redirectLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.get("/r/:shortCode", redirectLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { shortCode } = req.params;

    // 1. Indexed lookup
    const link = await Link.findOne({ shortCode });

    // 2. Not found or inactive
    if (!link) {
      return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Short link not found" } });
    }
    if (!link.isActive) {
      return res.status(410).json({ success: false, error: { code: "GONE", message: "Short link is no longer active" } });
    }

    // 3. Queue analytics asynchronously
    const ip = req.ip || req.connection.remoteAddress || "";
    const userAgent = req.headers["user-agent"] || "";
    const referer = req.headers.referer || "";

    // Fire and forget
    logClickEvent(link._id as any, ip, userAgent, referer);

    // 4. Return 302 Redirect
    res.redirect(302, link.destinationUrl);
  } catch (error) {
    next(error);
  }
});

export default router;
