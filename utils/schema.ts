import {
  index,
  integer,
  numeric,
  pgTable,
  serial,
  unique,
  uniqueIndex,
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

export const Incomes = pgTable(
  "incomes",
  {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    amount: numeric("amount").notNull(),
    createdBy: varchar("createdBy").notNull(),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.name),
      incomeNameUniqueIdx: uniqueIndex("income_name_unique_idx").on(
        table.createdBy,
        table.name
      ),
    };
  }
);
