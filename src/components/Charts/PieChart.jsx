import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useStateContext } from "../../contexts/ContextProvider";

import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const { currentMode } = useStateContext();
  const [user, loading] = useAuthState(auth);
  const [data, setData] = useState({ expenses: [], incomes: [], savings: [] });

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

  // put the total expenses, incomes and savings to the pie chart
  const chartData = {
    labels: ["Expense", "Income", "Savings"],
    datasets: [
      {
        data: [getTotalExpenses, getTotalIncomes, getTotalSavings],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    getData();

    return () => {
      setData({ expenses: [], incomes: [], savings: [] });
    };
  }, [user, loading]);

  return (
    <div>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              labels: {
                color: `${currentMode === "Dark" ? "white" : "black"}`,
              },
            },
          },
          animation: false,
        }}
      ></Pie>
    </div>
  );
};

export default PieChart;
