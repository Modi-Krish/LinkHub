import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodError = error as z.ZodError;
        const issues = zodError.issues || [];
        const message = issues.map((e: any) => `${e.path.join(".")} - ${e.message}`).join(", ");
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: message.replace(/^body\./, ""),
          },
        });
      }
      return next(error);
    }
  };
};
