import Image from "next/image";
import { useState } from "react";
export function SideNav() {
  const [shouldSlide, setShouldSlide] = useState(false);
  const isSelected = "Home";
  const naviOptions = [
    {
      label: "Home",
      icon: "/images/nav/home.svg",
    },
    {
      label: "Campus",
      icon: "/images/nav/nav.svg",
    },
    {
      label: "Location",
      icon: "/images/nav/university.svg",
    },
    {
      label: "Students",
      icon: "/images/nav/book.svg",
    },
  ];
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShouldSlide(false);
    }, 500);
    return () => clearTimeout(timeout);
  };
  const handleClick = (e: any) => {
    setShouldSlide(true);
    e.stopPropagation();
  };

  return (
    <nav
      onMouseLeave={() => handleMouseLeave()}
      onMouseEnter={(e) => handleClick(e)}
      className={`flex flex-col ${
        shouldSlide && "left-[20px]"
      } gap-y-16 rounded-[100px] items-center justify-center h-[610px] absolute -left-[40px] transition-all translate-y-[25%]  p-7 bg-[#124845]`}
    >
      {naviOptions.map((option) => (
        <button
          className={`${
            isSelected === option.label
              ? "bg-[#0E3937]  hover:bg-[#0E3937]/50 "
              : ""
          } rounded-full p-4`}
          key={option.label}
        >
          <Image
            {...{
              src: `${option.icon}`,
              alt: `${option.label}`,
              width: "24px",
              height: "24px",
            }}
          />
        </button>
      ))}
    </nav>
  );
}
