"use client";

import { db } from "@/utils/dbConfig";
import { Budgets, Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardHeader from "./_components/DashboardHeader";
import SideNav from "./_components/SideNav";
import { toast } from "react-toastify";
import SideBarModal from "./_components/SideBarModal";
import { Menu } from "lucide-react";
import { AnimatePresence } from "framer-motion";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [openModal, setOpenModal] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    const checkUserBudgets = async () => {
      const email = user?.primaryEmailAddress?.emailAddress;

      if (!email) {
        toast.error("User email is not available");
        return;
      }

      const income = await db
        .select()
        .from(Incomes)
        .where(eq(Incomes.createdBy, email));

      if (!income || income.length === 0) {
        toast("No income data available");
        router.replace("/dashboard/income");
        return;
      }

      const budget = await db
        .select()
        .from(Budgets)
        .where(eq(Budgets.createdBy, email));

      if (!budget || budget.length === 0) {
        toast("No budget data available");
        router.replace("/dashboard/budgets");
        return;
      }
    };

    if (isLoaded && user) {
      checkUserBudgets();
    }
  }, [user, isLoaded, router]);

  return (
    <div>
      <div className="lg:hidden absolute m-7">
        <Menu
          className="text-black text-lg cursor-pointer"
          onClick={() => toggleModal()}
          size={28}
        />
        <AnimatePresence>
          {openModal && <SideBarModal toggleModal={toggleModal} />}
        </AnimatePresence>
      </div>
      <div className="fixed hidden lg:w-64 lg:block shadow-lg">
        <SideNav />
      </div>
      <div className="lg:ml-64 ml-0">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
