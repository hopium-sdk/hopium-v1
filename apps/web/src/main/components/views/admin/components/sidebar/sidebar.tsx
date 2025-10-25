import { AdminOverview } from "./components/overview";
import { AdminActions } from "./components/actions/actions";

export const AdminSidebar = () => {
  return (
    <div className="w-full flex flex-1 flex-col overflow-hidden bg-bg">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="pt-4 pb-2 px-6">
          <AdminOverview />
        </div>

        <div className="py-4 px-6">
          <AdminActions />
        </div>
      </div>
    </div>
  );
};
