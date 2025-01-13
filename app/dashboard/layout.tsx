import DashboardHeader from "./_components/DashboardHeader";
import SideNav from "./_components/SideNav";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
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
