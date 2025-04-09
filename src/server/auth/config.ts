import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Benutzername", type: "text" },
        password: { label: "Passwort", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await db.user.findFirst({
          where: { userName: credentials.username as string },
        });

        if (!user) return null;
        // TODO: check ldap and ad
        if (!user.password) return null;

        if (user.password != (credentials.password as string)) {
          return null;
        }

        return {
          id: user.id.toString(),
          userName: user.userName,
          displayName: user.displayName,
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
    newUser: "/dashboard",
    signOut: "/logout",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12,
  },
  jwt: {
    maxAge: 60 * 60 * 12,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userName = user.userName;
        token.displayName = user.displayName;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.userName = token.userName as string;
        session.user.displayName = token.displayName as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
