"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets, Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { desc, eq } from "drizzle-orm";

interface IncomesProps {
  amount?: number;
  total_spent?: number;
}

const CreateBudget = ({ refreshData }: any) => {
  const [emojiIcon, setImojiIcon] = useState("😎");
  const [openImojiPicker, setImojiPicker] = useState(false);
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [incomesInfo, setIncomesInfo] = useState<any>();
  const [incomeAmount, setIncomeAmount] = useState<number>(0);

  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (isLoaded && !email) {
    toast.error("Email not present");
  }

  /**
   * Get income informations
   * @param email
   */
  const getIncomeInfo = async (email: string) => {
    const res = await db
      .select()
      .from(Incomes)
      .orderBy(desc(Incomes.id))
      .where(eq(Incomes?.createdBy, email));

    setIncomesInfo(res);
  };

  useEffect(() => {
    if (isLoaded && email) {
      getIncomeInfo(email);
    }
  }, [isLoaded, email]);

  // Calculate total income when incomesInfo changes
  useEffect(() => {
    if (incomesInfo) {
      let total_income = 0;
      incomesInfo.forEach((info: IncomesProps) => {
        total_income += Number(info.amount);
      });
      setIncomeAmount(total_income);
    }
  }, [incomesInfo]);

  /**
   * Handle submit of budget creation form
   * @returns
   */
  const handleSubmit = async () => {
    if (!email) {
      toast.error("Unable to create budget: Email is missing");
      return;
    }

    const budgetAmount = parseFloat(amount);

    if (isNaN(budgetAmount) || budgetAmount <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }

    try {
      // Fetch the total allocated budget
      const budgets = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.createdBy, email));

      const totalAllocatedBudget = budgets.reduce(
        (total: number, budget: any) =>
          total + parseFloat(budget.amount || "0"),
        0
      );

      if (totalAllocatedBudget + budgetAmount > incomeAmount) {
        toast.error(
          `The total budget allocation exceeds your total income of ${incomeAmount}. Please reduce the budget amount.`
        );
        return;
      }

      // Insert new budget
      const createdBudget = await db
        .insert(Budgets)
        .values({
          name: name,
          amount: budgetAmount.toString(),
          createdBy: email,
          icon: emojiIcon,
        })
        .returning({ insertedId: Budgets.id });

      if (createdBudget) {
        refreshData();
        toast("New budget created");
        setName("");
        setAmount("");
      }
    } catch (error) {
      toast.error("Failed to create budget");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <div className="flex flex-col items-center border-2 border-dashed rounded-md bg-slate-100 hover:shadow-lg p-10 cursor-pointer">
            <h1 className="text-3xl">+</h1>
            <h1 className="font-bold">Create new budget</h1>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div>
              <DialogTitle>Create new budget</DialogTitle>

              <div className="mt-5">
                <Button
                  variant="outline"
                  size={"lg"}
                  className="text-2xl"
                  onClick={() => setImojiPicker(!openImojiPicker)}
                >
                  {emojiIcon}
                </Button>
                <div className="absolute top-0 -left-[22rem]">
                  <EmojiPicker
                    open={openImojiPicker}
                    onEmojiClick={(e) => {
                      setImojiIcon(e.emoji), setImojiPicker(false);
                    }}
                  />
                </div>
              </div>
              <div className="mt-2">
                <h1 className="text-black font-medium my-1">Budget name</h1>
                <Input
                  placeholder="eg: gas"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <h1 className="text-black font-medium my-1">Budget amount</h1>
                <Input
                  placeholder="eg: 50000"
                  type="number"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button
                className="mt-5 w-full"
                disabled={!(name && amount)}
                onClick={() => handleSubmit()}
              >
                Create budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBudget;
