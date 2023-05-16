import React from "react";
import { Header } from "../components";

import { useStateContext } from "../contexts/ContextProvider";

const Team = () => {
  const { isClicked } = useStateContext();
  return (
    <div
      className={`m-2 mt-[5rem] rounded-3xl bg-white p-2 dark:bg-secondary-dark-bg md:m-10 md:p-10 ${
        isClicked ? "hidden sm:block" : ""
      }`}
    >
      <div className="mt-12 flex flex-col justify-between md:mt-3 lg:flex-row">
        <Header category="Page" title="Team" />
      </div>
    </div>
  );
};

export default Team;
