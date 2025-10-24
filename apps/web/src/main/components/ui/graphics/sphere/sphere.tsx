import React from "react";
import { cn } from "@/main/shadcn/lib/utils";
import { Icons } from "@/main/utils/icons";

interface SphereProps {
  /** Diameter of the sphere in pixels */
  size?: number;
  /** Any CSS color — hex, rgb(), etc. */
  color?: string;

  /** Whether to float the sphere */
  float?: boolean;
}

export const Sphere: React.FC<SphereProps> = ({ size = 220, color = "#7B83FF", float = false }) => {
  return (
    <div className={cn(float && "float")}>
      <Icons.Circle style={{ width: size, height: size, color: color }} />
    </div>
  );
};
