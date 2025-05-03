import * as process from "node:process";

import { PrismaClient } from "@prisma/client";
import { sha256 } from "js-sha256";

const prisma = new PrismaClient();

async function reset() {
  console.log("[RESET] Resetting database");
  console.log("[RESET] Delete all users...");
  await prisma.user.deleteMany();
  console.log("[RESET] Delete all auth methods...");
  await prisma.authMethod.deleteMany();
  console.log("[RESET] Delete all teams...");
  await prisma.team.deleteMany();
}

async function createDemoUser(localAuthMethodId: number) {
  if (process.env.DEMO != "true") {
    return;
  }

  const demoPassword = process.env.DEMO_PASSWORD;
  const user = await prisma.user.findFirst({
    where: { userName: "demo" },
  });

  if (user) {
    if (!demoPassword) return;

    console.log("[SEED] Updating demo password.");
    await prisma.user.update({
      where: { userName: "demo" },
      data: { password: hashPassword(demoPassword) },
    });
    console.log("[SEED] Updated demo password.");

    return;
  }

  console.log("[SEED] Demo account doesn't exist, creating now...");
  if (!demoPassword) {
    console.error(
      "[SEED] Can't create demo account, set env variable DEMO_PASSWORD first.",
    );
    return;
  }

  const hashedPassword = hashPassword(demoPassword);
  await prisma.user.create({
    data: {
      userName: "demo",
      displayName: "Demo",
      password: hashedPassword,
      authMethodId: localAuthMethodId,
      role: "USER",
    },
  });
  console.log("[SEED] Created demo account.");
}

async function main() {
  if (process.env.DEMO == "true") {
    await reset();
  }

  console.log("[SEED] Starting seeding...");
  const exists = await prisma.authMethod.findFirst({
    where: { description: "local" },
  });

  if (exists) {
    console.log("[SEED] Default auth method already exists.");

    await createAdminUser(exists.id);
    await createDemoUser(exists.id);
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
  await createDemoUser(local.id);
}

async function createAdminUser(localAuthMethodId: number) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const user = await prisma.user.findFirst({
    where: { userName: "admin" },
  });

  if (user) {
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

  console.log("[SEED] Default admin account doesn't exist, creating now...");
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
