import React, { useEffect, useState, useMemo, useCallback } from "react";
import { LineChart, PieChart } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

import { auth, db } from "../utils/firebase";
import { collection, onSnapshot, query, where, orderBy, getDocs } from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { currentColor } = useStateContext();

  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [data, setData] = useState({ expenses: [], incomes: [], savings: [] });

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

  const getTotalSavings = useMemo(() => {
    return data.savings.reduce((acc, curr) => {
      return acc + curr.savings.amountValue;
    }, 0);
  }, [data.savings]);

  const getTotalBalance = useMemo(() => {
    return getTotalIncomes - getTotalExpenses;
  }, [getTotalIncomes, getTotalExpenses]);

  const getData = useCallback(async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");

    const expensesRef = collection(db, "expenses");
    const incomesRef = collection(db, "incomes");
    const savingsRef = collection(db, "savings");
    const expensesQuery = query(expensesRef, where("user", "==", user.uid));
    const incomesQuery = query(incomesRef, where("user", "==", user.uid));
    const savingsQuery = query(savingsRef, where("user", "==", user.uid));

    const [expensesSnapshot, incomesSnapshot, savingsSnapshot] = await Promise.all([
      getDocs(expensesQuery),
      getDocs(incomesQuery),
      getDocs(savingsQuery),
    ]);

    const expensesData = expensesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const incomesData = incomesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    const savingsData = savingsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    setData({ expenses: expensesData, incomes: incomesData, savings: savingsData });
  }, [user, loading]);

  useEffect(() => {
    getData();

    return () => {
      setData({ expenses: [], incomes: [], savings: [] });
    };
  }, [user, loading]);

  return (
    <div className="mt-12">
      <div className="flex flex-wrap justify-center lg:flex-nowrap">
        <div
          className="m-3 mt-10 flex h-44 w-full justify-center rounded-xl border-2 bg-white bg-hero-pattern bg-cover  bg-center bg-no-repeat p-8 pt-9 text-2xl dark:bg-secondary-dark-bg dark:text-gray-200 lg:w-80"
          style={{ borderColor: currentColor }}
        >
          <div className="flex items-center justify-between ">
            <div>
              <p className="text-center font-bold text-gray-400">Wallet</p>
              <p className="text-2xl">{`₱${getTotalBalance}`}</p>
            </div>
          </div>
        </div>

        <div className="flex lg:mt-8">
          <div className="m-3 flex flex-wrap items-center justify-center gap-1">
            <div
              className="rounded-2xl border-2 bg-white p-4 pt-9 dark:bg-secondary-dark-bg dark:text-gray-200 md:w-56"
              style={{ borderColor: currentColor }}
            >
              <p className="mt-3">
                <span className="text-lg font-semibold">{`₱${getTotalExpenses}`}</span>
              </p>
              <p className="mt-1 text-sm text-gray-400">Total Expense</p>
            </div>
          </div>
          <div className="m-3 flex flex-wrap items-center justify-center gap-1">
            <div
              className="rounded-2xl border-2 bg-white p-4 pt-9 dark:bg-secondary-dark-bg dark:text-gray-200 md:w-56"
              style={{ borderColor: currentColor }}
            >
              <p className="mt-3">
                <span className="text-lg font-semibold">{`₱${getTotalIncomes}`}</span>
              </p>
              <p className="mt-1 text-sm text-gray-400">Total Income</p>
            </div>
          </div>
          <div className="m-3 flex flex-wrap items-center justify-center gap-1">
            <div
              className="rounded-2xl border-2 bg-white p-4 pt-9 dark:bg-secondary-dark-bg dark:text-gray-200 md:w-56"
              style={{ borderColor: currentColor }}
            >
              <p className="mt-3">
                <span className="text-lg font-semibold">{`₱${getTotalSavings}`}</span>
              </p>
              <p className="mt-1 text-sm text-gray-400">Total Savings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-10">
        <div
          className="m-3 rounded-2xl border-2 bg-white p-4 dark:bg-secondary-dark-bg dark:text-gray-200 md:w-780"
          style={{ borderColor: currentColor }}
        >
          <div className="mt-5 flex justify-center">
            <p className="text-2xl font-bold ">Data Charts</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-10">
            <div
              className="border-b-1 pb-[3rem] sm:border-b-0 sm:border-r-1 sm:pr-10"
              style={{ borderColor: currentColor }}
            >
              <div className="mt-5 w-[20rem]">
                <LineChart />
              </div>
            </div>
            <div className="mt-1 mb-5 sm:mt-5">
              <PieChart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
