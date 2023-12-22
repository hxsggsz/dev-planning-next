import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const roomRouter = createTRPCRouter({
  createRoom: publicProcedure
    .input(
      z.object({
        id: z.string().cuid(),
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
    .input(z.object({ id: z.string().cuid() }))
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
    .input(z.object({ roomId: z.string().cuid(), userId: z.string().cuid() }))
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
        roomId: z.string().cuid(),
        userToRemoveId: z.string().cuid(),
        userAdminId: z.string().cuid(),
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

  changeFibboUserRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string().cuid(),
        userId: z.string().cuid(),
        fibbo: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        data: {
          fibbonacci: input.fibbo,
        },
        where: {
          id: input.userId,
          roomId: input.roomId,
        },
      });
    }),

  resetFibboRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const roomUsers = await ctx.db.room.findUnique({
        where: {
          id: input.roomId,
        },
        include: {
          users: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });
      console.log(roomUsers);

      if (!roomUsers) {
        throw new TRPCError({
          message: "Room not found",
          code: "NOT_FOUND",
        });
      }

      const usersId = roomUsers.users.map((user) => user.id);

      console.log(usersId);
      return await ctx.db.user.updateMany({
        where: {
          id: { in: usersId },
        },
        data: {
          fibbonacci: "",
        },
      });
    }),
});
