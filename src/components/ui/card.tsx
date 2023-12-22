import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface ICard {
  fibbo: string;
  activeFibbo: string;
  handleClick: (fibbo: string) => void;
  className?: string | undefined;
  cancelAnimation?: boolean;
}
export function Card(props: ICard) {
  return (
    <motion.button
      data-active={props.activeFibbo === props.fibbo}
      onClick={() => props.handleClick(props.fibbo)}
      whileHover={props.cancelAnimation ? {} : { scale: 1.2, y: -12 }}
      transition={{ type: "just", duration: 0.2 }}
      className={twMerge(
        "invertTheme h-16 w-12 flex justify-center items-center cursor-pointer select-none rounded-lg border-2 border-main transition-all data-[active=true]:bg-main",
        props.className,
      )}
    >
      <h1
        data-active={props.activeFibbo === props.fibbo}
        className="text-center text-2xl font-bold text-main transition-all data-[active=true]:text-light"
      >
        {props.fibbo}
      </h1>
    </motion.button>
  );
}
