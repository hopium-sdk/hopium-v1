import { Icons } from "@/main/utils/icons";
import { SidebarBox } from "@/main/components/views/etf/components/sidebar/ui/box";
import { Button } from "@/main/shadcn/components/ui/button";
import { useState } from "react";
import { CreateEtfModal } from "./modals/create-etf/create-etf";

export const AdminActions = () => {
  const [createEtfModalOpen, setCreateEtfModalOpen] = useState(false);

  const Items = [
    {
      label: "Create ETF",
      icon: <Icons.Plus className="size-4.5" />,
      onClick: () => {
        setCreateEtfModalOpen(true);
      },
    },
  ];
  return (
    <>
      <SidebarBox title="Actions" icon={<Icons.Overview className="size-4.5" />}>
        <div className="w-full grid grid-cols-2 gap-1 pt-2">
          {Items.map((item) => (
            <Button key={item.label} onClick={item.onClick} variant="bg900" className="text-text">
              {item.icon}
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
      </SidebarBox>
      <CreateEtfModal modalOpen={createEtfModalOpen} setModalOpen={setCreateEtfModalOpen} />
    </>
  );
};
