import { Router } from 'express';
import {
  getTransactionsByUserId,
  getTransactionById,
  createTransaction,
  deleteTransaction,
  getTotalTransactionsByUserId,
  updateTransaction
} from '../services/transactionService.js';

import { catchErrors } from '../utils/catchErrors';
import { success, simpleSuccess } from '../utils/responses';

import { InvalidCredentialsError401 } from '../errors/InvalidCredentialsError401';
import { BadRequestError400 } from '../errors/BadRequestError400.js';
import { NotFoundError404 } from '../errors/NotFoundError404';
import { getIdSelectedAccountByUserId } from '../services/accountService.js';
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

  const { startDate, endDate, categoryId, type, limit, offset } : any = req.query;

  if (!startDate) {
    throw new BadRequestError400('Necesitas definir una fecha inicial');
  }

  const targetDate = startDate || new Date().toISOString().split('T')[0];


  const transactions = await getTransactionsByUserId({ userId, startDate: targetDate, endDate: endDate, categoryId, type, limit, offset });

  simpleSuccess(res, 200, transactions);
}));


router.get('/total', catchErrors(async (req, res) => {
  const { date }: { date?: string } = req.query;

  const targetDate = date || new Date().toISOString().split('T')[0];

  const total = await getTotalTransactionsByUserId({ 
    userId: req.user.id, 
    date: targetDate 
  });

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

  const { type, amount, description, categoryId, accountId, date } = req.body;

  if (!type || !amount || !categoryId) {
    throw new BadRequestError400('Faltan campos requeridos');
  }

  const accountIdSelected: number = accountId ? accountId : await getIdSelectedAccountByUserId(req.user.id);

  const newTransaction = await createTransaction({
    type,
    amount,
    description,
    date: date ?? (new Date()).toISOString(),
    accountId: accountIdSelected,
    categoryId,
    userId: req.user.id,
  });
  simpleSuccess(res, 201, newTransaction);
}));

//PUT /transactions/:id - Actualizar una transacción
router.patch('/:id', catchErrors(async (req, res) => {
  const { id } = req.params
  if (id && isNaN(Number(id))) {
    throw new BadRequestError400('ID de transacción inválido');
  }
  const { amount, date, categoryId, description, accountId} = req.body;
  if (!amount || !date || !categoryId) {
    throw new BadRequestError400('Faltan campos requeridos');
  }
  const updatedTransaction = await updateTransaction(Number(id), {
    amount,
    description,
    date,
    accountId: accountId,
    categoryId,
    userId: req.user.id,
  });
  simpleSuccess(res, 200, updatedTransaction ?? { message: 'Transacción no encontrada' });
}));

export default router;
