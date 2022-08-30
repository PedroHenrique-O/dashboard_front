interface CardProps {
  title: string;
  count: number;
}

export function Card({ count, title }: CardProps) {
  return (
    <div className="h-[248px] hover:border-2 p-6 w-[410px] shadow-2xl flex flex-col border border-black/20 rounded-3xl  text-lg">
      <h1 className="text-base font-bold ">{title}</h1>
      <div className="text-6xl m-auto ">{count}</div>
    </div>
  );
}
