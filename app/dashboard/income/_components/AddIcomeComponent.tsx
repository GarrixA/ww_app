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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useState } from "react";

interface AddIcomeComponentProps {
  onSuccess?: () => void;
}

const AddIcomeComponent: React.FC<AddIcomeComponentProps> = ({ onSuccess }) => {
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  if (isLoaded && !email) {
    console.error("Email not present");
  }

  const incomeNames = ["Mobile money", "Bank account", "Cash"];

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Unable to create income: Email is missing");
      return;
    }

    try {
      const createdIncome = await db.insert(Incomes).values({
        name: name,
        amount: amount,
        createdBy: email,
      });

      if (createdIncome) {
        toast.success("Income Added");
        setName("");
        setAmount("");
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      if (
        error?.message?.includes(
          "duplicate key value violates unique constraint"
        )
      ) {
        toast.error(
          "Income arleady exist. please use update button to change values"
        );
      } else {
        console.error("Error adding income:", error);
        toast.error("Failed to add income");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded cursor-pointer">
          Add Income
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your income</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <h1 className="text-black font-medium my-1">Income name</h1>
          <Select onValueChange={(value) => setName(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Income" />
            </SelectTrigger>
            <SelectContent>
              {incomeNames?.map((iname, idx) => (
                <SelectItem key={idx} value={iname}>
                  {iname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
              disabled={!(name && amount)}
              onClick={handleSubmit}
            >
              Create Income
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddIcomeComponent;
