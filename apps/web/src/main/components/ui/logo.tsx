import { cn } from "@/main/shadcn/lib/utils";
import React from "react";

const Logo = ({ className, color, variant = "fill", ...props }: React.ComponentProps<"div"> & { color?: string; variant?: "fill" | "outline" }) => {
  return (
    <div className={cn(className)} {...props}>
      {variant === "fill" ? <LogoFillSvg color={color || "var(--fg)"} /> : <LogoOutlineSvg color={color || "var(--fg)"} />}
    </div>
  );
};

export default Logo;

const difference = 9.5; // same offset you used

export const LogoFillSvg = ({
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

const R = 100; // same circle radius you used

export const LogoOutlineSvg = ({
  color = "#fff",
  size = 200,
  outline = 15, // visible outline thickness in viewBox units
  d = difference,
  r = R,
}: {
  color?: string;
  size?: number;
  outline?: number; // desired INSIDE thickness
  d?: number;
  r?: number;
}) => {
  const uid = React.useId();
  const maskId = `${uid}-shape`;
  const filterId = `${uid}-inner-stroke`;

  // feMorphology radius defines the "eroded" amount for inner outline
  const radius = Math.max(0.01, outline);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* The original filled silhouette as a mask: rect kept, 4 big circles cut out */}
        <mask id={maskId} x="0" y="0" width="200" height="200" maskUnits="userSpaceOnUse">
          <rect x="0" y="0" width="200" height="200" fill="white" />
          <circle cx={-d} cy={-d} r={r} fill="black" />
          <circle cx={200 + d} cy={-d} r={r} fill="black" />
          <circle cx={-d} cy={200 + d} r={r} fill="black" />
          <circle cx={200 + d} cy={200 + d} r={r} fill="black" />
        </mask>

        {/* INNER outline:
            1. erode(shape) → smaller inner shape
            2. shape − eroded → inner ring only */}
        <filter id={filterId} x="0" y="0" width="200" height="200" filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse">
          <feMorphology in="SourceAlpha" operator="erode" radius={radius} result="inner" />
          <feComposite in="SourceAlpha" in2="inner" operator="out" result="ringInner" />
          <feFlood floodColor={color} result="ink" />
          <feComposite in="ink" in2="ringInner" operator="in" result="coloredRing" />
          <feBlend in="coloredRing" in2="BackgroundImage" mode="normal" />
        </filter>
      </defs>

      {/* Feed the filter the solid filled shape; filter outputs only the INNER ring */}
      <g filter={`url(#${filterId})`}>
        <rect x="0" y="0" width="200" height="200" fill="white" mask={`url(#${maskId})`} />
      </g>
    </svg>
  );
};
