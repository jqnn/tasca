import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TeamRole } from "@prisma/client";

export const teamRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.teamMember.findMany({
        where: { userId: Number(input.id) },
        include: {
          team: {
            include: {
              createdBy: true,
              TeamMember: true,
            },
          },
        },
      });
    }),

  find: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.team.findUnique({
        where: { id: input.id },
        include: {
          createdBy: true,
          TeamMember: true,
        },
      });
    }),

  findMembers: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.teamMember.findMany({
        where: { teamId: Number(input.id) },
      });
    }),

  removeMember: publicProcedure
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

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.team.create({
        data: {
          name: input.name,
          description: input.description,
          createdById: Number(input.userId),
        },
      });

      if (!project) return null;
      const user = await ctx.db.teamMember.create({
        data: {
          userId: project.createdById,
          teamId: project.id,
          role: "OWNER",
        },
      });

      if (!user) return null;
      return project;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.team.delete({ where: { id: input.id } });
    }),
});
