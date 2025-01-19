import { motion, AnimatePresence } from "framer-motion";
import { UserButton } from "@clerk/nextjs";
import {
  ArrowLeft,
  FolderKanban,
  Landmark,
  LayoutGrid,
  ReceiptText,
  ShieldCheck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideBarModalProps {
  toggleModal: () => void;
}

const SideBarModal = ({ toggleModal }: SideBarModalProps) => {
  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Income", icon: Landmark, path: "/dashboard/income" },
    { id: 2, name: "Budget", icon: FolderKanban, path: "/dashboard/budgets" },
    { id: 3, name: "Expense", icon: ReceiptText, path: "/dashboard/expenses" },
    { id: 4, name: "Upgrade", icon: ShieldCheck, path: "/dashboard/upgrade" },
  ];

  const path = usePathname();

  const sidebarVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: {
      x: "0%",
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      x: "-100%",
      opacity: 0,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <motion.div
      className="fixed bg-black/20 inset-0 h-screen z-50"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={sidebarVariants}
    >
      <div
        className="w-full h-full absolute inset-0 -z-10"
        onClick={() => toggleModal()}
      ></div>
      <div className="flex justify-between w-full h-full">
        <div className="md:w-2/5 w-3/5 bg-white h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <Image
                alt="logo"
                src={"/logo.svg"}
                width={50}
                height={30}
                className="ml-2 md:w-10 h-10 w-8"
              />
              <h1 className="lg:text-xl md:text-sm text-[12px] font-bold text-gray-700">
                WWA
              </h1>
              <div className="ml-auto">
                <Link href={"/"}>
                  <ArrowLeft
                    className="text-gray-600 hover:text-gray-800 cursor-pointer"
                    size={24}
                  />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-5">
            {menuList.map((menu, idx) => (
              <Link href={menu.path} key={idx}>
                <h1
                  className={`flex items-center text-gray-500 mb-2 font-medium cursor-pointer gap-2 py-3 px-4 hover:bg-blue-500 hover:text-white ${
                    menu.path === path && "!text-white bg-blue-500"
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
        <X
          className="text-black hover:text-red-500 cursor-pointer m-5"
          onClick={() => toggleModal()}
          size={30}
        />
      </div>
    </motion.div>
  );
};

export default SideBarModal;
