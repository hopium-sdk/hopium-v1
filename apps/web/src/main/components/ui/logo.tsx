import { cn } from "@/main/shadcn/lib/utils";

const Logo = ({ className, color }: React.ComponentProps<"div"> & { color?: string }) => {
  return (
    <div className={cn(className)}>
      <LogoSvg color={color || "var(--foreground)"} />
    </div>
  );
};

export default Logo;

const difference = 9.5;

export const LogoSvg = ({ color = "#FFF" }: { color?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
    <defs>
      <mask id="cutCorners" maskUnits="userSpaceOnUse">
        <rect width="200" height="200" fill="white" />
        <circle cx={-difference} cy={-difference} r="100" fill="black" />
        <circle cx={200 + difference} cy={200 + difference} r="100" fill="black" />
        <circle cx={-difference} cy={200 + difference} r="100" fill="black" />
        <circle cx={200 + difference} cy={-difference} r="100" fill="black" />
      </mask>
    </defs>

    <rect width="200" height="200" fill={color} mask="url(#cutCorners)" />
  </svg>
);
