import { pgTable, serial, varchar, decimal, text, integer } from 'drizzle-orm/pg-core';

import { timestamps } from './commons.js';

export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  initialBalance: decimal('initial_balance', { precision: 10, scale: 2 }).notNull().default('0'),
  totalBalance: decimal('total_balance', { precision: 10, scale: 2 }).notNull().default('0'),
  description: text('description'),
  userId: integer('user_id').notNull(),
  ... timestamps
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert; 