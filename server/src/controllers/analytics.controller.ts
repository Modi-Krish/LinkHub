import { Request, Response, NextFunction } from "express";
import * as analyticsService from "../services/analytics.service";
import { Link } from "../models/Link";
import { AppError } from "../utils/AppError";
import mongoose from "mongoose";

import { Click } from "../models/Click";

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;

    const totalLinks = await Link.countDocuments({ userId });
    
    // Total clicks across all links owned by this user
    const userLinks = await Link.find({ userId }).select("_id");
    const linkIds = userLinks.map(l => l._id);
    const totalClicks = await Click.countDocuments({ linkId: { $in: linkIds } });

    res.status(200).json({
      success: true,
      data: {
        totalLinks,
        totalClicks,
        bioViews: 0 // Mock bio views for now since there's no views collection yet
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getLinkAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const range = (req.query.range as string) || "30d";

    // Enforce ownership
    const link = await Link.findOne({ _id: id as string, userId });
    if (!link) {
      throw new AppError(404, "NOT_FOUND", "Link not found or unauthorized");
    }

    const analytics = await analyticsService.getAnalytics(
      new mongoose.Types.ObjectId(id as string) as any, 
      range
    );

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};
