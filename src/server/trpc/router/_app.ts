import { router } from "../trpc";
import { exampleRouter } from "./example";
import { plansRouter } from "./plans";

export const appRouter = router({
  example: exampleRouter,
  plans: plansRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
