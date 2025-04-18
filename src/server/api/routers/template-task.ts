import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const templateTaskRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.templateTask.findMany();
  }),

  updateOrder: publicProcedure
    .input(
      z.object({
        templateId: z.number(),
        tasks: z.array(
          z.object({
            id: z.number(),
            order: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let order = 1;

      for (const task of input.tasks) {
        await ctx.db.templateTask.update({
          where: { id: task.id },
          data: {
            order: order,
          },
        });
        order++;
      }
    }),

  create: publicProcedure
    .input(
      z.object({
        task: z.string(),
        description: z.string(),
        order: z.number(),
        templateId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.templateTask.create({
        data: {
          task: input.task,
          description: input.description,
          order: input.order,
          templateId: input.templateId,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.templateTask.delete({ where: { id: input.id } });
    }),
});
