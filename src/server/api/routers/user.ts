import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { Role } from "@prisma/client";
import { hashPassword } from "~/lib/utils";

export const userRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
  }),

  find: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({ where: { id: input.id } });
    }),

  exists: publicProcedure
    .input(z.object({ userName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user
        .findFirst({ where: { userName: input.userName } })
        .then((user) => {
          return user != null;
        });
    }),

  create: publicProcedure
    .input(
      z.object({
        userName: z.string(),
        displayName: z.string(),
        role: z.nativeEnum(Role),
        authMethod: z.number(),
        password: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.create({
        data: {
          userName: input.userName,
          displayName: input.displayName,
          role: input.role,
          authMethodId: input.authMethod,
          password: input.password && hashPassword(input.password),
        },
      });

      if (!user) return null;
      const team = await ctx.db.team.create({
        data: {
          name: input.userName,
          createdById: Number(user.id),
          personal: true,
        },
      });

      if (!team) return null;
      const teamMember = await ctx.db.teamMember.create({
        data: {
          userId: team.createdById ?? 0,
          teamId: team.id,
          role: "OWNER",
        },
      });

      if (!teamMember) return null;
      return user;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.team.deleteMany({
        where: {
          AND: [{ createdById: input.id }, { personal: true }],
        },
      });
      return ctx.db.user.deleteMany({ where: { id: input.id } });
    }),

  getRole: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user
        .findUnique({ where: { id: input.id } })
        .then((user) => {
          if (!user) return "USER";
          return user.role;
        });
    }),

  updateRole: publicProcedure
    .input(z.object({ id: z.number(), role: z.nativeEnum(Role) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: { id: input.id },
        data: { role: input.role },
      });
    }),
});
