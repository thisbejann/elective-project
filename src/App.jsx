import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FiSettings } from "react-icons/fi";

import { Navbar, Sidebar, ThemeSettings } from "./components";
import { Dashboard, Expenses, Income, Savings, Login, Team } from "./pages";

import { useStateContext } from "./contexts/ContextProvider";

import { auth } from "./utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

const App = () => {
  const { currentMode, activeMenu, currentColor, themeSettings, setThemeSettings, userExpenses } =
    useStateContext();

  const [user, loading] = useAuthState(auth);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""}>
      <BrowserRouter>
        <ToastContainer limit={1} />
        <div className="relative flex dark:bg-main-dark-bg">
          {user && (
            <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
              <button
                type="button"
                className="p-3 text-3xl text-white hover:bg-light-gray hover:drop-shadow-xl"
                style={{ background: currentColor, borderRadius: "50%" }}
                onClick={() => setThemeSettings(true)}
              >
                <FiSettings />
              </button>
            </div>
          )}

          {user && activeMenu ? (
            <div className="sidebar fixed w-72 bg-white dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={`min-h-screen w-full bg-main-bg dark:bg-main-dark-bg ${
              user && activeMenu ? "md:ml-72" : "flex-2"
            }`}
          >
            {user && (
              <div className="fixed w-full  bg-main-bg p-2 dark:bg-main-dark-bg  md:static">
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
                <Route path="/ourteam" element={<Team />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
