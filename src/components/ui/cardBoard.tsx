import { Card } from "./card";
import { fibbonacci } from "@/utils/fibbonacci";
import { useFibboStore } from "@/stores/useFibboStore";

interface ICardBoard {
  updateFibbonnacci: (fibbo: string) => void;
}

export function CardBoard(props: ICardBoard) {
  const updateFibboStore = useFibboStore((state) => state.updateFibbo);
  const fibbo = useFibboStore((state) => state.fibbo);

  function updateFibbo(fibbo: string) {
    updateFibboStore(fibbo);
    props.updateFibbonnacci(fibbo);
  }

  return (
    <div className="bg-blue-900">
      <ul className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-2 px-2 max-[930px]:fixed ">
        {fibbonacci.map((number) => (
          <li key={number}>
            <Card
              activeFibbo={fibbo}
              handleClick={updateFibbo}
              fibbo={number}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
