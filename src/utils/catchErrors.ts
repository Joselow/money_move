import { NextFunction, Request, Response } from "express";

export const catchErrors = (fn: (req: Request, res: Response) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {    
    fn(req, res).catch((err: unknown) => {    
      next(err)
    });
  };
};

export const catchMiddlewareErrors = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (err: unknown) {
      next(err)
    }
  };
};