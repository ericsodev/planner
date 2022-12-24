import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db/client";

import { router, publicProcedure } from "../trpc";

export const plansRouter = router({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        return await prisma.plan.findFirstOrThrow({
          where: {
            slug: input.slug,
          },
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        });
      } catch (e) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),
  create: publicProcedure
    .input(
      z.object({ title: z.string(), startDate: z.date(), endDate: z.date() })
    )
    .mutation(async ({ input }) => {
      return await prisma.plan.create({
        data: {
          title: input.title,
          startDate: input.startDate,
          endDate: input.endDate,
        },
      });
    }),
  addMember: publicProcedure
    .input(
      z.object({
        planId: z.string(),
        name: z.string(),
        password: z.string().optional(),
        dates: z.array(z.date()),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.plan.findFirst({ where: { id: input.planId } });
      // TODO: create member and add to plan
    }),
  changeAvailability: publicProcedure
    .input(
      z.object({
        planId: z.string(),
        memberId: z.string(),
        password: z.string().optional(),
        dates: z.array(z.date()),
      })
    )
    .mutation(async ({ input }) => {
      const member = await prisma.member.findFirst({
        where: { id: input.memberId, planId: input.planId },
        select: { password: true },
      });
      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }
      //   TODO: add password check with bcrypt
      await prisma.member.update({ where: { id: input.memberId }, data: {} });
    }),
});
