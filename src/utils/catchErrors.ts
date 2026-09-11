import { NextFunction, Request, Response } from "express";


/**
 * CATCH ERRORS (Para Controladores)
 * --------------------------------
 * OBJETIVO: Capturar errores en rutas finales para evitar el uso de try/catch manual.
 * RECIBE: Una función asíncrona con (req, res).
 * RETORNA: Una función que ejecuta .catch(next) automáticamente.
 */
export const catchErrors = (fn: (req: Request, res: Response) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {    
    fn(req, res).catch((err: unknown) => {    
      next(err)
    });
  };
};

/**
 * CATCH MIDDLEWARE ERRORS (Para Middlewares)
 * -----------------------------------------
 * OBJETIVO: Capturar errores en procesos intermedios (ej. Auth, Validaciones).
 * RECIBE: Una función asíncrona con (req, res, next).
 * RETORNA: Una función con bloque try/catch y await.
 * DIFERENCIA: Recibe 'next' para permitir que el flujo continúe al siguiente paso si todo está OK.
 */
export const catchMiddlewareErrors = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next) // Espera a que el middleware termine o llame a next()
    } catch (err: unknown) {
      next(err)
    }
  };
};