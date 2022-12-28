import { TRPCError } from "@trpc/server";
import { string, z } from "zod";
import { prisma } from "../../db/client";
import bcyrpt from "bcrypt";

import { router, publicProcedure } from "../trpc";
import { generateJWT, verifyJWT } from "@/utils/jwt";

export const plansRouter = router({
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        return await prisma.plan.findFirst({
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
            updatedAt: true,
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
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
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
      const member = await prisma.member.create({
        data: {
          planId: input.planId,
          availableTimes: input.dates,
          name: input.name,
          password: password,
        },
      });
      const returnVal = {
        id: member.id,
        user: member.name,
        planId: member.planId,
        jwt: "",
      };
      if (input.password) returnVal.jwt = generateJWT(member.id);
      return returnVal;
    }),
  changeAvailability: publicProcedure
    .input(
      z.object({
        planId: z.string(),
        memberId: z.string(),
        dates: z.array(z.date()),
        jwt: z.string().optional(),
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
      if (member.password) {
        try {
          verifyJWT(input.jwt);
        } catch (e) {
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
      }

      await prisma.member.update({
        where: { id: input.memberId },
        data: {
          availableTimes: input.dates,
        },
      });
    }),
  authenticate: publicProcedure
    .input(
      z.object({
        user: z.string(),
        planId: z.string(),
        password: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const member = await prisma.member.findFirst({
        where: { planId: input.planId, name: input.user },
        select: {
          id: true,
          name: true,
          password: true,
          planId: true,
        },
      });
      if (!member) throw new TRPCError({ code: "NOT_FOUND" });
      if (!member.password && !input.password) {
        // no password
        return { id: member.id, user: member.name, planId: member.planId };
      } else if (
        member.password &&
        (await bcyrpt.compare(input.password ?? "", member.password))
      ) {
        // password matches
        return {
          id: member.id,
          user: member.name,
          jwt: generateJWT(member.id),
        };
      } else {
        // password does not match or user entered a password for a non-password account
        return { error: "login_failed" };
      }
    }),
});
