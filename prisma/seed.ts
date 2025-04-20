import * as process from "node:process";

import { PrismaClient } from "@prisma/client";
import { sha256 } from "js-sha256";

const prisma = new PrismaClient();

async function main() {
  console.log("[SEED] Starting seeding...");
  const exists = await prisma.authMethod.findFirst({
    where: { description: "local" },
  });

  if (exists) {
    console.log("[SEED] Default auth method already exists.");
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("[SEED] Searching default admin account...");
    const user = await prisma.user.findFirst({
      where: { userName: "admin" },
    });

    if (!user) {
      await createAdminUser(exists.id);
      return;
    }

    if (!adminPassword) {
      return;
    }

    console.log("[SEED] Updating admin password.");
    await prisma.user.update({
      where: { userName: "admin" },
      data: { password: hashPassword(adminPassword) },
    });
    console.log("[SEED] Updated admin password.");
    return;
  }

  console.log("[SEED] Local auth method doesn't exist, creating now...");
  const local = await prisma.authMethod.create({
    data: {
      description: "local",
      type: "LOCAL",
    },
  });
  console.log("[SEED] Created local auth method.");

  await createAdminUser(local.id);
}

async function createAdminUser(localAuthMethodId: number) {
  console.log("[SEED] Default admin account doesn't exist, creating now...");
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error(
      "[SEED] Can't create admin account, set env variable ADMIN_PASSWORD first.",
    );
    return;
  }

  const hashedPassword = hashPassword(adminPassword);
  await prisma.user.create({
    data: {
      userName: "admin",
      displayName: "Administrator",
      password: hashedPassword,
      authMethodId: localAuthMethodId,
      role: "ADMINISTRATOR",
    },
  });
  console.log("[SEED] Created default admin account.");
}

function hashPassword(password: string) {
  return sha256(password);
}

main()
  .then()
  .catch((e) => {
    console.error(
      "[SEED] There was an unexpected error while seeding the database.",
    );
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    console.log("[SEED] Finished seeding database.");
  });
