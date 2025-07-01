import { eq } from 'drizzle-orm';
import { db } from '../database/index.js';
import { accounts, type Account, type NewAccount } from '../database/schemas/account.js';

// Obtener todas las cuentas de un usuario
export async function getAccountsByUserId(userId: number): Promise<Account[]> {
  return await db.select().from(accounts).where(eq(accounts.userId, userId));
}

// Obtener una cuenta por ID
export async function getAccountById(id: number): Promise<Account | null> {
  const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
  return account || null;
}

// Eliminar una cuenta
export async function deleteAccount(id: number): Promise<boolean> {
  const [deletedAccount] = await db.delete(accounts).where(eq(accounts.id, id)).returning();
  return !!deletedAccount;
}

// Crear una nueva cuenta
export async function createAccount(accountData: NewAccount): Promise<Account> {
  const [newAccount] = await db.insert(accounts).values(accountData).returning();
  return newAccount;
} 