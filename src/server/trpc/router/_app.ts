import { router } from "../trpc";
import { plansRouter } from "./plans";

export const appRouter = router({
  plans: plansRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
