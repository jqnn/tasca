import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { Role } from "@prisma/client";
import { hashPassword } from "~/lib/utils";

export const userRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
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
      return ctx.db.user.create({
        data: {
          userName: input.userName,
          displayName: input.displayName,
          role: input.role,
          authMethodId: input.authMethod,
          password: input.password && hashPassword(input.password),
        },
      });
    }),
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.deleteMany({ where: { id: input.id } });
    }),
  isAdmin: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user
        .findUnique({ where: { id: input.id } })
        .then((user) => {
          if (!user) return false;
          return user.role == "ADMINISTRATOR";
        });
    }),
});
