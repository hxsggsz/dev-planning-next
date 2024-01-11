import { ChevronsRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Person } from "./person";
import { Skeleton } from "./skeleton";
import { Card } from "./card";

interface INavbar {
  removeUser: (id: string) => void;
  isAdmin: boolean;
  isFibboReveal: boolean;
  list:
    | {
        id: string;
        name: string;
        createdAt: Date;
        fibbonacci: string;
        role: string;
        roomId: string | null;
      }[]
    | undefined;
}

export function Navbar(props: INavbar) {
  const [open, setOpen] = useState(true);

  const renderSkeleton = () => (
    <>
      <div className="flex items-center gap-1 py-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center gap-1 py-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center gap-1 py-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="flex items-center gap-1 py-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
    </>
  );

  const renderPersonList = () => {
    const userId = typeof window !== "undefined" && localStorage.getItem("@me");
    return props?.list?.map((person) => (
      <li
        className="flex items-center justify-between overflow-hidden p-2"
        key={person.id}
      >
        <Person
          fibbo={person.fibbonacci}
          name={person.id === userId ? "Me" : person.name}
        />
        <div className="flex gap-2">
          {open && (
            <Card
              cancelAnimation
              className="h-12 w-10 cursor-default"
              fibbo={
                person.fibbonacci && props.isFibboReveal
                  ? person.fibbonacci
                  : person.fibbonacci && !props.isFibboReveal
                    ? "🫡"
                    : "🤔"
              }
              activeFibbo={""}
              //eslint-disable-next-line @typescript-eslint/no-empty-function
              handleClick={() => {}}
            />
          )}
          {props.isAdmin && person.id !== userId && open && (
            <button onClick={() => props.removeUser(person.id)}>
              <Trash2 className="text-main transition-all hover:fill-main" />
            </button>
          )}
        </div>
      </li>
    ));
  };

  return (
    <motion.nav
      animate={{ minWidth: open ? "250px" : "40px" }}
      data-open={open}
      className="invertTheme min-h-screen w-20 overflow-hidden px-2"
    >
      <header className="flex items-center justify-between overflow-hidden text-ellipsis ">
        {/* eslint-disable-next-line tailwindcss/classnames-order */}
        <h1 className="m-0 truncate p-0 text-3xl font-bold text-main">
          Dev Planning
        </h1>{" "}
        <motion.button
          animate={{ rotate: open ? 180 : 0 }}
          onClick={() => setOpen((prev) => !prev)}
        >
          <ChevronsRight size={36} className="text-main" />
        </motion.button>
      </header>

      <ul className="max-h-[calc(100vh-40px)] overflow-y-auto scrollbar scrollbar-track-inherit scrollbar-thumb-main scrollbar-thumb-rounded-lg scrollbar-w-2">
        {props.list ? renderPersonList() : renderSkeleton()}
      </ul>
    </motion.nav>
  );
}
