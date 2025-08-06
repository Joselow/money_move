import { Router } from 'express';
import { getAccountsByUserId, getAccountById, deleteAccount, createAccount } from '../services/accountService.js';

import { catchErrors } from '../utils/catchErrors.js';
import { success, simpleSuccess } from '../utils/responses.js';

import { InvalidCredentialsError401 } from '../errors/InvalidCredentialsError401.js';
import { BadRequestError400 } from '../errors/BadRequestError400.js';
import { NotFoundError404 } from '../errors/NotFoundError404.js';

const router = Router();

// GET /accounts/user/:userId - Obtener todas las cuentas de un usuario
router.get('/', catchErrors(async (req, res) => {
  if (!req.user) {
    throw new InvalidCredentialsError401('No autorizado');
  }
  const userId = parseInt(req.user.id);
  if (isNaN(userId)) {
    throw new BadRequestError400('ID de usuario inválido');
  }
  const accounts = await getAccountsByUserId(userId);
  simpleSuccess(res, 200, accounts);
}));

// GET /accounts/:id - Obtener una cuenta por ID
router.get('/:id', catchErrors(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError400('ID de cuenta inválido');
  }
  const account = await getAccountById(id);
  if (!account) {
    throw new NotFoundError404('Cuenta no encontrada');
  }
  success(res, 200, account);
}));

// DELETE /accounts/:id - Eliminar una cuenta
router.delete('/:id', catchErrors(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError400('ID de cuenta inválido');
  }
  const deleted = await deleteAccount(id);
  if (!deleted) {
    throw new NotFoundError404('Cuenta no encontrada');
  }
  success(res, 200, { success: true });
}));

// POST /accounts - Crear una nueva cuenta
router.post('/', catchErrors(async (req, res) => {
  if (!req.user) {
    throw new InvalidCredentialsError401('No autorizado');
  }
  const { name, currency, initialBalance, totalBalance, description } = req.body;
  if (!name || !currency) {
    throw new BadRequestError400('Faltan campos requeridos');
  }
  const newAccount = await createAccount({
    name,
    currency,
    initialBalance: initialBalance ?? '0',
    totalBalance: totalBalance ?? '0',
    description,
    userId: req.user.id,
  });
  simpleSuccess(res, 201, newAccount);
}));

export default router; 