"use client";

import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardHeader from "./_components/DashboardHeader";
import SideNav from "./_components/SideNav";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      checkUserBudgets();
    }
  }, [user, isLoaded]);

  const checkUserBudgets = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    // consol`e.log("userrrrrrr=====>", user);
    // console.log("Eeeeeeeemail addreeeasss=====>", email);
    // console.log("Data b=====>", db);`

    if (!email) {
      console.error("User email is not available");
      return;
    }

    const result = await db
      .select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, email));

    console.log(result, "Reeeesults");

    if (!result) {
      console.error("Results missing");
    }

    if (result.length === 0) {
      router.replace("/dashboard/budgets");
    }

    // console.log("resssssult =====>", result);
  };

  return (
    <div>
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
