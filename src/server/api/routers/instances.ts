import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { InstanceStatus } from "@prisma/client";

export const instanceRouter = createTRPCRouter({
  findAll: publicProcedure
    .input(
      z.object({
        teamId: z.number(),
        completed: z.boolean(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { teamId } = input;

      const where = input.completed
        ? { teamId }
        : { AND: [{ teamId }, { status: "OPEN" as const }] };

      const instances = await ctx.db.instanceTemplate.findMany({
        where,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        skip: input.cursor ? 1 : 0,
        orderBy: { id: "asc" },
        include: {
          template: true,
          createdBy: true,
          InstanceField: {
            include: {
              field: true,
            },
          },
          InstanceTask: true,
        },
      });

      let nextCursor: typeof input.cursor | null = null;
      if (instances.length > input.limit) {
        nextCursor = instances.pop()!.id;
      }

      return {
        instances,
        nextCursor,
      };
    }),

  find: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.instanceTemplate.findUnique({
        where: { id: input.id },
        include: {
          template: true,
          Signature: true,
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

      if (template.needsSignature) {
        await ctx.db.signature.create({
          data: {
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

  updateSignature: publicProcedure
    .input(z.object({ id: z.number(), value: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.signature.update({
        where: { id: input.id },
        data: { signature: input.value },
      });
    }),
});
