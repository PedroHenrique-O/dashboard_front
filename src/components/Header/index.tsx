import Image from "next/image";
export function Header() {
  return (
    <header className="my-6 font-bold text-xl tracking-widest  text-white">
      <div className="flex justify-between items-center">
        <Image
          {...{
            alt: "Logo - IFPR",
            width: "221px",
            height: "63px",
            src: "/images/logo-ifpr.svg",
          }}
        />
        <nav className="text-sm gap-10 group flex mr-20">
          <span className=" hover:text-green-500 cursor-pointer ">home</span>
          <span className=" hover:text-green-500 cursor-pointer ">contact</span>
        </nav>
      </div>
    </header>
  );
}
