"use client";
import { ProgressProvider } from "@bprogress/next/app";
import { FC } from "react";

const NavigationBarProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProgressProvider height="3px" color="var(--color-main)" options={{ showSpinner: false }} shallowRouting>
      {children}
    </ProgressProvider>
  );
};

export default NavigationBarProvider;
