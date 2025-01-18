import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useState } from "react";

import moment from "moment";
import { eq } from "drizzle-orm";
import { toast } from "react-toastify";

const AddExpense = ({
  email,
  budgetId,
  refreshData,
}: {
  email: string;
  budgetId: number;
  refreshData: any;
}) => {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const handleAddExpense = async () => {
    const expenseAmount = parseFloat(amount);

    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      toast.warning("Please enter a valid amount.");
      return;
    }

    try {
      const existingExpenses = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budget_id, budgetId));
      const totalExpenses = existingExpenses.reduce(
        (sum, expense) => sum + parseFloat(expense.amount),
        0
      );

      const budget = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.id, budgetId))
        .limit(1);

      if (budget.length === 0) {
        toast.error("Budget not found.");
        return;
      }

      const budgetLimit = parseFloat(budget[0].amount);

      if (totalExpenses + expenseAmount > budgetLimit) {
        toast.error("Expense exceeds the available budget.");
        return;
      }

      const res = await db
        .insert(Expenses)
        .values({
          name: name,
          amount: amount,
          budget_id: budgetId,
          createdAt: moment().format("DD/MM/YYYY"),
        })
        .returning({ insertedId: Expenses.id });

      if (res) {
        setName("");
        setAmount("");

        refreshData();
        toast.success("Expense added successfully");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("An error occurred while adding the expense.");
    }
  };

  return (
    <div className="px-5 py-2 rounded-xl border">
      <h1 className="font-bold text-xl text-center">Add expense</h1>
      <div className="mt-2">
        <h1 className="text-slate-600 font-medium my-1">Expense name</h1>
        <Input
          placeholder="e.g., shoes"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h1 className="text-slate-600 font-medium my-1">Expense amount</h1>
        <Input
          placeholder="e.g., 17500"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount)}
        onClick={() => handleAddExpense()}
        className="w-full mt-2"
      >
        Add expense
      </Button>
    </div>
  );
};

export default AddExpense;
