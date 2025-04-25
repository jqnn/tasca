import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { subDays } from "date-fns";

export const teamStatsRouter = createTRPCRouter({
  findOpen: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const today = new Date();
      const fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 30);

      return ctx.db.instanceTemplate.groupBy({
        by: ["createdAt"],
        where: {
          AND: [{ teamId: input.id }, { createdAt: { gte: fromDate } }],
        },
        _count: true,
      });
    }),

  findClosed: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const today = new Date();
      const fromDate = new Date(today);
      fromDate.setDate(today.getDate() - 30);

      return ctx.db.instanceTemplate.groupBy({
        by: ["closedAt"],
        where: {
          AND: [
            { teamId: input.id },
            { closedAt: { not: null, gte: fromDate } },
          ],
        },
        _count: true,
      });
    }),
});
