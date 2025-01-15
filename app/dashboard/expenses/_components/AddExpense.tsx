import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useState } from "react";
import { toast } from "sonner";
import moment from "moment";

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
    const res = await db
      .insert(Expenses)
      .values({
        name: name,
        amount: amount,
        budget_id: budgetId,
        createdAt: moment().format("DD/MM/yyy"),
      })
      .returning({ insertedId: Budgets.id });

    console.log("Reeeesponse", res);

    if (res) {
      refreshData();
      toast("Expenses added");
    }
  };

  return (
    <div className="px-5 py-2 rounded-xl border">
      <h1 className="font-bold text-xl text-center">Add expense</h1>
      <div className="mt-2">
        <h1 className="text-slate-600 font-medium my-1">Expense name</h1>
        <Input
          placeholder="eg: shoes"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h1 className="text-slate-600 font-medium my-1">Expense amount</h1>
        <Input
          placeholder="eg: 17500"
          type="number"
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
