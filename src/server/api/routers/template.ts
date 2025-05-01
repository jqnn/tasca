import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const templateRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({ teamId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.template.findMany({
        where: { teamId: input.teamId },
      });
    }),

  find: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.template.findUnique({
        where: { id: input.id },
        include: {
          TemplateTask: true,
          TemplateField: true,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
        name: z.string(),
        description: z.string().nullable(),
        userId: z.string(),
        signature: z.boolean()
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.template.create({
        data: {
          teamId: input.teamId,
          name: input.name,
          description: input.description ?? null,
          createdById: Number(input.userId),
          needsSignature: input.signature,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.template.delete({ where: { id: input.id } });
    }),
});
