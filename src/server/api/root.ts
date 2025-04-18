import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { authMethodRouter } from "~/server/api/routers/auth-method";
import { projectRouter } from "~/server/api/routers/projects";
import { templateRouter } from "~/server/api/routers/template";
import { templateTaskRouter } from "~/server/api/routers/template-task";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  authMethod: authMethodRouter,
  project: projectRouter,
  template: templateRouter,
  templateTask: templateTaskRouter,
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
