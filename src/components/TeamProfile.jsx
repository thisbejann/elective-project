import React from "react";

const TeamProfile = ({ name, role, imageSrc, description }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-gray-200 p-5 shadow-sm dark:bg-main-dark-bg">
      <img className="h-40 w-40 rounded-full object-cover" src={imageSrc} alt="profile" />
      <p className="mt-2 text-lg font-semibold dark:text-white">{name}</p>
      <div className="flex flex-col items-center justify-center gap-2 px-3">
        <p className="text-sm text-gray-800 dark:text-white">{role}</p>
        <p className="text-justify text-sm text-gray-800 dark:text-slate-300">{description}</p>
      </div>
    </div>
  );
};

export default TeamProfile;
