import { Icons } from "@/main/utils/icons";

export const Search = () => {
  return (
    <div className="border rounded-md px-4 h-10 flex items-center justify-between gap-2 text-subtext w-full max-w-sm cursor-pointer hover:bg-bg-900">
      <div className="flex items-center gap-2">
        <Icons.Search />
        <p className="text-sm font-medium">Search</p>
      </div>
    </div>
  );
};
