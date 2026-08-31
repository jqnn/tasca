import z from "zod";

export const setupSchema = z.object({
  email: z.email(),
  name: z.string(),
  username: z.string(),
  password: z.string(),
});

export type SetupFormData = z.infer<typeof setupSchema>;
