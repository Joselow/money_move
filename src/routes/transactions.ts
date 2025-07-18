import { Router } from 'express';
import {
  getTransactionsByUserId,
  getTransactionById,
  createTransaction,
  deleteTransaction,
  getTotalTransactionsByUserId
} from '../services/transactionService.js';

import { catchErrors } from '../utils/catchErrors';
import { success, simpleSuccess } from '../utils/responses';

import { InvalidCredentialsError401 } from '../errors/InvalidCredentialsError401';
import { BadRequestError400 } from '../errors/BadRequestError400.js';
import { NotFoundError404 } from '../errors/NotFoundError404';
import { getIdSelectedAccountByUserId, getSelectedAccountByUserId } from '../services/accountService.js';
import { TRANSACTION_TYPE } from '../constants/transaction.js';

const router = Router();

// GET /transactions - Obtener todas las transacciones de un usuario
router.get('/', catchErrors(async (req, res) => {
  if (!req.user) {
    throw new InvalidCredentialsError401('No autorizado');
  }
  const userId = parseInt(req.user.id);
  if (isNaN(userId)) {
    throw new BadRequestError400('ID de usuario inválido');
  }

  const { date } = req.query;

  const transactions = await getTransactionsByUserId({ userId, date: String(date) });

  simpleSuccess(res, 200, transactions);
}));


router.get('/total', catchErrors(async (req, res) => {
const { date } = req.query;

const total = await getTotalTransactionsByUserId({ userId: req.user.id, date: String(date) });
const typeTransaction = total > 0 ? TRANSACTION_TYPE.INFLOW : TRANSACTION_TYPE.OUTFLOW;

success(res, 200, { total, typeTransaction });
}));

// GET /transactions/:id - Obtener una transacción por ID
router.get('/:id', catchErrors(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError400('ID de transacción inválido');
  }
  const transaction = await getTransactionById(id);
  if (!transaction) {
    throw new NotFoundError404('Transacción no encontrada');
  }
  success(res, 200, transaction);
}));



// DELETE /transactions/:id - Eliminar una transacción
router.delete('/:id', catchErrors(async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    throw new BadRequestError400('ID de transacción inválido');
  }
  const deleted = await deleteTransaction(id);
  if (!deleted) {
    throw new NotFoundError404('Transacción no encontrada');
  }
  success(res, 200, { success: true });
}));

// POST /transactions - Crear una nueva transacción
router.post('/', catchErrors(async (req, res) => {
  if (!req.user) {
    throw new InvalidCredentialsError401('No autorizado');
  }

  const { name, type, amount, description, categoryId, accountId } = req.body;
  if (!name || !type || !amount || !categoryId) {
    throw new BadRequestError400('Faltan campos requeridos');
  }

  const accountIdSelected: number = accountId ? accountId : await getIdSelectedAccountByUserId(req.user.id);

  const newTransaction = await createTransaction({
    name,
    type,
    amount,
    description,
    date: (new Date()).toISOString(),
    accountId: accountIdSelected,
    categoryId,
    userId: req.user.id,
  });
  simpleSuccess(res, 201, newTransaction);
}));

export default router;
