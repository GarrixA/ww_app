import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";

interface ExpensesTableProps {
  id?: number;
  name: string;
  amount: number;
  createdAt: any;
}

const ExpensesTable = ({
  expenseInfo,
  refreshData,
}: {
  expenseInfo: any;
  refreshData: any;
}) => {
  const handleDeleteExpense = async (exp: ExpensesTableProps) => {
    try {
      const res = await db
        .delete(Expenses)
        .where(eq(Expenses.id, Number(exp.id)))
        .returning();

      if (res) {
        toast.warning("Expense deleted");
        refreshData();
      }
    } catch (error) {
      toast.error("Failed to delete expense. Please try again.");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-4 bg-slate-200 p-2">
        <h1 className="font-bold">Name</h1>
        <h1 className="font-bold">Amount</h1>
        <h1 className="font-bold">Date</h1>
        <h1 className="font-bold">Action</h1>
      </div>
      {expenseInfo
        ? expenseInfo?.map((expense: ExpensesTableProps, idx: number) => (
            <div
              className={`grid grid-cols-4 bg-slate-50 p-2 border-t`}
              key={idx}
            >
              <h1>{expense.name}</h1>
              <h1>{expense.amount}</h1>
              <h1>{expense.createdAt}</h1>
              <h1>
                <Trash
                  className="text-lg text-red-600 cursor-pointer"
                  onClick={() => handleDeleteExpense(expense)}
                />
              </h1>
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

export default ExpensesTable;
