import type { AuthMethod } from "@prisma/client";
import { Client } from "ldapts";
import { escapeLDAPSearchFilter } from "~/lib/utils";

export async function authorizeLDAP(
  authMethod: AuthMethod,
  userName: string,
  password: string,
) {
  if (
    authMethod.type !== "LDAP" ||
    !authMethod.baseDN ||
    !authMethod.userName ||
    !authMethod.password
  ) {
    return false;
  }

  const ldap = authMethod.securityType == "SSL" ? "ldaps" : "ldap";
  const url = `${ldap}://${authMethod.controllers}`;

  const adminUserName = authMethod.userName + authMethod.accountSuffix;
  const adminPassword = authMethod.password;

  const client = new Client({
    url,
  });

  try {
    await client.bind(adminUserName, adminPassword);

    const safeUser = escapeLDAPSearchFilter(userName);
    const { searchEntries } = await client.search(authMethod.baseDN, {
      scope: "sub",
      filter: `(${authMethod.uidAttribute}=${safeUser})`,
    });

    if (searchEntries == null || searchEntries.length === 0) {
      console.warn(`[LDAP] No search entries found for ${safeUser}.`);
      return false;
    }

    const entry = searchEntries[0];
    if (!entry) {
      console.warn(`[LDAP] No search entry found for ${safeUser}.`);
      return false;
    }

    const userDN = entry.dn;
    try {
      await client.bind(userDN, password);
      return true;
    } catch (error) {
      console.error(`[LDAP] Error while binding User ${userName} to ${url}`);
      console.error(error);
      return false;
    }
  } catch (error) {
    console.error(
      `[LDAP] Error while binding Admin-User ${adminUserName} to ${url}`,
    );
    console.error(error);
    return false;
  } finally {
    await client.unbind();
  }
}
