import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany();
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
