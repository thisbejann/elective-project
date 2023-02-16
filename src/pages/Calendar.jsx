import React, { useEffect } from "react";

import { scheduleData } from "../data/dummy";
import { Header } from "../components";

import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const getData = async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Calendar" />
      {/* <ScheduleComponent
        height="650px"
        eventSettings={{ dataSource: scheduleData }}
        selectedDate={new Date(2021, 0, 10)}
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent> */}
    </div>
  );
};

export default Calendar;
