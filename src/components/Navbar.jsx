import React, { useEffect } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";

import { UserProfile } from ".";
import { useStateContext } from "../contexts/ContextProvider";

import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <button
    type="button"
    onClick={customFunc}
    style={{ color }}
    className="relative rounded-full p-3 text-xl hover:bg-light-gray"
  >
    <span
      style={{ background: dotColor }}
      className="absolute right-2 top-2 inline-flex h-2 w-2 rounded-full"
    />
    {icon}
  </button>
);

const Navbar = () => {
  const [user, loading] = useAuthState(auth);

  const {
    activeMenu,
    setActiveMenu,
    isClicked,
    setIsClicked,
    handleClick,
    screenSize,
    setScreenSize,
    currentColor,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="relative flex justify-between p-2 md:mx-6">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div>
        <div
          className="flex cursor-pointer items-center gap-2 rounded-lg p-1 hover:bg-gray-100 hover:dark:bg-secondary-dark-bg"
          onClick={() => setIsClicked(!isClicked)}
        >
          <img src={user.photoURL} className="h-8 w-8 rounded-full" />
          <p>
            <span className="text-14 text-gray-400">Hi, </span> {""}
            <span className="ml-1 text-14 font-bold text-gray-400">{user.displayName}</span>
          </p>
          <MdKeyboardArrowDown className="text-14 text-gray-400" />
        </div>

        {isClicked && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
