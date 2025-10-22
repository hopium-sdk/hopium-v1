import { cn } from "@/main/shadcn/lib/utils";
import React from "react";

const Logo = ({ className, color }: React.ComponentProps<"div"> & { color?: string }) => {
  return (
    <div className={cn(className)}>
      <LogoSvg color={color || "var(--fg)"} />
    </div>
  );
};

export default Logo;

const difference = 9.5;

export const LogoSvg = ({
  color = "#FFF",
  size = 200,
  d = difference,
}: {
  color?: string;
  size?: number; // if you want to scale beyond 200x200 viewBox
  d?: number;
}) => {
  const uid = React.useId();
  const maskId = `${uid}-cutCorners`;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
          <rect x="0" y="0" width="200" height="200" fill="white" />
          {/* nibble the corners with big circles just outside the box */}
          <circle cx={-d} cy={-d} r="100" fill="black" />
          <circle cx={200 + d} cy={200 + d} r="100" fill="black" />
          <circle cx={-d} cy={200 + d} r="100" fill="black" />
          <circle cx={200 + d} cy={-d} r="100" fill="black" />
        </mask>
      </defs>

      <rect width="200" height="200" fill={color} mask={`url(#${maskId})`} />
    </svg>
  );
};
