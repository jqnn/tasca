import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { InstanceStatus } from "@prisma/client";

export const teamProjectsRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({ teamId: z.number(), completed: z.boolean() }))
    .query(async ({ ctx, input }) => {
      const { teamId } = input;

      const where = input.completed
        ? { teamId }
        : { AND: [{ teamId }, { status: "OPEN" as const }] };

      return ctx.db.project.findMany({
        where,
      });
    }),

  find: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.project.findUnique({
        where: { id: Number(input.id) },
        include: {
          ProjectTask: true,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        userId: z.string(),
        teamId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description,
          createdById: Number(input.userId),
          teamId: input.teamId,
        },
      });
    }),

  createTask: publicProcedure
    .input(
      z.object({
        task: z.string(),
        description: z.string(),
        userId: z.string(),
        projectId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.projectTask.create({
        data: {
          task: input.task,
          description: input.description,
          createdById: Number(input.userId),
          projectId: input.projectId,
        },
      });
    }),

  updateProjectState: publicProcedure
    .input(z.object({ id: z.number(), value: z.nativeEnum(InstanceStatus) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.update({
        where: { id: input.id },
        data: { status: input.value },
      });
    }),

  updateState: publicProcedure
    .input(z.object({ id: z.number(), value: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.projectTask.update({
        where: { id: input.id },
        data: { status: input.value ? "COMPLETED" : "OPEN" },
      });
    }),
});
