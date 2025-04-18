import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import type { ReactNode } from "react";
import { Toaster } from "~/components/ui/sonner";
import { HydrateClient } from "~/trpc/server";

export const metadata: Metadata = {
  title: "Tasca",
  description: "Task-Management",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
          <HydrateClient>{children}</HydrateClient>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
