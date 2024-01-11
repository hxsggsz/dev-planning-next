import { Card } from "./card";
import { fibbonacci } from "@/utils/fibbonacci";
import { useFibboStore } from "@/stores/useFibboStore";

interface ICardBoard {
  activeFibbo: string;
  updateFibbonnacci: (fibbo: string) => void;
}

export function CardBoard(props: ICardBoard) {

  function updateFibbo(fibbo: string) {
    props.updateFibbonnacci(fibbo);
  }

  return (
    <ul className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-2  px-2">
      {fibbonacci.map((number) => (
        <li key={number}>
          <Card
            activeFibbo={props.activeFibbo}
            handleClick={updateFibbo}
            fibbo={number}
          />
        </li>
      ))}
    </ul>
  );
}
