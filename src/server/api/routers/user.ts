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

  countAuthMethodUsers: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.count({ where: { authMethodId: input.id } });
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
      const project = await ctx.db.project.create({
        data: {
          name: input.userName,
          createdById: Number(user.id),
          personal: true,
        },
      });

      if (!project) return null;
      const projectUser = await ctx.db.projectMember.create({
        data: {
          userId: project.createdById,
          projectId: project.id,
          role: "OWNER",
        },
      });

      if (!projectUser) return null;
      return user;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.project.deleteMany({
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
});
