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
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { toast } from "sonner";

const CreateBudget = () => {
  const [emojiIcon, setImojiIcon] = useState("😎");
  const [openImojiPicker, setImojiPicker] = useState(false);
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (isLoaded && !email) {
    console.error("Email not present");
  }

  // create budget

  const handleSubmit = async () => {
    if (!email) {
      console.error("Email not present");
      toast.error("Unable to create budget: Email is missing");
      return;
    }

    try {
      const createdBudget = await db
        .insert(Budgets)
        .values({
          name: name,
          amount: amount,
          createdBy: email,
          icon: emojiIcon,
        })
        .returning({ insertedId: Budgets.id });

      if (createdBudget) {
        toast("New budget created");
      }
    } catch (error) {
      console.error("Error creating budget:", error);
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
