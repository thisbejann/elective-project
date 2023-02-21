import React, { useEffect, useState, useMemo, useCallback } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { Stacked, Button, LineChart } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

import { auth, db } from "../utils/firebase";
import { collection, onSnapshot, query, where, orderBy, getDocs } from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { currentColor } = useStateContext();

  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [data, setData] = useState({ expenses: [], incomes: [] });

  const getTotalExpenses = useMemo(() => {
    return data.expenses.reduce((acc, curr) => {
      return acc + curr.expenses.amountValue;
    }, 0);
  }, [data.expenses]);

  const getTotalIncomes = useMemo(() => {
    return data.incomes.reduce((acc, curr) => {
      return acc + curr.incomes.amountValue;
    }, 0);
  }, [data.incomes]);

  const getTotalBalance = useMemo(() => {
    return getTotalIncomes - getTotalExpenses;
  }, [getTotalIncomes, getTotalExpenses]);

  const getData = useCallback(async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");

    const expensesRef = collection(db, "expenses");
    const incomesRef = collection(db, "incomes");
    const expensesQuery = query(expensesRef, where("user", "==", user.uid));
    const incomesQuery = query(incomesRef, where("user", "==", user.uid));

    const [expensesSnapshot, incomesSnapshot] = await Promise.all([
      getDocs(expensesQuery),
      getDocs(incomesQuery),
    ]);

    const expensesData = expensesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const incomesData = incomesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    setData({ expenses: expensesData, incomes: incomesData });
  }, [user, loading]);

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="mt-12">
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center flex justify-center text-2xl">
          <div className="flex justify-between items-center ">
            <div>
              <p className="font-bold text-gray-400 text-center">Wallet</p>
              <p className="text-2xl">{`₱${getTotalBalance}`}</p>
            </div>
          </div>
        </div>

        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl">
            <p className="mt-3">
              <span className="text-lg font-semibold">{`₱${getTotalExpenses}`}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Total Expense</p>
          </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl">
            <p className="mt-3">
              <span className="text-lg font-semibold">{`₱${getTotalIncomes}`}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Total Income</p>
          </div>
        </div>
      </div>

      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780">
          <div className="flex justify-between">
            <p className="font-semibold text-xl">Revenue Updates</p>
            <div className="flex items-center gap-4">
              <p className="flex items-center gap-2 text-gray-600 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Expense</span>
              </p>
              <p className="flex items-center gap-2 text-green-400 hover:drop-shadow-xl">
                <span>
                  <GoPrimitiveDot />
                </span>
                <span>Income</span>
              </p>
            </div>
          </div>
          <div className="mt-10 flex gap-10 flex-wrap justify-center">
            <div className="border-r-1 border-color m-4 pr-10">
              <div>
                <p>
                  <span className="text-3xl font-semibold">$93,438</span>
                  <span className="p-1.5 hover:drop-shadow-xl cursor-pointer rounded-full text-white bg-green-400 ml-3 text-xs">
                    23$
                  </span>
                </p>
                <p className="text-gray-500 mt-1">Budget</p>
              </div>
              <div className="mt-8">
                <p>
                  <span className="text-3xl font-semibold">$48,438</span>
                </p>
                <p className="text-gray-500 mt-1">Expense</p>
              </div>

              <div className="mt-5">
                <LineChart />
              </div>

              <div className="mt-10">
                <Button
                  color="white"
                  bgColor={currentColor}
                  text="Download Report"
                  borderRadius="10px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
