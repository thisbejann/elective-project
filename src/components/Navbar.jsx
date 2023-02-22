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
    className="relative text-xl rounded-full p-3 hover:bg-light-gray"
  >
    <span
      style={{ background: dotColor }}
      className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
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
    <div className="flex justify-between p-2 md:mx-6 relative">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div>
        <div
          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 hover:dark:bg-secondary-dark-bg rounded-lg"
          onClick={() => setIsClicked(!isClicked)}
        >
          <img src={user.photoURL} className="rounded-full w-8 h-8" />
          <p>
            <span className="text-gray-400 text-14">Hi, </span> {""}
            <span className="text-gray-400 font-bold ml-1 text-14">{user.displayName}</span>
          </p>
          <MdKeyboardArrowDown className="text-gray-400 text-14" />
        </div>

        {isClicked && <UserProfile />}
      </div>
    </div>
  );
};

export default Navbar;
