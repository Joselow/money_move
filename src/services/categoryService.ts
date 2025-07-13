import { eq } from 'drizzle-orm';
import { db } from '../database/index.js';
import { categories, type Category } from '../database/schemas/category.js';

// Obtener todas las cuentas de un usuario
export async function getCategories(type?: string | null): Promise<Category[]> {
  const query = db.select().from(categories)

    if (type) {
        query.where(eq(categories.type, type))
    }

    return await query
  ;
}
