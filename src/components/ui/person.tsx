import { useMemo } from "react";

interface IPerson {
  name: string;
  fibbo: string;
}
export function Person(props: IPerson) {
  const getInitialLetter = useMemo(() => {
    return props.name
      .split(" ")
      .map((letters) => letters[0]!.toLocaleUpperCase());
  }, [props.name]);

  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <div className="flex min-h-8 min-w-8 items-center justify-center rounded-full bg-main text-light">
        {getInitialLetter[0]}
      </div>
      <p className="truncate font-semibold text-main">{props.name}</p>
    </div>
  );
}
