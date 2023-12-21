import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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
      await ctx.db.room.findUnique({
        where: {
          id: input.id,
        },
      });

      return;
    }),
});
