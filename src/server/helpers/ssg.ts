import { createServerSideHelpers } from "@trpc/react-query/server";
import { db } from "@/server/db";
import { appRouter } from "@/server/api/root";
import superjson from "superjson";

export const generateSSGHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { db },
    transformer: superjson, // optional - adds superjson serialization
  });
