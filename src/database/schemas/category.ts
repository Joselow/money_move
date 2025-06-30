import { pgTable, serial, varchar, char } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  color: varchar('color', { length: 7 }).notNull(), // Formato hex: #FFFFFF
  type: char('type', { length: 1 }).notNull(), // '1' para ingreso, '2' para gasto
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert; 