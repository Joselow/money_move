import { eq, desc, and, gte, lte, sql } from 'drizzle-orm';
import { db } from '../database/index.js';
import { transactions, type Transaction, type NewTransaction } from '../database/schemas/transaction.js';
import { categories } from '../database/schemas/category.js';

import { getIdSelectedAccountByUserId, subsBalance, addBalance } from './accountService.js';
import { type TransactionType } from '../interfaces/types.js';
import { TRANSACTION_TYPE } from '../constants/transaction.js';
import { NotFoundError404 } from '../errors/NotFoundError404.js';

// Obtener el total de transferencias del usuario filtrado por fecha, sumar 
export async function getTotalTransactionsByUserId({ userId, date }: { userId: number, date: string }) {


  const idSelectedAccount = await getIdSelectedAccountByUserId(userId);

  const [result] = await db.select({ 
      total: sql<number>`SUM(CASE WHEN ${transactions.type} = '1' THEN ${transactions.amount} ELSE -${transactions.amount} END)`
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        eq(transactions.date, date),
        eq(transactions.accountId, idSelectedAccount)
      )
    );
    
  return Number(result.total) || 0;
}

// Obtener todas las transacciones de un usuario con información relacionada
export async function getTransactionsByUserId({ userId, startDate, endDate, categoryId, type, limit, offset, all }: { 
  userId: number, 
  startDate: string, 
  endDate?: string,
  categoryId?: number,
  type?: TransactionType,
  limit?: number,
  offset?: number,
  all?: boolean | 'true' | 'false'
}) {
  const idSelectedAccount = await getIdSelectedAccountByUserId(userId);

  // Construir las condiciones base
  let conditions = [
    eq(transactions.userId, userId),
    eq(transactions.accountId, idSelectedAccount)
  ];

  // Agregar condiciones de fecha según los parámetros recibidos
  if (startDate && endDate) {
    // Rango de fechas: desde startDate hasta endDate (inclusivo)
    conditions.push(
      gte(transactions.date, startDate),
      lte(transactions.date, endDate)
    );
  } else if (startDate && !endDate) {
    // Solo una fecha: traer transacciones de ese día específico
    conditions.push(eq(transactions.date, startDate));
  } 
  if (categoryId) { conditions.push(eq(transactions.categoryId, categoryId));}
  // else if (!startDate && endDate) {
  //   // Solo fecha final: traer todas las transacciones hasta esa fecha
  //   conditions.push(lte(transactions.date, endDate));
  // }

  if (type) { conditions.push(eq(transactions.type, type));}


  const all_accounts = all === 'true' || all === true;

  const baseQuery = db
  .select({
    id: transactions.id,
    type: transactions.type,
    amount: transactions.amount,
    description: transactions.description,
    date: transactions.date,
    createdAt: transactions.createdAt,
    updatedAt: transactions.updatedAt,
    categoryName: categories.name,
    categoryColor: categories.color,
    categoryId: transactions.categoryId,
    accountId: transactions.accountId,
  })
  .from(transactions)
  .innerJoin(categories, eq(transactions.categoryId, categories.id))
  .where(and(...conditions))
  .orderBy(desc(transactions.date), desc(transactions.createdAt));

  let query = baseQuery as any;


  if (!all_accounts) {
    if (limit !== undefined) {
      query = query.limit(Number(limit));
    }
  
    if (offset !== undefined) {
      query = query.offset(Number(offset));
    }
  }

  return await query;
}

// Obtener una transacción por ID con información relacionada
export async function getTransactionById(id: number) {
  const [transaction] = await db
    .select({
      id: transactions.id,
      type: transactions.type,
      amount: transactions.amount,
      description: transactions.description,
      date: transactions.date,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      categoryName: categories.name,
      categoryColor: categories.color,
      categoryId: transactions.categoryId,
      accountId: transactions.accountId,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.id, id));
  
  return transaction || null;
}

// Crear una nueva transacción
export async function createTransaction(transactionData: NewTransaction): Promise<Transaction> {
  return db.transaction(async (tx) => {
    const [newTransaction] = await tx.insert(transactions)
      .values(transactionData)
      .returning();

    if (transactionData.type === TRANSACTION_TYPE.INFLOW) {
      console.log('add', transactionData.amount);
      
      await addBalance(transactionData.accountId, Number(transactionData.amount));
    } else {
      console.log('substract', transactionData.amount);
      
      await subsBalance(transactionData.accountId, Number(transactionData.amount));
    }

    return newTransaction;
  });
}

// Actualizar una transacción
export async function updateTransaction(id: number, transactionData: Partial<NewTransaction>): Promise<Transaction | null> {
  return db.transaction(async (tx) => {
    const [transactionFound] = await tx.select({
      type: transactions.type,
      amount: transactions.amount,
      accountId: transactions.accountId,
    }).from(transactions)
      .where(eq(transactions.id, id));

    if (!transactionFound) {
      throw new NotFoundError404('Transacción no encontrada');
    }

    const diference = Number(transactionFound.amount) - Number(transactionData.amount || 0);

    if (transactionFound.type === TRANSACTION_TYPE.INFLOW) {
      if (diference > 0) {
        await subsBalance(transactionFound.accountId, Math.abs(diference));
      } else if (diference < 0) {
        await addBalance(transactionFound.accountId, Math.abs(diference));
      }
    } else {
      if (diference > 0) {
        await addBalance(transactionFound.accountId, Math.abs(diference));
      } else if (diference < 0) {
        await subsBalance(transactionFound.accountId, Math.abs(diference));
      }
    }

    const [updatedTransaction] = await tx
      .update(transactions)
      .set({ ...transactionData, updatedAt: new Date() })
      .where(eq(transactions.id, id))
      .returning();

    return updatedTransaction || null;
  });
}

// Eliminar una transacción
export async function deleteTransaction(id: number, idUser: number): Promise<boolean> {
  return db.transaction(async (tx) => {
    const accountSelectedId = await getIdSelectedAccountByUserId(idUser);

    const [transactionFound] = await tx.select({
      type: transactions.type,
      amount: transactions.amount,
      accountId: transactions.accountId,
    }).from(transactions)
      .where(eq(transactions.id, id));

    if (!transactionFound) {
      throw new NotFoundError404('Transacción no encontrada');
    }

    if (transactionFound.type === TRANSACTION_TYPE.INFLOW) {
      await subsBalance(transactionFound.accountId, Number(transactionFound.amount));
    } else {
      await addBalance(transactionFound.accountId, Number(transactionFound.amount));
    }

    const [deletedTransaction] = await tx.delete(transactions)
      .where(eq(transactions.id, id))
      .returning();
      
    return !!deletedTransaction;
  });
}