export const SidebarBox = ({ children, title, icon, right }: { children: React.ReactNode; title: string; icon: React.ReactNode; right?: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <Header>
        <Title title={title} icon={icon} />
        {right && <Right>{right}</Right>}
      </Header>
      {children}
    </div>
  );
};

const Header = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center justify-between">{children}</div>;
};

const Title = ({ title, icon }: { title: string; icon: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-2 pb-1 text-subtext">
      {icon}
      <p className="text-xs font-medium">{title}</p>
    </div>
  );
};

const Right = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>;
};
