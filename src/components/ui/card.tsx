import { motion } from "framer-motion";

interface ICard {
  fibbo: string | number;
  activeFibbo: string | number;
  handleClick: (fibbo: string | number) => void;
}
export function Card(props: ICard) {
  return (
    <motion.button
      data-active={props.activeFibbo === props.fibbo}
      onClick={() => props.handleClick(props.fibbo)}
      whileHover={{ scale: 1.2, y: -12 }}
      className="invertTheme relative z-50 flex h-16 w-12 cursor-pointer select-none items-center justify-center rounded-sm border-2 border-main transition-all hover:bg-light/90 data-[active=true]:bg-main"
    >
      <h1
        data-active={props.activeFibbo === props.fibbo}
        className="text-2xl font-bold text-main transition-all data-[active=true]:text-light"
      >
        {props.fibbo}
      </h1>
    </motion.button>
  );
}
