"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses, Incomes } from "@/utils/schema";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import AddIcomeComponent from "./_components/AddIcomeComponent";
import Incomecard from "./_components/Incomecard";

const IncomesPage = () => {
  const [incomesInfo, setIncomesInfo] = useState<any[]>([]);
  const [incomeAmount, setIncomeAmount] = useState<number>(0);
  const [totalSpent, setTotalSpent] = useState<number>(0);
  const [spentPercentage, setSpentPercentage] = useState<number>(0);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    if (!isLoaded) return;

    if (!email) {
      console.error("Email not present");
      toast.error("Unable to create budget: Email is missing");
      return;
    }

    setLoading(true);
    Promise.all([getIncomeInfo(email), getAllBudgets(email)]).finally(() =>
      setLoading(false)
    );
  }, [isLoaded, user]);

  useEffect(() => {
    if (incomesInfo.length > 0) totalIncome();
  }, [incomesInfo]);

  useEffect(() => {
    if (budgets.length > 0 && incomeAmount > 0) {
      totalSpentInBudget();
      const percentage = (totalSpent / incomeAmount) * 100;
      setSpentPercentage(percentage);
    }
  }, [budgets, incomeAmount]);

  const getIncomeInfo = async (email: string) => {
    try {
      const res = await db
        .select()
        .from(Incomes)
        .orderBy(desc(Incomes.id))
        .where(eq(Incomes?.createdBy, email));
      setIncomesInfo(res);
    } catch (error) {
      console.error("Error fetching incomes:", error);
      toast.error("Failed to fetch incomes.");
    }
  };

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

  const totalIncome = () => {
    const total_income = incomesInfo.reduce(
      (total, info) => total + Number(info.amount),
      0
    );
    setIncomeAmount(total_income);
  };

  const totalSpentInBudget = () => {
    const total_budget_spent = budgets.reduce(
      (total, info) => total + Number(info.total_spent),
      0
    );
    setTotalSpent(total_budget_spent);
  };

  const budgetProgress = () => {
    const percent = (totalSpent / incomeAmount) * 100;
    return percent.toFixed(2);
  };

  return (
    <div className="p-5 flex flex-col">
      <div className="p-10 flex flex-col items-center gap-4">
        <div className="text-2xl font-bold w-2/5 border border-dashed h-20 flex flex-col items-center justify-center cursor-pointer">
          <AddIcomeComponent onSuccess={() => email && getIncomeInfo(email)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
          {loading ? (
            <div className="mt-5 ">
              {[0].map((skel) => (
                <div
                  key={skel}
                  className="w-full h-64 bg-slate-400 animate-pulse flex flex-col justify-between rounded-sm"
                >
                  <div className="h-full w-full"></div>
                  <div className="flex flex-col w-full gap-2 p-2">
                    <div className="w-full h-10 bg-slate-500 rounded-sm"></div>
                    <div className="w-full h-10 bg-slate-500 rounded-sm"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : incomesInfo?.length > 0 ? (
            incomesInfo?.map((income, idx) => (
              <Incomecard
                key={idx}
                incomesInfo={income}
                refreshData={() => email && getIncomeInfo(email)}
              />
            ))
          ) : (
            <p>No incomes found.</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <h1>Total income</h1>
          <h1>{loading ? "Loading..." : `${incomeAmount} RWF`}</h1>
          <div className="w-full h-6 bg-blue-700 rounded-xl"></div>
        </div>
        <div>
          <h1>Total spent</h1>
          <div>
            <div>
              <h1>
                {loading
                  ? "Loading..."
                  : `${totalSpent} RWF / ${incomeAmount} RWF`}
              </h1>
            </div>
            <div className="w-full h-6 bg-slate-300 rounded-xl">
              <div
                className={`h-full rounded-xl ${
                  Number(budgetProgress()) >= 85 ? "bg-red-400" : "bg-green-500"
                }`}
                style={{
                  width: `${budgetProgress()}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomesPage;
