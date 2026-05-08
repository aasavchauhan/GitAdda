import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import MobileNav from "@/components/layout/MobileNav";
import NextTopLoader from 'nextjs-toploader';
import { Suspense } from "react";
import NavbarSkeleton from "@/components/layout/NavbarSkeleton";
import { Toaster } from "sonner";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "GitAdda - Discover Repositories That Matter",
  description: "A social layer on top of GitHub for repository discovery, sharing, and collaboration.",
  keywords: ["github", "repositories", "developer", "collaboration", "open source"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GitAdda",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e17",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to GitHub and prefetch DNS for external domains */}
        <link rel="preconnect" href="https://github.com" />
        <link rel="preconnect" href="https://avatars.githubusercontent.com" />
        <link rel="preconnect" href="https://opengraph.githubassets.com" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://api.fontshare.com" />
        {/* PWA Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body>
        <ServiceWorkerRegistration />
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
        <MobileNav />
        <InstallPrompt />
        <Toaster position="bottom-right" theme="dark" richColors />
      </body>
    </html>
  );
}
