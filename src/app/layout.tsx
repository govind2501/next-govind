import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/navbar"
import VisitTracker from "@/components/VisitTracker";


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trade My Property - Buy, Sell & Rent Property Across India",
  description: "Trade My Property connects buyers, sellers, and renters of land, houses, and shops across every state and district in India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en">

      <body>
        
        <Navbar />

        <Toaster />

        <VisitTracker />
        
        {children}
        
        
        
        </body>

    </html>
  );
}