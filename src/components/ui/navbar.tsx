import { ChevronsRight, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Person } from "./person";
import { Skeleton } from "./skeleton";

interface INavbar {
  removeUser: (id: string) => void;
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
    <div className="flex items-center gap-1">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  );

  const renderPersonList = () => {
    const userId = localStorage.getItem("@me");
    return props?.list?.map((person) => (
      <li className="flex items-center p-2" key={person.id}>
        <Person name={person.id === userId ? "Me" : person.name} />
        <button onClick={() => props.removeUser(person.id)}>
          <Trash2 />
        </button>
      </li>
    ));
  };

  return (
    <motion.nav
      animate={{ minWidth: open ? "250px" : "120px" }}
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

      <ul>{props?.list ? renderPersonList() : renderSkeleton()}</ul>
    </motion.nav>
  );
}
