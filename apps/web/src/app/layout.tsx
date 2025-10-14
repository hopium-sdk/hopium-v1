import type { Metadata } from "next";
import "./globals.css";
import { defaultFont } from "@/main/utils/fonts";
import { GlobalLayout } from "@/main/components/layouts/global-layout";

export const metadata: Metadata = {
  title: "Hopium",
  description: "Hop on hopium!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>{/* {CONSTANTS.env.isDev && <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />} */}</head>

      <body className={`${defaultFont.className}`}>
        <GlobalLayout>{children}</GlobalLayout>
      </body>
    </html>
  );
}
