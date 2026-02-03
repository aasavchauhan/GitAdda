import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import NextTopLoader from 'nextjs-toploader';
import { Suspense } from "react";
import NavbarSkeleton from "@/components/layout/NavbarSkeleton";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "GitAdda - Discover Repositories That Matter",
  description: "A social layer on top of GitHub for repository discovery, sharing, and collaboration.",
  keywords: ["github", "repositories", "developer", "collaboration", "open source"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <NextTopLoader
          color="#00E5CC"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #00E5CC,0 0 5px #00E5CC"
        />
        <div className="starfield-bg">
          <div className="stars"></div>
          <div className="nebula"></div>
        </div>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>
        <main className="page-transition">{children}</main>
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  );
}
