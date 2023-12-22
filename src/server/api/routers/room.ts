import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { OnlyFibboNumbers, fibbonacci } from "@/utils/fibbonacci";

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

      if (!roomUsers) {
        throw new TRPCError({
          message: "Room not found",
          code: "NOT_FOUND",
        });
      }

      const usersId = roomUsers.users.map((user) => user.id);

      return await ctx.db.user.updateMany({
        where: {
          id: { in: usersId },
        },
        data: {
          fibbonacci: "",
        },
      });
    }),

  revealFibboRoom: publicProcedure
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

      const averageFibbo = sumFibbo / fibboValuesGroup.length;

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

      return {
        average: averageFibbo,
        fibbonacci: nextFibbonacci,
      };
    }),
});
