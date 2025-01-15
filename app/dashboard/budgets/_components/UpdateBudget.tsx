import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

interface budgetsInfoProps {
  id: number;
  name: string;
  amount: number;
  icon: string;
}

const UpdateBudget = ({
  budgetsInfo,
  refreshData,
}: {
  budgetsInfo: budgetsInfoProps;
  refreshData: any;
}) => {
  const [emojiIcon, setImojiIcon] = useState(
    (budgetsInfo?.icon || "") as string
  );
  const [openImojiPicker, setImojiPicker] = useState(false);
  const [name, setName] = useState<string>((budgetsInfo?.name || "") as string);
  const [amount, setAmount] = useState<string>(
    (budgetsInfo?.amount || "") as string
  );

  useEffect(() => {
    setImojiIcon(budgetsInfo?.icon);
    setAmount(String(budgetsInfo?.amount));
    setName(budgetsInfo?.name);
  }, [budgetsInfo]);

  const updateBudget = async () => {
    const res = await db
      .update(Budgets)
      .set({
        name: name,
        amount: amount,
        icon: emojiIcon,
      })
      .where(eq(Budgets.id, budgetsInfo.id))
      .returning();

    if (res) {
      refreshData();
      toast("Budget updated");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center">
            <PenBox /> Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div>
              <DialogTitle>Update budget</DialogTitle>

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
                  defaultValue={budgetsInfo?.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <h1 className="text-black font-medium my-1">Budget amount</h1>
                <Input
                  placeholder="eg: 50000"
                  type="number"
                  defaultValue={budgetsInfo?.amount}
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
                onClick={() => updateBudget()}
              >
                Update budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateBudget;
