"use client";
import { useIsMobile } from "@/main/hooks/use-is-mobile";
import { LoadingDiv } from "./loading-div";

export const LoadingLayout = ({ desktop, mobile }: { desktop: React.ReactNode; mobile: React.ReactNode }) => {
  const { isRawMobile } = useIsMobile();

  if (isRawMobile === undefined) {
    return <LoadingDiv />;
  }

  if (isRawMobile) {
    return mobile;
  }

  return desktop;
};
