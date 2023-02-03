import React, { useEffect, useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

import { Button } from "./";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../data/avatar.jpg";

import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { updateDates } from "@syncfusion/ej2/gantt";

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

  // useEffect(() => {
  //   if (loading) return;
  //   if (!user) return;
  //   sendData();
  // }, []);

  return (
    <div className="nav-item shadow-md absolute right-2/4 translate-x-2/4 sm:right-1 sm:translate-x-0 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="gray-100"
          darkbgHoverColor="secondary-dark-bg"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img className="rounded-full h-24 w-24" src={user.photoURL} alt="user-profile" />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {user.displayName} </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400"> {user.email} </p>
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
          className={` p-3 w-full hover:drop-shadow-xl`}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
