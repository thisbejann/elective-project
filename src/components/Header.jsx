import React from "react";

import { useStateContext } from "../contexts/ContextProvider";

const Header = ({ category, title }) => {
  return (
    <div className="mb-10 ml-3 lg:ml-0 lg:mb-0 ">
      <p className="text-gray-400 dark:text-white">{category}</p>
      <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
        {title}
      </p>
    </div>
  );
};

export default Header;
