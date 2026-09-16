import { Request, Response, NextFunction } from "express";
import * as bioService from "../services/bio.service";

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await bioService.getProfile(req.user!.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await bioService.updateProfile(req.user!.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addSocialLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await bioService.addSocialLink(req.user!.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateSocialLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await bioService.updateSocialLink(req.user!.id, req.params.id as string, req.body);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteSocialLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await bioService.deleteSocialLink(req.user!.id, req.params.id as string);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const reorderSocialLinks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await bioService.reorderSocialLinks(req.user!.id, req.body.orderedIds);
    res.status(200).json({ success: true, data: { message: "Reordered successfully" } });
  } catch (error) {
    next(error);
  }
};

export const getPublicBio = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await bioService.getPublicProfile(req.params.username as string);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
