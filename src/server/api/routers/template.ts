import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const templateRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.template.findMany();
  }),

  exists: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.template
        .findFirst({ where: { name: input.name } })
        .then((template) => {
          return template != null;
        });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.template.create({
        data: {
          name: input.name,
          description: input.description ?? null,
          createdById: Number(input.userId),
        },
      });
    }),
});
