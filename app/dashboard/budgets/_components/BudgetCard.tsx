import Link from "next/link";

interface BudgetCardProps {
  id?: number;
  icon: string;
  name: string;
  total_items: number;
  total_spent: number;
  amount: number;
}

const BudgetCard = ({ budget }: { budget: BudgetCardProps }) => {
  const budgetProgress = () => {
    const percent = (budget?.total_spent / budget?.amount) * 100;
    return percent.toFixed(2);
  };

  return (
    <Link
      href={`/dashboard/expenses/${budget?.id}`}
      className="p-5 border rounded-lg cursor-pointer shadow-lg hover:shadow-xl max-h-40"
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl p-2 bg-slate-100 rounded-full">
            {budget?.icon}
          </h1>
          <div>
            <h1 className="font-bold">{budget?.name} budget</h1>
            <h1 className="text-slate-400 text-sm">
              {budget?.total_items} items
            </h1>
          </div>
        </div>
        <h1 className="font-bold text-blue-800">RWF {budget?.amount}</h1>
      </div>
      <div className="mt-5 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h1 className="text-[12px] text-slate-400">
            RWF {budget?.total_spent ? budget?.total_spent : 0} Spent
          </h1>
          <h1 className="text-[12px] text-slate-400">
            RWF {budget?.amount - budget?.total_spent} Remaining
          </h1>
        </div>
        <div className="bg-slate-300 h-2 rounded-full">
          <div
            className="bg-blue-700 h-2 rounded-full "
            style={{
              width: `${budgetProgress()}%`,
            }}
          ></div>
        </div>
      </div>
    </Link>
  );
};

export default BudgetCard;
