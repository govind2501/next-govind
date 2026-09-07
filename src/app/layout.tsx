import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/navbar"
import VisitTracker from "@/components/VisitTracker";
import Footer from "@/components/Footer";
import HeroSlideshow from "@/components/HeroSlideshow";
import QueryProvider from "@/components/QueryProvider";

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
    <html lang="en">

      <body className="flex flex-col min-h-screen">

        {/* Fixed full-page background slideshow - sits behind everything on every route */}
        <div className="fixed inset-0 -z-10">
          <HeroSlideshow />
          {/* Dark overlay so text stays readable on every page */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Razorpay Checkout script - needed on any page that can open the payment popup */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

        <QueryProvider>
          <Navbar />

          <Toaster />

          <VisitTracker />

          <main className="flex-1 pt-[130px] sm:pt-[110px] pb-[88px]">
            {children}
          </main>

          <Footer />
        </QueryProvider>

      </body>

    </html>
  );
}