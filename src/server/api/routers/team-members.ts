import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TeamRole } from "@prisma/client";

export const teamMemberRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.teamMember.findMany({
        where: { teamId: Number(input.id) },
      });
    }),

  remove: publicProcedure
    .input(z.object({ userId: z.number(), teamId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.teamMember.deleteMany({
        where: {
          AND: [{ userId: input.userId }, { teamId: input.teamId }],
        },
      });
    }),

  updateRole: publicProcedure
    .input(
      z.object({
        userId: z.number(),
        teamId: z.number(),
        role: z.nativeEnum(TeamRole),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.teamMember.updateMany({
        where: {
          AND: [{ userId: input.userId }, { teamId: input.teamId }],
        },
        data: {
          role: input.role,
        },
      });
    }),

  isMember: publicProcedure
    .input(z.object({ userId: z.number(), teamId: z.number() }))
    .query(async ({ ctx, input }) => {
      return (
        (await ctx.db.teamMember.findUnique({
          where: {
            userId_teamId: {
              userId: input.userId,
              teamId: input.teamId,
            },
          },
        })) != null
      );
    }),

  isMemberMutation: publicProcedure
    .input(z.object({ userId: z.number(), teamId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return (
        (await ctx.db.teamMember.findUnique({
          where: {
            userId_teamId: {
              userId: input.userId,
              teamId: input.teamId,
            },
          },
        })) != null
      );
    }),

  getRole: publicProcedure
    .input(z.object({ userId: z.number(), teamId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.teamMember
        .findUnique({
          where: {
            userId_teamId: {
              userId: input.userId,
              teamId: input.teamId,
            },
          },
        })
        .then((member) => {
          if (!member) return null;
          return member.role;
        });
    }),
});
