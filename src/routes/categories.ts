import { Router } from 'express';
import { getCategories } from '../services/categoryService.js';
import { TRANSACTION_TYPE } from '../constants/transaction.js';
import { catchErrors } from '../utils/catchErrors.js';
import { simpleSuccess } from '../utils/responses.js';

import { InvalidCredentialsError401 } from '../errors/InvalidCredentialsError401.js';
import { BadRequestError400 } from '../errors/BadRequestError400.js';

const router = Router();

//Obtener todas las categorias
router.get('/', catchErrors(async (req, res) => {
  if (!req.user) {
    throw new InvalidCredentialsError401('No autorizado');
  }
  const { type } = req.query

  if (type != null && (type !== TRANSACTION_TYPE.INFLOW && type !== TRANSACTION_TYPE.OUTFLOW)) {
    throw new BadRequestError400('El tipo de categoria no es valido');
  }

  const categories = await getCategories(type);
  simpleSuccess(res, 200, categories);
}));



export default router; 