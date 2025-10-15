const Box = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full flex flex-col gap-2">{children}</div>;
};

const Header = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center justify-between">{children}</div>;
};

const Title = ({ title, icon }: { title: string; icon: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-2 pb-1">
      {icon}
      <p className="text-xs font-medium text-subtext">{title}</p>
    </div>
  );
};

const Right = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>;
};

export const SidebarBox = {
  Box,
  Header,
  Title,
  Right,
};
