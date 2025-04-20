import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { now } from "d3-timer";

export const instanceRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(z.object({ completed: z.boolean() }))
    .query(async ({ ctx, input }) => {
      if (input.completed) {
        return ctx.db.instanceTemplate.findMany({
          include: {
            template: true,
            createdBy: true,
          },
        });
      } else {
        return ctx.db.instanceTemplate.findMany({
          where: { status: "OPEN" },
          include: {
            template: true,
            createdBy: true,
          },
        });
      }
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
    .input(z.object({ templateId: z.number(), userId: z.string() }))
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
