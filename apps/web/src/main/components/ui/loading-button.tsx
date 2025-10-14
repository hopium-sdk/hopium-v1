import { Button, T_ShadcnButton } from "@/main/shadcn/components/ui/button";
import { Icons } from "@/main/utils/icons";

type T_LoadingButton = T_ShadcnButton & {
  loading: string | null;
};

export const LoadingButton = ({ loading, children, ...props }: T_LoadingButton) => {
  return (
    <Button disabled={loading ? true : false} {...props}>
      {loading ? (
        <>
          <Icons.Loading className="animate-spin size-4" />
          <p className="">{loading}</p>
        </>
      ) : (
        children
      )}
    </Button>
  );
};
