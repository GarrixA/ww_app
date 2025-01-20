"use client";

import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BudgetCard from "../budgets/_components/BudgetCard";
import ChartComponent from "./ChartComponent";
import DashboardCards from "./DashboardCards";
import Link from "next/link";

const DashboardComponent = () => {
  const [budgets, setBudgets] = useState<any>([]);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
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
      toast.error("Failed to fetch budgets.");
    }
  };
  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl">Hi, {user?.fullName}, 👌</h1>
      <h1 className="text-slate-600">Welcome!!</h1>

      <DashboardCards budgetInfo={budgets} />
      <div className="mt-5 grid grid-col-1 lg:grid-cols-3 gap-4 ">
        <div className="md:col-span-2">
          <ChartComponent budgetInfo={budgets} />
        </div>
        <div
          className={`flex flex-col gap-2 ${
            budgets?.length <= 2 ? "gap-4" : ""
          }`}
        >
          <h1 className="text-lg font-bold">Latest budgets</h1>
          {budgets?.slice(0, 2).map((budget: any, idx: number) => (
            <BudgetCard budget={budget} key={idx} />
          ))}
          {budgets?.length > 2 && (
            <Link href={"/dashboard/budgets"}>
              <h1 className="text-center text-blue-700 hover:text-orange-600 cursor-pointer">
                Load more
              </h1>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
