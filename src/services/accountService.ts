import { asc, eq } from 'drizzle-orm';
import { db } from '../database/index.js';
import { accounts, type Account, type NewAccount } from '../database/schemas/account.js';
import { users } from '../database/schemas/user.js';

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

// Obtener la primera cuenta de un usuario
export async function getFirstAccountByUserId(userId: number): Promise<Account | null> {
  const [firstAccount] = await db.select().from(accounts).where(eq(accounts.userId, userId)).orderBy(asc(accounts.id)).limit(1);
  return firstAccount || null;
}

// Obtener la primera cuenta seleecionada del usuario
export async function getIdSelectedAccountByUserId(userId: number): Promise<Account['id'] | null> {
  const [user] = await db
    .select({ accountSelectedId: users.accountSelectedId })
    .from(users)
    .where(eq(users.id, userId));
  
  if (!user || !user.accountSelectedId) {
    return null
  }
  const [firstAccount] = await db.select({ id: accounts.id }).from(accounts).where(eq(accounts.id, user.accountSelectedId)).limit(1);
  return firstAccount.id 
}

export async function getSelectedAccountByUserId(userId: number): Promise<Account | null> {
  const [user] = await db
    .select({ accountSelectedId: users.accountSelectedId })
    .from(users)
    .where(eq(users.id, userId));
  
  if (!user || !user.accountSelectedId) {
    return null
  }
  const [firstAccount] = await db.select().from(accounts).where(eq(accounts.id, user.accountSelectedId)).limit(1);
  return firstAccount
}

// verificar si el usuario tiene al menos dos cuentas
export async function hasAtLeastTwoAccounts(userId: number): Promise<boolean> {
  const response = await db.select({ id: accounts.id }).from(accounts).where(eq(accounts.userId, userId)).limit(2);
  return response.length >= 2;
}

