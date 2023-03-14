import React from "react";
import { MdOutlineCancel } from "react-icons/md";

import { Button } from "./";
import { useStateContext } from "../contexts/ContextProvider";

import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const UserProfile = () => {
  const { currentColor, resetMode, currentMode } = useStateContext();
  const { setIsClicked, initialState } = useStateContext();
  const [user, loading] = useAuthState(auth);

  const oldData = JSON.parse(localStorage.getItem("userData")) || [];

  const updateData = () => {
    // check if user already exists in local storage
    const userExists = oldData.find((data) => data.userId === user.uid);
    if (userExists) {
      // if user exists, update the data
      const updatedData = oldData.map((data) => {
        if (data.userId === user.uid) {
          return { userId: user.uid, userMode: currentMode, userColor: currentColor };
        }
        return data;
      });
      localStorage.setItem("userData", JSON.stringify(updatedData));
    } else {
      // if user doesn't exist, add the data
      const newData = [
        ...oldData,
        { userId: user.uid, userMode: currentMode, userColor: currentColor },
      ];
      localStorage.setItem("userData", JSON.stringify(newData));
    }
  };

  return (
    <div className="nav-item absolute right-2/4 top-16 w-96 translate-x-2/4 rounded-lg bg-white p-8 shadow-md dark:bg-[#42464D] sm:right-1 sm:translate-x-0">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="gray-100"
          darkbgHoverColor="secondary-dark-bg"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="border-color mt-6 flex items-center gap-5 border-b-1 pb-6">
        <img className="h-24 w-24 rounded-full" src={user.photoURL} alt="user-profile" />
        <div>
          <p className="text-xl font-semibold dark:text-gray-200"> {user.displayName} </p>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400"> {user.email} </p>
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={() => {
            auth.signOut();
            setIsClicked(initialState);
            resetMode("Light");
            updateData();
          }}
          type="button"
          style={{ backgroundColor: currentColor, color: "white", borderRadius: "10px" }}
          className={` w-full p-3 hover:drop-shadow-xl`}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
