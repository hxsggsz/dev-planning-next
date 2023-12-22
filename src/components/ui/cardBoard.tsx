import { useState } from "react";
import { Card } from "./card";

const fibbonacci = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, "?"];

export function CardBoard() {
  const [fibbo, setFibbo] = useState<string | number>("");
  function handlea(fibbo: string | number) {
    console.log(fibbo);
    setFibbo(fibbo);
  }
  return (
    <ul className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-2 px-2 max-[930px]:fixed max-[930px]:blur-sm">
      {fibbonacci.map((number) => (
        <li key={number}>
          <Card activeFibbo={fibbo} handleClick={handlea} fibbo={number} />
        </li>
      ))}
    </ul>
  );
}
