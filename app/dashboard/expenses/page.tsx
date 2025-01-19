"use client";

import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface AllExpenseProps {
  id: number;
  amount: number;
  createdAt: any;
  name: string;
  from: string;
}

const ExpensesPage = ({ refreshData = () => {} }: any) => {
  const { user, isLoaded } = useUser();
  const [allExpense, setAllExpense] = useState<any>();

  useEffect(() => {
    if (!isLoaded) return;

    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      toast.error("Unable to fetch expenses: Email is missing");
      return;
    }

    getAllExpenses(email);
  }, [isLoaded, user]);

  const getAllExpenses = async (email: string) => {
    try {
      const res = await db
        .select({
          id: Expenses.id,
          name: Expenses.name,
          amount: Expenses.amount,
          createdAt: Expenses.createdAt,
          from: Budgets.name,
        })
        .from(Budgets)
        .rightJoin(Expenses, eq(Budgets.id, Expenses.budget_id))
        .where(eq(Budgets.createdBy, email))
        .orderBy(desc(Expenses.id));
      setAllExpense(res);
    } catch (error) {
      toast.error("Failed to fetch expenses.");
    }
  };

  return (
    <div className="p-10">
      <h1 className="font-bold text-xl my-2">My expense</h1>
      <div className="grid grid-cols-4 bg-slate-200 p-2">
        <h1 className="font-bold">Name</h1>
        <h1 className="font-bold">Amount</h1>
        <h1 className="font-bold">Date</h1>
        <h1 className="font-bold">Budget name</h1>
      </div>
      {allExpense
        ? allExpense?.map((expense: AllExpenseProps, idx: number) => (
            <div
              className={`grid grid-cols-4 bg-slate-50 p-2 border-t`}
              key={idx}
            >
              <h1>{expense.name}</h1>
              <h1>{expense.amount}</h1>
              <h1>{expense.createdAt}</h1>
              <h1>{expense.from}</h1>
            </div>
          ))
        : [1, 2, 3, 4].map((_item, idx) => (
            <div
              key={idx}
              className="h-8 my-1 w-full bg-slate-400 animate-pulse"
            ></div>
          ))}
    </div>
  );
};

export default ExpensesPage;
