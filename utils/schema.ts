import {
  integer,
  numeric,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

export const Expenses = pgTable("expenses", {
  id: serial().primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull(),
  budget_id: integer("budget_id").references(() => Budgets.id),
  createdAt: varchar("createdAt").notNull(),
});
