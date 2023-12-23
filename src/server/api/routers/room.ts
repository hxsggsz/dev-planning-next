import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const roomRouter = createTRPCRouter({
  createRoom: publicProcedure
    .input(
      z.object({
        id: z.string(),
        roomName: z.string().min(5).max(30),
        isPublic: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.room.create({
        data: {
          name: input.roomName,
          isPublic: input.isPublic,
          users: {
            connect: { id: input.id },
          },
        },
      });
    }),

  searchRoom: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.room.findUnique({
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

      if (!room) {
        throw new TRPCError({
          message: "Not found this room",
          code: "NOT_FOUND",
        });
      }

      return room;
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

  changeFibboUserRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
        userId: z.string(),
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
        roomId: z.string(),
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

      if (!roomUsers) {
        throw new TRPCError({
          message: "Room not found",
          code: "NOT_FOUND",
        });
      }

      const usersId = roomUsers.users.map((user) => user.id);

      await ctx.db.room.update({
        where: {
          id: input.roomId,
        },
        data: {
          isReveal: false,
        },
      });

      return await ctx.db.user.updateMany({
        where: {
          id: { in: usersId },
        },
        data: {
          fibbonacci: "",
        },
      });
    }),

  changePublicRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
        isPublic: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.room.update({
        where: {
          id: input.roomId,
        },
        data: {
          isPublic: input.isPublic,
        },
      });
    }),

  revealFibboRoom: publicProcedure
    .input(
      z.object({
        roomId: z.string(),
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

      if (!roomUsers) {
        throw new TRPCError({
          message: "Room not found",
          code: "NOT_FOUND",
        });
      }

      const usersId = roomUsers.users.map((user) => user.id);

      const users = await ctx.db.user.findMany({
        where: {
          id: { in: usersId },
        },
      });
      const fibboValuesGroup: number[] = [];

      users.map((user) => {
        const fibboValues = user.fibbonacci;
        const fibboNumber = Number(fibboValues);

        if (fibboNumber) {
          fibboValuesGroup.push(fibboNumber);
        }
      });

      const sumFibbo = fibboValuesGroup.reduce((accumulator, currentNumber) => {
        return accumulator + currentNumber;
      }, 0);

      const averageFibbo = Math.round(sumFibbo / fibboValuesGroup.length);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      function fibonacci(number: number) {
        if (number <= 1) {
          return number;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return fibonacci(number - 1) + fibonacci(number - 2);
      }

      function nearestNumber(number: number) {
        // Encontre o índice do maior número de Fibonacci menor ou igual ao número fornecido.
        let index = 0;
        let fibonacciNumber = 0;
        while (fibonacciNumber < number) {
          index++;
          fibonacciNumber = fibonacci(index);
        }

        // Se o número fornecido for igual ao número de Fibonacci, retorne-o.
        if (fibonacciNumber === number) {
          return number;
        }

        // Se o número fornecido for menor que o número de Fibonacci, retorne o número de Fibonacci.
        if (number < fibonacciNumber) {
          return fibonacciNumber;
        }

        // Caso contrário, retorne o número arredondado para cima.
        else {
          return fibonacciNumber + 1;
        }
      }

      const nextFibbonacci = nearestNumber(averageFibbo);

      await ctx.db.room.update({
        where: {
          id: input.roomId,
        },
        data: {
          isReveal: true,
        },
      });

      return await ctx.db.room.update({
        where: {
          id: input.roomId,
        },
        data: {
          fibboRoom: nextFibbonacci,
          averageRoom: averageFibbo,
        },
      });
    }),
});
