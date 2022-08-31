import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
export function SideNav() {
  const router = useRouter();
  const [shouldSlide, setShouldSlide] = useState(false);
  const currentRoute = router.pathname;

  const naviOptions = [
    {
      label: "",
      icon: "/images/nav/home.svg",
    },
    {
      label: "Campus",
      icon: "/images/nav/nav.svg",
    },
    {
      label: "Students",
      icon: "/images/nav/book.png",
    },
    {
      label: "Matriculas",
      icon: "/images/nav/enroll.png",
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

  const handleRoute = (route: string) => {
    const link = route.toLocaleLowerCase();
    return router.push(`/${link}`);
  };
  return (
    <nav
      onMouseLeave={() => handleMouseLeave()}
      onMouseEnter={(e) => handleClick(e)}
      className={`flex flex-col ${
        shouldSlide && "translate-x-[50%]"
      } gap-y-16 rounded-[100px] items-center justify-center h-[610px] absolute -left-[40px] transition-all translate-y-[25%]  p-7 bg-[#124845]`}
    >
      {naviOptions.map((option) => (
        <button
          onClick={() => handleRoute(option.label)}
          className={`${
            currentRoute === `/${option.label.toLocaleLowerCase()}`
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
