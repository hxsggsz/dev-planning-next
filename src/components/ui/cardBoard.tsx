import { Card } from "./card";
import { fibbonacci } from "@/utils/fibbonacci";
import { useFibboStore } from "@/stores/useFibboStore";

interface ICardBoard {
  updateFibbonnacci: (fibbo: string) => void;
}

export function CardBoard(props: ICardBoard) {
  const fibboStore = useFibboStore((state) => state);

  function updateFibbo(fibbo: string) {
    fibboStore.updateFibbo(fibbo);
    props.updateFibbonnacci(fibbo);
  }

  return (
    <ul className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-2  px-2">
      {fibbonacci.map((number) => (
        <li key={number}>
          <Card
            activeFibbo={fibboStore.fibbo}
            handleClick={updateFibbo}
            fibbo={number}
          />
        </li>
      ))}
    </ul>
  );
}
