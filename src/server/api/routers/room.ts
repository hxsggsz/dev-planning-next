import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const roomRouter = createTRPCRouter({
  createRoom: publicProcedure
    .input(
      z.object({
        id: z.string(),
        roomName: z.string().min(5).max(30),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.room.create({
        data: {
          name: input.roomName,
          users: {
            connect: { id: input.id },
          },
        },
      });
    }),

  searchRoom: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.room.findUnique({
        where: {
          id: input.id,
        },
        include: {
          users: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
    }),

  addUserRoom: publicProcedure
    .input(z.object({ roomId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.room.update({
        data: {
          users: {
            connect: { id: input.userId },
          },
        },
        where: {
          id: input.roomId,
        },
      });
    }),

  removeUserRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
        userToRemoveId: z.string(),
        userAdminId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pseudoAdminUser = await ctx.db.user.findUnique({
        where: {
          id: input.userAdminId,
        },
      });

      if (pseudoAdminUser && pseudoAdminUser.role !== "admin") {
        throw new TRPCError({
          message: "You are not authorized to do this action",
          code: "UNAUTHORIZED",
        });
      }
      return await ctx.db.user.delete({
        where: {
          id: input.userToRemoveId,
          roomId: input.roomId,
        },
      });
    }),
});
