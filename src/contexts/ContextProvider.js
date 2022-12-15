import React, { createContext, useContext, useState, useRef } from "react";

const StateContext = createContext();

const initialState = {
  userProfile: false,
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState("#03C9D7");
  const [currentMode, setCurrentMode] = useState("Light");
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);

  const [expense, setExpense] = useState({
    transaction: "",
    calendar: "",
    category: "",
    amount: "",
    description: "",
  });

  const [income, setIncome] = useState({
    transaction: "",
    calendar: "",
    category: "",
    amount: "",
    description: "",
  });

  // const handleChange = (event) => {
  //   setValues({ ...values, [event.target.name]: event.target.value });
  // };

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

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  return (
    <StateContext.Provider
      value={{
        income,
        setIncome,
        expense,
        setExpense,
        activeMenu,
        setActiveMenu,
        isClicked,
        setIsClicked,
        handleClick,
        screenSize,
        setScreenSize,
        currentColor,
        currentMode,
        themeSettings,
        setThemeSettings,
        setMode,
        setColor,
        initialState,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
