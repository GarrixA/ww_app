"use client";

import { db } from "@/utils/dbConfig";
import CreateBudget from "./CreateBudget";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import BudgetCard from "./BudgetCard";

const BudgetList = () => {
  const [budgets, setBudgets] = useState<any>([]);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      console.error("Email not present");
      toast.error("Unable to create budget: Email is missing");
      return;
    }

    getAllBudgets(email);
  }, [isLoaded, user]);

  const getAllBudgets = async (email: string) => {
    try {
      const allBudgets = await db
        .select({
          ...getTableColumns(Budgets),
          total_spent: sql`sum(${Expenses.amount})`.mapWith(Number),
          total_items: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budget_id))
        .where(eq(Budgets.createdBy, email))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      setBudgets(allBudgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Failed to fetch budgets.");
    }
  };

  const email = user?.primaryEmailAddress?.emailAddress;

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {email && <CreateBudget refreshData={() => getAllBudgets(email)} />}
        {budgets.length > 0
          ? budgets.map((budget: any, idx: number) => (
              <BudgetCard key={idx} budget={budget} />
            ))
          : [1, 2, 3, 4, 5].map((_skel, idx) => (
              <div
                key={idx}
                className="w-full h-36 bg-slate-400 animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
};

export default BudgetList;
