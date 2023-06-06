import React from "react";

const TeamProfile = ({ name, role, imageSrc, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-5 lg:py-0">
      <img className="h-40 w-40 rounded-full object-cover" src={imageSrc} alt="profile" />
      <p className="mt-2 text-lg font-semibold dark:text-white">{name}</p>
      <div className="flex flex-col items-center justify-center gap-2 px-3">
        <p className="text-sm text-gray-800 dark:text-white">{role}</p>
        {/* dummy description */}
        <p className="text-justify text-sm text-gray-800 dark:text-slate-300">{description}</p>
      </div>
    </div>
  );
};

export default TeamProfile;
