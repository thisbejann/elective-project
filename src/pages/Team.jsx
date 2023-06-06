import React from "react";
import { Header, TeamProfile } from "../components";

import { useStateContext } from "../contexts/ContextProvider";

const Team = () => {
  const { isClicked } = useStateContext();
  return (
    <div
      className={`m-2 mt-[5rem] h-full rounded-3xl bg-white p-2 dark:bg-secondary-dark-bg md:m-10 md:p-10 ${
        isClicked ? "hidden sm:block" : ""
      }`}
    >
      <div className="mt-12 flex flex-col justify-between md:mt-3 ">
        <Header category="Page" title="Team" />
        <div className="flex items-center justify-center rounded-3xl bg-white px-5 dark:bg-secondary-dark-bg md:m-10  md:p-10 lg:mt-[5rem] lg:px-[8rem]">
          {/* container for 3 column our team photo with description */}
          <div className="flex w-full flex-col justify-evenly gap-5 lg:flex-row">
            <TeamProfile
              name="Aubrey Gail"
              imageSrc="images/AMANTE, AUBREY GAIL A,.jpg"
              role="Project Manager"
              description="I'm Aubrey Gail A. Amante from Marikina City. A Computer Engineering student from Polytechnic University of the Philippines. I am utilizing my good analytical thinking and problem-solving abilities to create innovative solutions in computer engineering, tackling challenging problems in software development and system optimization."
            />
            <TeamProfile
              name="Jann Jaspher"
              imageSrc="images/SANTOS, JANN JASPHER V..jpg"
              role="Frontend Developer"
              description="Jann Jaspher is a passionate front-end web developer with expertise in HTML, CSS, and JavaScript. They excel at creating visually stunning user interfaces and collaborating with designers and back-end developers. With a keen eye for design and a commitment to delivering high-quality code, they are able to create dynamic, interactive, and user-friendly websites."
            />
            <TeamProfile
              name="Vince Allen"
              imageSrc="images/VERGEL DE DIOS, VINCE ALLEN C..jpg"
              role="Backend Developer"
              description="I'm Vince Vergel de Dios from Taytay, Rizal. A Computer Engineering student from Polytechnic University of the Philippines. I am acquiring the skills and knowledge required to be successful in my chosen field and contribute significantly to society through my academic endeavors."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
