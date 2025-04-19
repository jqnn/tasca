import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { FieldType } from "@prisma/client";

export const templateFieldRouter = createTRPCRouter({
  findAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.templateField.findMany();
  }),

  updateOrder: publicProcedure
    .input(
      z.object({
        templateId: z.number(),
        fields: z.array(
          z.object({
            id: z.number(),
            order: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let order = 1;

      for (const field of input.fields) {
        await ctx.db.templateField.update({
          where: { id: field.id },
          data: {
            order: order,
          },
        });
        order++;
      }
    }),

  create: publicProcedure
    .input(
      z.object({
        label: z.string(),
        placeHolder: z.string().nullable(),
        fieldType: z.nativeEnum(FieldType),
        order: z.number(),
        templateId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.templateField.create({
        data: {
          label: input.label,
          placeHolder: input.placeHolder,
          order: input.order,
          templateId: input.templateId,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.templateField.delete({ where: { id: input.id } });
    }),
});
