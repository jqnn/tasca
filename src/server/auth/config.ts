import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "~/server/db";
import { hashPassword } from "~/lib/utils";
import { authorizeLDAP } from "~/lib/ldap";
import { authorizeAD } from "~/lib/active-directory";

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

        const userName = credentials.username as string;
        const password = credentials.password as string;

        const user = await db.user.findFirst({
          where: { userName: credentials.username as string },
        });

        if (!user) return null;

        const authMethod = await db.authMethod.findFirst({
          where: { id: user.authMethodId },
        });

        if (authMethod == null) return null;
        switch (authMethod.type) {
          case "LDAP":
            const ldap = await authorizeLDAP(authMethod, userName, password);
            if (!ldap) return null;
            break;
          case "AD":
            const ad = await authorizeAD(authMethod, userName, password);
            if (!ad) return null;
            break;
          case "LOCAL":
            if (!user.password) return null;
            const hashedPassword = hashPassword(password);
            if (user.password != hashedPassword) {
              return null;
            }
            break;
        }

        return {
          id: user.id.toString(),
          userName: user.userName,
          displayName: user.displayName,
        };
      },
    }),
  ],
  trustHost: true,
  debug: false,
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
