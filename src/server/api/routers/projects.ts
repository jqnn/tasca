import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      include: {
        ProjectMember: true,
        createdBy: true,
      },
    });
  }),

  find: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findUnique({
        where: { id: input.id },
        include: {
          createdBy: true,
          ProjectMember: true,
        },
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
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description,
          createdById: Number(input.userId),
        },
      });

      if (!project) return null;
      const user = await ctx.db.projectMember.create({
        data: {
          userId: project.createdById,
          projectId: project.id,
          role: "OWNER",
        },
      });

      if (!user) return null;
      return project;
    }),
});
