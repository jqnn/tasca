import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import type { ReactNode } from "react";

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
      <body className="dark">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
