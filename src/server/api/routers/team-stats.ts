import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

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

  findCounts: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const members = await ctx.db.teamMember.count({
        where: { teamId: input.id },
      });

      const templates = await ctx.db.template.count({
        where: { teamId: input.id },
      });

      const processes = await ctx.db.instanceTemplate.count({
        where: {
          AND: [{ teamId: input.id }, {status: "OPEN"}]
        },
      });

      return {
        members: members,
        templates: templates,
        processes: processes,
      }
    }),
});
