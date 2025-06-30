import { eq, desc } from 'drizzle-orm';
import { db } from '../index.js';
import { users, type User, type NewUser } from '../schemas/user.js';

// Crear un nuevo usuario
export async function createUser(userData: NewUser): Promise<User> {
  const [newUser] = await db.insert(users).values(userData).returning();
  return newUser;
}

// Obtener todos los usuarios
export async function getAllUsers(): Promise<User[]> {
  return await db.select().from(users).orderBy(desc(users.createdAt ));
}

// Obtener un usuario por ID
export async function getUserById(id: number): Promise<User | null> {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user || null;
}


// Actualizar un usuario
export async function updateUser(id: number, userData: Partial<NewUser>): Promise<User | null> {
  const [updatedUser] = await db
    .update(users)
    .set({ ...userData, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return updatedUser || null;
}

// Eliminar un usuario
export async function deleteUser(id: number): Promise<boolean> {
  const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning();
  return !!deletedUser;
} 