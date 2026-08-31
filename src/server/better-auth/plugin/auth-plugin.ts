// lib/auth-plugins/ldap-auth.ts
import { createAuthEndpoint } from "better-auth/api";
import { z } from "zod";
import { Client } from "ldapts";
import type { AuthMethod } from "generated/prisma";
import { db } from "~/server/db";
import type { BetterAuthPlugin } from "better-auth";

// Hilfsfunktion: Führt den LDAP-Bind mit ldapts durch
async function verifyLdapPassword(
  username: string,
  password: string,
  authMethod: AuthMethod,
): Promise<boolean> {
  const protocol =
    authMethod.securityType === "TLS" || authMethod.securityType === "SSL"
      ? "ldaps"
      : "ldap";
  const host = authMethod.controllers;
  const port = authMethod.port || 389;

  if (!host) {
    console.error(
      "LDAP-Fehler: Keines oder ungültiges Controller-Feld angegeben",
    );
    return false;
  }

  // 1. ldapts Client-Instanz erstellen
  const client = new Client({
    url: `${protocol}://${host}:${port}`,
    timeout: 5000,
    connectTimeout: 5000,
    strictDN: false,
  });

  // 2. User-DN oder UPN für die Anmeldung festlegen
  let bindDN = "";
  if (authMethod.accountSuffix) {
    // z. B. user@domain.local
    bindDN = `${username}${authMethod.accountSuffix}`;
  } else if (authMethod.usersDN && authMethod.uidAttribute) {
    // z. B. sAMAccountName=username,OU=Users,DC=domain,DC=local
    bindDN = `${authMethod.uidAttribute}=${username},${authMethod.usersDN}`;
  } else {
    bindDN = username;
  }

  try {
    // 3. Bind mit ldapts (async/await)
    await client.bind(bindDN, password);
    return true; // Bind war erfolgreich!
  } catch (err) {
    console.error("LDAP Bind fehlgeschlagen:", err);
    return false;
  } finally {
    // 4. Verbindung in jedem Fall sauber schließen
    await client.unbind();
  }
}

// Better Auth Plugin Definition
export const hybridAuthPlugin = () => {
  return {
    id: "hybrid-ldap-auth",
    endpoints: {
      signInHybrid: createAuthEndpoint(
        "/sign-in/hybrid",
        {
          method: "POST",
          body: z.object({
            username: z.string(),
            password: z.string(),
          }),
        },
        async (ctx) => {
          const { username, password } = ctx.body;

          // 1. User inklusive verknüpfter AuthMethod aus Prisma laden
          const user = await db.user.findFirst({
            where: {
              OR: [{ username: username }, { email: username }],
            },
            include: {
              authMethod: true,
            },
          });

          if (!user) {
            throw ctx.error("UNAUTHORIZED", {
              message: "Ungültige Anmeldedaten",
            });
          }

          const userAuthMethod = (user as any).authMethod;

          // --- PFAD A: Active Directory / LDAP ---
          if (userAuthMethod && userAuthMethod.type === "LDAP") {
            const isLdapValid = await verifyLdapPassword(
              username,
              password,
              userAuthMethod,
            );

            if (!isLdapValid) {
              throw ctx.error("UNAUTHORIZED", {
                message: "LDAP-Authentifizierung fehlgeschlagen",
              });
            }

            // Session über den internen Better-Auth-Adapter generieren
            const session = await ctx.context.internalAdapter.createSession(
              user.id,
            );

            await ctx.setSignedCookie(
              ctx.context.authCookies.sessionToken.name,
              session.token,
              ctx.context.secret,
              ctx.context.authCookies.sessionToken.attributes,
            );

            return ctx.json({ user, session });
          }

          // --- PFAD B: Lokales Passwort (LOCAL) ---
          const account = await ctx.context.adapter.findOne<any>({
            model: "account",
            where: [
              { field: "userId", value: user.id },
              { field: "providerId", value: "credential" },
            ],
          });

          if (!account || !account.password) {
            throw ctx.error("UNAUTHORIZED", {
              message: "Kein lokales Passwort für diesen Benutzer vorhanden",
            });
          }

          const isPasswordValid = await ctx.context.password.verify({
            hash: account.password,
            password: password,
          });

          if (!isPasswordValid) {
            throw ctx.error("UNAUTHORIZED", {
              message: "Falsches Passwort",
            });
          }

          const session = await ctx.context.internalAdapter.createSession(
            user.id,
          );

          const sessionToken = session.token;
          const cookieName = ctx.context.authCookies.sessionToken.name;

          await ctx.setSignedCookie(
            cookieName,
            sessionToken,
            ctx.context.secret,
            ctx.context.authCookies.sessionToken.attributes,
          );

          return ctx.json({ user, session });
        },
      ),
    },
  } satisfies BetterAuthPlugin;
};
