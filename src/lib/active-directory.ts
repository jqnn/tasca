import type { AuthMethod } from "@prisma/client";
import { Client } from "ldapts"
import { escapeLDAPSearchFilter } from "./utils";

export async function authorizeAD(
  authMethod: AuthMethod,
  userName: string,
  password: string,
) {
  if (
    authMethod.type !== "AD" ||
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
    timeout: 5000,
    connectTimeout: 3000,
  });

  try {
    await client.bind(adminUserName, adminPassword);

    const safeUser = escapeLDAPSearchFilter(userName);
    const upn = safeUser + authMethod.accountSuffix;
    const { searchEntries } = await client.search(authMethod.baseDN, {
      scope: "sub",
      filter: `(sAMAccountName=${upn})`,
    });

    if (searchEntries == null || searchEntries.length === 0) return false;

    const entry = searchEntries[0];
    if (!entry) return false;

    const userDN = entry.dn;
    try {
      await client.bind(userDN, password);
      return true;
    } catch (error) {
      console.error(`[AD] Error while binding User ${userName} to ${url}`);
      console.error(error);
      return false;
    }
  } catch (error) {
    console.error(`[AD] Error while binding Admin-User ${adminUserName} to ${url}`);
    console.error(error);
    return false;
  } finally {
    await client.unbind();
  }
}
