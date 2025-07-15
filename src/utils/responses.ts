
import { Response } from "express";

export const success = ( res: Response, status: number, data: object ) =>{
  res.status(status).json({
    success: true,
    ...data
  });
}

export const error = (res: Response, status: number, message: string, errors?: any) => {
  res.status(status).json({
    success: false,
    message: status === 500 ? 'Internal Server Error' : message,
    ...(errors && { errors })   // propiedad computada -- se determina en tiempo de ejecucion, si tiene contenido sale sino no
  });
}
