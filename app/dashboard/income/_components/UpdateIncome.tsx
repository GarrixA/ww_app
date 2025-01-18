"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useState } from "react";
import { eq } from "drizzle-orm";

interface UpdateIncomeProps {
  currentAmount: number;
  id: number;
  onSuccess?: () => void;
}

const UpdateIncome: React.FC<UpdateIncomeProps> = ({
  currentAmount,
  id,
  onSuccess,
}) => {
  const [amount, setAmount] = useState<string>(currentAmount.toString());
  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (isLoaded && !email) {
    console.error("Email not present");
  }

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Unable to update income: Email is missing");
      return;
    }

    try {
      const updatedIncome = await db
        .update(Incomes)
        .set({
          amount,
        })
        .where(eq(Incomes.id, id));

      if (updatedIncome) {
        toast.success("Income Updated");
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      console.error("Error updating income:", error);
      toast.error("Failed to update income");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded cursor-pointer">
          Update Income
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update your income</DialogTitle>
        </DialogHeader>

        <div className="mt-2">
          <h1 className="text-black font-medium my-1">Income amount</h1>
          <Input
            placeholder="e.g., 50000"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              className="mt-5 w-full"
              disabled={!amount}
              onClick={handleSubmit}
            >
              Update Income
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateIncome;
