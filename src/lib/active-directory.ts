import type { AuthMethod } from "@prisma/client";
import { Client } from "ldapts";

export async function authorizeAD(
    authMethod: AuthMethod,
    userName: string,
    password: string,
) {
  if (authMethod.type != "AD") return false;
  if (!authMethod.baseDN) return false;

  const ldap = authMethod.securityType == "SSL" ? "ldaps" : "ldap";
  const url = ldap + "://" + authMethod.controllers;

  if (!authMethod.userName) return false;
  if (!authMethod.password) return false;

  const adminDN = "CN=" + authMethod.userName + "," + authMethod.baseDN;
  const adminPassword = authMethod.password;

  const client = new Client({
    url,
  });

  try {
    await client.bind(adminDN, adminPassword);

    const { searchEntries } = await client.search(authMethod.baseDN, {
      scope: "sub",
      filter: `(sAMAccountName=${userName})`,
    });

    if (searchEntries == null || searchEntries.length === 0) return false;

    const entry = searchEntries[0];
    if(!(entry)) return false;

    const userDN = entry.dn;
    try {
      await client.bind(userDN, password);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await client.unbind();
  }
}
