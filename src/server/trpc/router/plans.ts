import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "../../db/client";
import bcyrpt from "bcrypt";

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
            slug: true,
            title: true,
            startDate: true,
            endDate: true,
            createdAt: true,
            member: {
              select: {
                availableTimes: true,
                name: true,
                id: true,
              },
            },
          },
        });
      } catch (e) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        return await prisma.plan.findFirstOrThrow({
          where: {
            id: input.id,
          },
          select: {
            id: true,
            slug: true,
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
  getMember: publicProcedure
    .input(z.object({ name: z.string(), planId: z.string() }))
    .query(async ({ input }) => {
      return await prisma.member.findFirst({
        where: {
          name: input.name,
          planId: input.planId,
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
      // TODO: create member and add to plan
      let password = undefined;
      if (input.password) {
        password = await bcyrpt.hash(input.password, 10);
      }
      return await prisma.member.create({
        data: {
          planId: input.planId,
          availableTimes: input.dates,
          name: input.name,
          password: password,
        },
      });
      // await prisma.plan.update({
      //   where: { id: input.planId },
      //   data: {
      //     member: {
      //       create: [
      //         {
      //           name: input.name,
      //           availableTimes: input.dates,
      //           password: password,
      //         },
      //       ],
      //     },
      //   },
      // });
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
      let authed = true;
      if (member.password) {
        authed = await bcyrpt.compare(input.password ?? "", member.password);
      }
      if (!authed) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      await prisma.member.update({
        where: { id: input.memberId },
        data: {
          availableTimes: input.dates,
        },
      });
    }),
});
