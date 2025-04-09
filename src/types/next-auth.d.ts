import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      userName: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    userName: string;
  }
}
