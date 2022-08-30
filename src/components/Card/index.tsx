import { ReactNode } from "react";

interface CardProps {
  title: string;
  count: ReactNode;
  classNameSubtitle?: string;
}

export function Card({ count, title, classNameSubtitle = "" }: CardProps) {
  return (
    <div className="h-[248px] hover:border-2 p-6 w-[410px] shadow-2xl flex flex-col border border-black/20 rounded-3xl  text-lg">
      <h1 className="text-base font-bold ">{title}</h1>
      <div className={`${classNameSubtitle} text-6xl m-auto`}>{count}</div>
    </div>
  );
}
