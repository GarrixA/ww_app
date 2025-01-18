import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import UpdateIncome from "./UpdateIncome";

interface IncomesInfoProps {
  id: number;
  name: string;
  amount: number;
  createdBy: string;
}

const Incomecard = ({
  incomesInfo,
  refreshData,
}: {
  incomesInfo: IncomesInfoProps;
  refreshData: any;
}) => {
  const myImages = [
    { name: "Cash", src: "/cash.jpg" },
    { name: "Mobile money", src: "/momo.jpg" },
    { name: "Bank account", src: "/bank.png" },
  ];

  const matchedImage =
    myImages.find((img) => img.name === incomesInfo?.name)?.src || "/cash.jpg";

  return (
    <div className="shadow border rounded-sm w-full overflow-hidden">
      <div className="w-full h-64">
        <Image
          width={200}
          height={200}
          alt={incomesInfo?.name || "Income Image"}
          src={matchedImage}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-3 mt-2">
        <div className="font-bold flex items-center justify-between">
          <h1>{incomesInfo?.name}</h1>
          <h1>{incomesInfo?.amount?.toLocaleString()} RWF</h1>
        </div>
      </div>

      <Button className="w-full">
        <UpdateIncome
          currentAmount={incomesInfo?.amount}
          id={incomesInfo?.id}
          onSuccess={() => refreshData()}
        />
      </Button>
    </div>
  );
};

export default Incomecard;
