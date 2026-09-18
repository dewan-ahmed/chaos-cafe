import { DM_Sans, Fraunces } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Chaos Café",
  description: "A diner menu of public Litmus chaos faults. No Harness token required.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${fraunces.variable}`}>{children}</body>
    </html>
  );
}
