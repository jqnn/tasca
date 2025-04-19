import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { authMethodRouter } from "~/server/api/routers/auth-method";
import { templateRouter } from "~/server/api/routers/template";
import { templateTaskRouter } from "~/server/api/routers/template-task";
import { templateFieldRouter } from "~/server/api/routers/template-field";
import { instanceRouter } from "~/server/api/routers/instances";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  authMethod: authMethodRouter,
  template: templateRouter,
  templateTask: templateTaskRouter,
  templateField: templateFieldRouter,
  instance: instanceRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
