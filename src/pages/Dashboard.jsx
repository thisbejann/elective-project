import React, { useEffect, useState } from "react";
import { BSCurrencyDollar } from "react-icons/bs";
import { GoPrimitiveDot } from "react-icons/go";
import { Stacked, Pie, Button, SparkLine } from "../components";
import { earningData, SparklineAreaData, ecomPieChartData } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";

import { auth, db } from "../utils/firebase";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { currentColor } = useStateContext();

  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);

  // get all amountValue from Expenses and add them
  const totalExpenses = expenseData.reduce((acc, curr) => {
    return acc + curr.expenses.amountValue;
  }, 0);

  // get all amountValue from Incomes and add them
  const totalIncomes = incomeData.reduce((acc, curr) => {
    return acc + curr.incomes.amountValue;
  }, 0);

  // get all amountValue from Incomes and Expenses and add them
  const totalBalance = totalIncomes - totalExpenses;

  console.log(totalExpenses);
  console.log(totalIncomes);
  console.log(totalBalance);

  const getExpenses = async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");

    const collectionRef = collection(db, "expenses");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenseData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  };

  const getIncomes = async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");

    const collectionRef = collection(db, "incomes");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIncomeData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  };

  useEffect(() => {
    getExpenses();
    getIncomes();
  }, [user, loading]);

  return (
    <div className="mt-12">
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center flex justify-center text-2xl">
          <div className="flex justify-between items-center ">
            <div>
              <p className="font-bold text-gray-400 text-center">Total</p>
              <p className="text-2xl">{`₱${totalBalance}`}</p>
            </div>
          </div>
        </div>

        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl">
            <p className="mt-3">
              <span className="text-lg font-semibold">{`₱${totalExpenses}`}</span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Total Expense</p>
          </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
          <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl">
            <p className="mt-3">
              <span className="text-lg font-semibold">{`₱${totalIncomes}`}</span>
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
                <SparkLine
                  currentColor={currentColor}
                  id="line-sparkline"
                  type="Line"
                  height="80px"
                  width="250px"
                  data={SparklineAreaData}
                  color={currentColor}
                />
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
            <Stacked width="320px" height="360px" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
