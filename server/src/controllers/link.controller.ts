import { Request, Response, NextFunction } from "express";
import * as linkService from "../services/link.service";
import { env } from "../config/env";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { destinationUrl, customSlug } = req.body;
    const userId = req.user!.id;

    const link = await linkService.createLink(userId, destinationUrl, customSlug);
    
    res.status(201).json({
      success: true,
      data: {
        id: link._id,
        shortCode: link.shortCode,
        shortUrl: `${env.CLIENT_URL}/r/${link.shortCode}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;

    const result = await linkService.getLinks(userId, page, limit, search);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const link = await linkService.getLinkById(userId, id as string);

    res.status(200).json({
      success: true,
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    await linkService.deleteLink(userId, id as string);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
