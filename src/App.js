import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import { Dashboard, Expenses, Calendar, Income, Savings, Login } from "./pages";

import { useStateContext } from "./contexts/ContextProvider";

import { auth } from "./utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import "./App.css";

const App = () => {
  const { currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } =
    useStateContext();

  const [user, loading] = useAuthState(auth);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          {user && (
            <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
              <TooltipComponent content="Settings" position="TopCenter">
                <button
                  type="button"
                  className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
                  style={{ background: currentColor, borderRadius: "50%" }}
                  onClick={() => setThemeSettings(true)}
                >
                  <FiSettings />
                </button>
              </TooltipComponent>
            </div>
          )}

          {user && activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
              user && activeMenu ? "md:ml-72" : "flex-2"
            }`}
          >
            {user && (
              <div className="fixed md:static  bg-main-bg dark:bg-main-dark-bg p-2  w-full">
                <Navbar />
              </div>
            )}

            <div>
              {themeSettings && <ThemeSettings />}

              <Routes>
                {/* Dashboard */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* Pages */}
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/income" element={<Income />} />
                <Route path="/savings" element={<Savings />} />

                {/* Apps */}
                <Route path="/calendar" element={<Calendar />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
