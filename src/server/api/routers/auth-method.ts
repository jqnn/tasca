import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { $Enums, AuthMethodType } from "@prisma/client";
import SecurityType = $Enums.SecurityType;

export const authMethodRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.authMethod.findMany();
  }),
  hasUsers: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const authMethod = await ctx.db.authMethod.findFirst({
        where: { id: input.id },
      });
      if (!authMethod) return false;
      const users = await ctx.db.user.findMany({
        where: { authMethodId: authMethod.id },
      });
      if (!users) return false;
      return users.length > 0;
    }),
  exists: publicProcedure
    .input(z.object({ description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.authMethod
        .findFirst({ where: { description: input.description } })
        .then((authMethod) => {
          return authMethod != null;
        });
    }),
  create: publicProcedure
    .input(
      z.object({
        description: z.string(),
        type: z.nativeEnum(AuthMethodType),
        controllers: z.string(),
        baseDN: z.string(),
        usersDN: z.string(),
        uidAttribute: z.string(),
        accountSuffix: z.string(),
        securityType: z.nativeEnum(SecurityType),
        port: z.number(),
        userName: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.authMethod.create({
        data: {
          description: input.description,
          type: input.type,
          controllers: input.controllers,
          baseDN: input.baseDN,
          usersDN: input.usersDN,
          uidAttribute: input.uidAttribute,
          accountSuffix: input.accountSuffix,
          securityType: input.securityType,
          port: input.port,
          userName: input.userName,
          password: input.password,
        },
      });
    }),
});
