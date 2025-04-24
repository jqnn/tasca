import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const teamInvitesRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.teamInvites.findMany({
        where: { userId: Number(input.id) },
        include: {
          team: true,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        teamId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.teamInvites.create({
        data: {
          userId: input.userId,
          teamId: input.teamId,
        },
      });
    }),
});
