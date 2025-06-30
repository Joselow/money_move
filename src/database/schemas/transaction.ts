import { pgTable, serial, varchar, char, decimal, text, date, integer, } from 'drizzle-orm/pg-core';
import { timestamps } from './commons.js';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: char('type', { length: 1 }).notNull(), // '1' para ingreso, '2' para gasto
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description'),
  date: date('date').notNull(),
  userId: integer('user_id').notNull(),
  accountId: integer('account_id').notNull(),
  categoryId: integer('category_id').notNull(),
  ...timestamps
});

export type Transaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert; 