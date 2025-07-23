import { eq, desc, and, gte, lte, sum, sql } from 'drizzle-orm';
import { db } from '../database/index.js';
import { transactions, type Transaction, type NewTransaction } from '../database/schemas/transaction.js';
import { users } from '../database/schemas/user.js';
import { accounts } from '../database/schemas/account.js';
import { categories } from '../database/schemas/category.js';

import { getIdSelectedAccountByUserId } from './accountService.js';
import { type TransactionType } from '../interfaces/types.js';

// Crear una nueva transacción
export async function createTransaction(transactionData: NewTransaction): Promise<Transaction> {
  const [newTransaction] = await db.insert(transactions).values(transactionData).returning();
  return newTransaction;
}


// Obtener el total de transferencias del usuario filtrado por fecha, sumar 

export async function getTotalTransactionsByUserId({ userId, date }: { userId: number, date: string }) {
  console.log({
    userId, date
  });

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


//Obtener la ultima transaccion de un usuario
export async function getLastTransactionByUserId(userId: number) {
  const [lastTransaction] = await db.select({ id: transactions.id, accountId: transactions.accountId })
                          .from(transactions)
                          .where(eq(transactions.userId, userId))
                          .orderBy(desc(transactions.date))
                          .limit(1);
  return lastTransaction || null;
}

// Obtener todas las transacciones de un usuario con información relacionada
export async function getTransactionsByUserId({ userId, startDate, endDate, categoryId, type }: { 
  userId: number, 
  startDate: string, 
  endDate?: string,
  categoryId?: number,
  type?: TransactionType,
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

  console.log({
    userId, startDate, endDate, categoryId, idSelectedAccount
  })

  return await db
    .select({
      id: transactions.id,
      name: transactions.name,
      type: transactions.type,
      amount: transactions.amount,
      description: transactions.description,
      date: transactions.date,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      // Información del usuario
      userName: users.name,
      userEmail: users.email,
      // Información de la cuenta
      accountName: accounts.name,
      accountCurrency: accounts.currency,
      // Información de la categoría
      categoryName: categories.name,
      categoryColor: categories.color,
      categoryType: categories.type,
    })
    .from(transactions)
    .innerJoin(users, eq(transactions.userId, users.id))
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(transactions.date), desc(transactions.createdAt));
}


// Obtener una transacción por ID con información relacionada
export async function getTransactionById(id: number) {
  const [transaction] = await db
    .select({
      id: transactions.id,
      name: transactions.name,
      type: transactions.type,
      amount: transactions.amount,
      description: transactions.description,
      date: transactions.date,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      // Información del usuario
      userName: users.name,
      userEmail: users.email,
      // Información de la cuenta
      accountName: accounts.name,
      accountCurrency: accounts.currency,
      // Información de la categoría
      categoryName: categories.name,
      categoryColor: categories.color,
      categoryType: categories.type,
    })
    .from(transactions)
    .innerJoin(users, eq(transactions.userId, users.id))
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.id, id));
  
  return transaction || null;
}

// Obtener transacciones por rango de fechas
export async function getTransactionsByDateRange(userId: number, startDate: Date, endDate: Date) {
  return await db
    .select()
    .from(transactions)
    .where(
      and(
        eq(transactions.userId, userId),
        gte(transactions.date, startDate.toISOString().split('T')[0]),
        lte(transactions.date, endDate.toISOString().split('T')[0])
      )
    )
    .orderBy(desc(transactions.date));
}

// Actualizar una transacción
export async function updateTransaction(id: number, transactionData: Partial<NewTransaction>): Promise<Transaction | null> {
  const [updatedTransaction] = await db
    .update(transactions)
    .set({ ...transactionData, updatedAt: new Date() })
    .where(eq(transactions.id, id))
    .returning();
  return updatedTransaction || null;
}

// Eliminar una transacción
export async function deleteTransaction(id: number): Promise<boolean> {
  const [deletedTransaction] = await db.delete(transactions).where(eq(transactions.id, id)).returning();
  return !!deletedTransaction;
} 