import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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
});
