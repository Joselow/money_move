import { Request, Response, NextFunction } from 'express';
import { error } from '../utils/responses.js';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log error en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }
  console.log(process.env.NODE_ENV);

  let errorData: any = err;

  if (process.env.NODE_ENV === 'development') {
    errorData = { stack:err.stack }
  }
  
  error(res, statusCode, message, errorData);
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as AppError;
  error.statusCode = 404;
  next(error);
};