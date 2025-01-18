"use client";

import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { getTableColumns, sql, eq, and, desc } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import BudgetCard from "../../budgets/_components/BudgetCard";
import AddExpense from "../_components/AddExpense";
import ExpensesTable from "../_components/ExpensesTable";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import UpdateBudget from "../../budgets/_components/UpdateBudget";

const MyExpenses = () => {
  const { user, isLoaded } = useUser();
  const params = useParams();
  const [budgetsInfo, setBudgetInfo] = useState<any>();
  const [expensesInfo, setExpensesInfo] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      console.error("Email not present");
      toast.error("Unable to create budget: Email is missing");
      return;
    }

    getBudgetsInfo(email);
  }, [isLoaded, user]);
  const email = user?.primaryEmailAddress?.emailAddress;

  /**
   * get budget info depends on which user added
   * @param email
   */

  const getBudgetsInfo = async (email: string) => {
    try {
      const singleBudget = await db
        .select({
          ...getTableColumns(Budgets),
          total_spent: sql`sum(${Expenses.amount})`.mapWith(Number),
          total_items: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budget_id))
        .where(
          and(eq(Budgets.createdBy, email), eq(Budgets.id, Number(params?.id)))
        )
        .groupBy(Budgets.id);

      setBudgetInfo(singleBudget[0]);

      getExpensesInfo();
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Failed to fetch budgets.");
    }
  };

  /**
   * get expenses info according to
   * id of budget in params
   */

  const getExpensesInfo = async () => {
    const res = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budget_id, Number(params.id)))
      .orderBy(desc(Expenses.id));

    setExpensesInfo(res);
  };

  const deleteBudget = async () => {
    const handleExpenses = await db
      .delete(Expenses)
      .where(eq(Expenses.budget_id, Number(params.id)))
      .returning();

    if (handleExpenses) {
      const res = await db
        .delete(Budgets)
        .where(eq(Budgets.id, Number(params.id)))
        .returning();

      if (res) {
        router.push("/dashboard/budgets");
        toast.warning("Budget deleted");
      }
    }
  };

  return (
    <div className="px-10 py-5">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold my-2">Budget</h1>
        <div className="flex items-center gap-2">
          <UpdateBudget
            budgetsInfo={budgetsInfo}
            refreshData={() => getBudgetsInfo(String(email))}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>
                <Trash />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This <b>Budget</b> will
                  permanently delete your budget and expenses remove them from
                  our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <BudgetCard budget={budgetsInfo} />
        <AddExpense
          budgetId={Number(params.id)}
          email={String(email)}
          refreshData={() => getBudgetsInfo(email as string)}
        />
      </div>

      <div className="mt-4">
        <h1 className="font-bold text-lg">Latest expenses</h1>
        <ExpensesTable
          expenseInfo={expensesInfo}
          refreshData={() => getExpensesInfo()}
        />
      </div>
    </div>
  );
};

export default MyExpenses;
