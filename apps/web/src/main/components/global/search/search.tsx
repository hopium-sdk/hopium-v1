"use client";
import { Input } from "@/main/shadcn/components/ui/input";
import { Icons } from "@/main/utils/icons";
import { useSearch } from "./use-search";

export const Search = () => {
  const { value, setValue } = useSearch({});

  return (
    <div className="border rounded-md px-4 h-10 flex items-center justify-between gap-2 text-subtext w-full max-w-sm">
      <div className="w-full flex items-center gap-2">
        <Icons.Search />
        <Input className="w-full text-sm font-medium" placeholder="Search" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    </div>
  );
};

export const SearchMobile = ({ handleSearchClose }: { handleSearchClose: () => void }) => {
  const { value, setValue } = useSearch({ isMobile: true });

  return (
    <>
      <div className="w-full flex items-center gap-2 text-subtext">
        <Icons.Search />
        <Input className="w-full text-sm font-medium" placeholder="Search" value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
      <Icons.X className="size-6" onClick={handleSearchClose} />
    </>
  );
};
