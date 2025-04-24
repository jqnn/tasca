import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const teamInvitesRouter = createTRPCRouter({
  findUsers: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.teamInvite.findMany({
        where: { userId: Number(input.id) },
        include: {
          team: true,
        },
      });
    }),

  findTeams: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.teamInvite.findMany({
        where: { teamId: Number(input.id) },
        include: {
          user: true,
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
      return ctx.db.teamInvite.create({
        data: {
          userId: input.userId,
          teamId: input.teamId,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.teamInvite.deleteMany({
        where: { id: input.id },
      });
    }),
});
