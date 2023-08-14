import { useRef } from "react";
import classNames from "classnames";
import { useOnClickOutside } from "usehooks-ts";
import Link from "next/link";
import {
  HomeIcon,
  ShoppingCartIcon,
  BriefcaseIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

type Props = {
  open: boolean;
  setOpen(open: boolean): void;
};

function Sidebar({ open, setOpen }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const pathName = usePathname();

  useOnClickOutside(ref, (e) => {
    setOpen(false);
  });

  const routes = [
    { name: "Dashboard", path: "/", icon: <HomeIcon className="w-4 h-4" /> },
    {
      name: "Products",
      path: "/products",
      icon: <BriefcaseIcon className="w-4 h-4" />,
    },
    {
      name: "Carts",
      path: "/carts",
      icon: <ShoppingCartIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div
      className={classNames({
        "flex flex-col justify-between": true,
        "bg-indigo-700 text-zinc-50": true,
        "md:w-full md:sticky md:top-16 md:z-0 top-0 z-20 fixed": true,
        "md:h-[calc(100vh_-_64px)] h-full w-[300px]": true,
        "transition-transform .3s ease-in-out md:translate-x-0": true,
        "-translate-x-full ": !open,
      })}
      ref={ref}
    >
      <nav className="md:sticky top-0 md:top-16">
        <ul className="py-2 flex flex-col gap-2">
          {routes.map((el, idx) => (
            <Link href={el.path} key={idx}>
              <li
                className={classNames({
                  "text-indigo-100 hover:bg-indigo-900": true,
                  "flex gap-4 items-center ": true,
                  "transition-colors duration-300": true,
                  "rounded-md p-2 mx-2": true,
                  "bg-indigo-800": pathName === el.path,
                })}
              >
                {el.icon}
                {el.name}
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
