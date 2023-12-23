import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(5).max(30).toLowerCase(),
        role: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.create({
        data: {
          name: input.name,
          role: input.role,
        },
      });
    }),

  searchUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const findMe = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!findMe) {
        throw new TRPCError({
          message: "User not found",
          code: "NOT_FOUND",
        });
      }

      return findMe;
    }),
});
