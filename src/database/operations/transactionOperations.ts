import { eq, desc, and, gte, lte } from 'drizzle-orm';
import { db } from '../index.js';
import { transactions, type Transaction, type NewTransaction } from '../schemas/transaction.js';
import { users } from '../schemas/user.js';
import { accounts } from '../schemas/account.js';
import { categories } from '../schemas/category.js';

// Crear una nueva transacción
export async function createTransaction(transactionData: NewTransaction): Promise<Transaction> {
  const [newTransaction] = await db.insert(transactions).values(transactionData).returning();
  return newTransaction;
}

// Obtener todas las transacciones de un usuario con información relacionada
export async function getTransactionsByUserId(userId: number) {
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
    .where(eq(transactions.userId, userId))
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