"use client";

import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardCards from "./DashboardCards";
import ChartComponent from "./ChartComponent";
import BudgetCard from "../budgets/_components/BudgetCard";

const DashboardComponent = () => {
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
  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl">Hi, {user?.fullName}, 👌</h1>
      <h1 className="text-slate-600">Welcome!!</h1>

      <DashboardCards budgetInfo={budgets} />
      <div className="mt-5 grid grid-col-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ChartComponent budgetInfo={budgets} />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-bold">Latest budgets</h1>
          {budgets.map((budget: any, idx: number) => (
            <BudgetCard budget={budget} key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
