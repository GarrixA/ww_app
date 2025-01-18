"use client";

import { UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  FolderKanban,
  Landmark,
  LayoutGrid,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SideNav = () => {
  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Income", icon: Landmark, path: "/dashboard/income" },
    { id: 2, name: "Budget", icon: FolderKanban, path: "/dashboard/budgets" },
    { id: 3, name: "Expense", icon: ReceiptText, path: "/dashboard/expenses" },
    { id: 4, name: "Upgrade", icon: ShieldCheck, path: "/dashboard/upgrade" },
  ];

  const path = usePathname();

  return (
    <div className="h-screen p-5">
      <div className="flex items-center gap-2">
        <Image
          alt="log"
          src={"/logo.svg"}
          width={50}
          height={30}
          className="ml-4"
        />
        <h1 className="text-black">WWA</h1>
        <div className="w-full">
          <Link href={"/"}>
            <ArrowLeft className="float-right" />
          </Link>
        </div>
      </div>
      <div className="mt-5">
        {menuList.map((menu, idx) => (
          <Link href={menu.path} key={idx}>
            <h1
              className={`flex items-center text-gray-500 mb-2 font-medium cursor-pointer rounded-md gap-2 py-3 px-4 hover:bg-blue-500 hover:text-white ${
                menu.path === path && "!text-white bg-blue-500 "
              }`}
            >
              <menu.icon />
              {menu.name}
            </h1>
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-2 fixed bottom-10">
        <UserButton />
        <h1>Profile</h1>
      </div>
    </div>
  );
};

export default SideNav;
