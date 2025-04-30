import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import type { ReactNode } from "react";
import { Toaster } from "~/components/ui/sonner";
import { HydrateClient } from "~/trpc/server";
import { TooltipProvider } from "~/components/ui/tooltip";

export const metadata: Metadata = {
  title: "tasca",
  description: "Task-Management",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
      },
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.svg",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="de">
      {/*
          <head>
            <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
          </head>
      */}

      <body className="dark">
        <TRPCReactProvider>
          <TooltipProvider>
            <HydrateClient>{children}</HydrateClient>
          </TooltipProvider>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
