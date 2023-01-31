import React, { createContext, useContext, useState, useRef, useEffect } from "react";

const StateContext = createContext();

// const initialState = {
//   userProfile: false,
// };

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [userExpenses, setUserExpenses] = useState([]);
  const [userIncomes, setUserIncomes] = useState([]);
  const [userSavings, setUserSavings] = useState([]);
  // const handleChange = (event) => {
  //   setValues({ ...values, [event.target.name]: event.target.value });
  // };

  useEffect(() => {
    const themeMode = localStorage.getItem("themeMode");
    const colorMode = localStorage.getItem("colorMode");

    if (themeMode) {
      setCurrentMode(themeMode);
    }

    if (colorMode) {
      setCurrentColor(colorMode);
    }
  }, []);

  const setMode = (e) => {
    setCurrentMode(e.target.value);

    localStorage.setItem("themeMode", e.target.value);

    setThemeSettings(false);
  };

  const setColor = (color) => {
    setCurrentColor(color);

    localStorage.setItem("colorMode", color);

    setThemeSettings(false);
  };

  const resetMode = (mode) => {
    setCurrentMode(mode);

    localStorage.setItem("themeMode", mode);

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
        // initialState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
