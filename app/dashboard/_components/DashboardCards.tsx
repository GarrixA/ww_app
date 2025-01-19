import { Banknote, PiggyBank, Receipt, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

interface BudgetProps {
  amount: number;
  total_spent: number;
}

const DashboardCards = ({ budgetInfo }: any) => {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    budgetInfo && calculatedBudget();
  }, [budgetInfo]);

  const calculatedBudget = () => {
    let total_spent = 0;
    let total_budget = 0;

    budgetInfo.forEach((budget: BudgetProps) => {
      total_budget = total_budget + Number(budget?.amount);
      total_spent = total_spent + budget?.total_spent;
    });
    setTotalSpent(total_spent);
    setTotalBudget(total_budget);
  };

  return (
    <>
      {budgetInfo.length > 0 ? (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 border rounded-lg flex items-center justify-between">
            <div>
              <h1 className="text-sm">Total budget</h1>
              <h1 className="font-bold text-2xl">
                {totalBudget?.toLocaleString()} Rwf
              </h1>
            </div>
            <div className="bg-blue-700 rounded-full p-1">
              <Banknote className="text-white" />
            </div>
          </div>
          <div className="p-5 border rounded-lg flex items-center justify-between">
            <div>
              <h1 className="text-sm">Total spent</h1>
              <h1 className="font-bold text-2xl">
                {totalSpent?.toLocaleString()} Rwf
              </h1>
            </div>
            <div className="bg-blue-700 rounded-full p-2">
              <Receipt className="text-white text-sm" />
            </div>
          </div>
          <div className="p-5 border rounded-lg flex items-center justify-between">
            <div>
              <h1 className="text-sm">No. of budgets</h1>
              <h1 className="font-bold text-2xl">{budgetInfo?.length}</h1>
            </div>
            <div className="bg-blue-700 rounded-full p-2">
              <Wallet className="text-white !text-sm" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((skel, idx) => (
            <div
              key={idx}
              className="w-full h-20 bg-slate-400 animate-pulse flex justify-between rounded-sm"
            >
              <div className="h-full w-full flex flex-col gap-2 p-2">
                <div className="w-4/5 rounded-sm h-4 bg-slate-500"></div>
                <div className="w-4/5 rounded-sm h-4 bg-slate-500"></div>
              </div>
              <div className="w-12 rounded-full h-10 bg-slate-500 m-2"></div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DashboardCards;
