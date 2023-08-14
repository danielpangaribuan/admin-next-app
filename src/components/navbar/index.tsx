import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Link from "next/link";
type Props = {
  onMenuButtonClick(): void;
};
function Navbar(props: Props) {
  return (
    <nav
      className={classNames({
        "bg-white text-zinc-500": true,
        "flex items-center": true,
        "w-full fixed z-10 px-4 shadow-sm h-16": true,
      })}
    >
      <Link href={"/"} className="font-bold text-lg text-indigo-700">
        Admin App
      </Link>
      <div className="flex-grow"></div>
      <button className="md:hidden" onClick={props.onMenuButtonClick}>
        <Bars3Icon className="h-6 w-6" />
      </button>
    </nav>
  );
}
export default Navbar;
