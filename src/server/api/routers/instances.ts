import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { InstanceStatus } from "@prisma/client";

export const instanceRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({ teamId: z.number(), completed: z.boolean() }))
    .query(async ({ ctx, input }) => {
      const { teamId } = input;

      const where = input.completed
        ? { teamId }
        : { AND: [{ teamId }, { status: "OPEN" as const }] };

      return ctx.db.instanceTemplate.findMany({
        where,
        include: {
          template: true,
          createdBy: true,
          InstanceField: {
            include: {
              field: true,
            },
          },
        },
      });
    }),

  find: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.instanceTemplate.findUnique({
        where: { id: input.id },
        include: {
          template: true,
          InstanceField: {
            include: {
              field: true,
            },
          },
          InstanceTask: {
            include: {
              task: true,
            },
          },
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
        templateId: z.number(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.db.template.findUnique({
        where: { id: input.templateId },
        include: {
          TemplateField: true,
          TemplateTask: true,
        },
      });

      if (!template) return null;
      const instance = await ctx.db.instanceTemplate.create({
        data: {
          teamId: input.teamId,
          templateId: input.templateId,
          createdById: Number(input.userId),
        },
      });

      if (!instance) return null;
      for (const field of template.TemplateField) {
        await ctx.db.instanceField.create({
          data: {
            fieldId: field.id,
            instanceId: instance.id,
          },
        });
      }

      for (const task of template.TemplateTask) {
        await ctx.db.instanceTask.create({
          data: {
            taskId: task.id,
            instanceId: instance.id,
          },
        });
      }

      return instance;
    }),

  updateInstanceState: publicProcedure
    .input(z.object({ id: z.number(), value: z.nativeEnum(InstanceStatus) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.instanceTemplate.update({
        where: { id: input.id },
        data: { status: input.value, closedAt: new Date() },
      });
    }),

  updateValue: publicProcedure
    .input(z.object({ id: z.number(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.instanceField.update({
        where: { id: input.id },
        data: { value: input.value },
      });
    }),

  updateState: publicProcedure
    .input(z.object({ id: z.number(), value: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.instanceTask.update({
        where: { id: input.id },
        data: { status: input.value ? "COMPLETED" : "OPEN" },
      });
    }),
});
