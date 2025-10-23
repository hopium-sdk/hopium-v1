import { Bricolage_Grotesque, Cedarville_Cursive } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
});

const cedarvilleCursive = Cedarville_Cursive({
  variable: "--font-cedarville-cursive",
  subsets: ["latin"],
  weight: ["400"],
});

const defaultFont = bricolageGrotesque;
const cursiveFont = cedarvilleCursive;

export { defaultFont, cursiveFont };
