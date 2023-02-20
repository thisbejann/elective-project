import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { json } from "react-router-dom";

const StateContext = createContext();

// const initialState = {
//   userProfile: false,
// };

export const ContextProvider = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [userExpenses, setUserExpenses] = useState([]);
  const [userIncomes, setUserIncomes] = useState([]);
  const [userSavings, setUserSavings] = useState([]);

  useEffect(() => {
    const themeMode = localStorage.getItem("themeMode");
    const colorMode = localStorage.getItem("colorMode");

    if (user && themeMode) {
      setCurrentMode(themeMode);
    }
    if (user && colorMode) {
      setCurrentColor(colorMode);
    }
  }, [user]);

  const setMode = (e) => {
    setCurrentMode(e.target.value);

    localStorage.setItem("themeMode", e.target.value);

    setThemeSettings(false);
  };

  const resetMode = (mode) => {
    setCurrentMode(mode);

    localStorage.setItem("resetThemeMode", mode);
  };

  const getMode = (user) => {
    setCurrentMode("Light"), setCurrentColor("#03C9D7");
    const userPref = localStorage.getItem("userData");
    const userPrefData = JSON.parse(userPref);
    if (userPref && userPref !== null) {
      try {
        if (userPrefData.length !== undefined && userPrefData.length > 0) {
          const prefs = userPrefData.find((item) => item.userId === user.uid);
          if (!prefs.userMode || prefs.userMode === null) return null;
          setCurrentMode(prefs.userMode);
          setCurrentColor(prefs.userColor);
        }
      } catch (e) {
        console.log(e.message);
      }
    }
    return null;
  };

  const setColor = (color) => {
    setCurrentColor(color);

    localStorage.setItem("colorMode", color);

    setThemeSettings(false);
  };

  // const handleClick = (clicked) => setIsClicked({ userProfile: !clicked });

  return (
    <StateContext.Provider
      value={{
        activeMenu,
        setActiveMenu,
        isClicked,
        setIsClicked,
        // handleClick,
        screenSize,
        setScreenSize,
        currentColor,
        currentMode,
        themeSettings,
        setThemeSettings,
        setMode,
        setColor,
        userExpenses,
        setUserExpenses,
        userIncomes,
        setUserIncomes,
        userSavings,
        setUserSavings,
        resetMode,
        getMode,
        // initialState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
