import { UserButton } from "@clerk/nextjs";

const DashboardHeader = () => {
  return (
    <div className="flex items-center justify-between py-5 px-12 shadow-m border-b min-h-20">
      <div></div>
      <div>
        <UserButton />
      </div>
    </div>
  );
};

export default DashboardHeader;
