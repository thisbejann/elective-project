import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  Title,
  Filler,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { useStateContext } from "../../contexts/ContextProvider";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";

ChartJS.register(
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  Title,
  Filler
);

const LineChart = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const { userExpenses, setUserExpenses, userIncomes, setUserIncomes, currentMode } =
    useStateContext();

  const [expenseChartData, setExpenseChartData] = useState({ datasets: [] });
  const [incomeChartData, setIncomeChartData] = useState({ datasets: [] });

  useEffect(() => {
    const getExpenses = async () => {
      if (loading) return;
      if (!user) return navigate("/auth/login");

      const collectionRef = collection(db, "expenses");
      const q = query(
        collectionRef,
        where("user", "==", user.uid),
        orderBy("expenses.dateValue", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setUserExpenses(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });

      const dateArray = userExpenses.map((data) =>
        data.expenses.dateValue.toDate().toLocaleDateString("en-US")
      );

      const uniqueDateArray = [...new Set(dateArray)];

      const groupedExpenses = uniqueDateArray
        .map((date) => {
          const totalAmount = userExpenses
            .filter((data) => data.expenses.dateValue.toDate().toLocaleDateString("en-US") === date)
            .reduce((acc, curr) => {
              return acc + curr.expenses.amountValue;
            }, 0);
          return { date, totalAmount };
        })
        .slice(0, 5);
      groupedExpenses.reverse();

      setExpenseChartData({
        labels: groupedExpenses.map((data) => data.date),
        datasets: [
          {
            label: "Expense",
            data: groupedExpenses.map((data) => data.totalAmount),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      });
      return unsubscribe;
    };
    getExpenses();
  }, [user, loading, userExpenses, setUserExpenses]);

  useEffect(() => {
    const getIncomes = async () => {
      if (loading) return;
      if (!user) return navigate("/auth/login");

      const collectionRef = collection(db, "incomes");
      const q = query(
        collectionRef,
        where("user", "==", user.uid),
        orderBy("incomes.dateValue", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setUserIncomes(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });

      const dateArray = userIncomes.map((data) =>
        data.incomes.dateValue.toDate().toLocaleDateString("en-US")
      );

      const uniqueDateArray = [...new Set(dateArray)];

      const groupedIncomes = uniqueDateArray
        .map((date) => {
          const totalAmount = userIncomes
            .filter((data) => data.incomes.dateValue.toDate().toLocaleDateString("en-US") === date)
            .reduce((acc, curr) => {
              return acc + curr.incomes.amountValue;
            }, 0);
          return { date, totalAmount };
        })
        .slice(0, 5);
      groupedIncomes.reverse();

      setIncomeChartData({
        labels: groupedIncomes.map((data) => data.date),
        datasets: [
          {
            label: "Income",
            data: groupedIncomes.map((data) => data.totalAmount),
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      });
      return unsubscribe;
    };
    getIncomes();
  }, [user, loading, userIncomes, setUserIncomes]);

  return (
    <div>
      <Line
        data={expenseChartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              labels: { color: `${currentMode === "Dark" ? "white" : "black"}` },
            },
          },
          animation: false,
          scales: {
            x: {
              ticks: {
                color: `${currentMode === "Dark" ? "white" : "black"}`,
              },
            },
            y: {
              ticks: {
                color: `${currentMode === "Dark" ? "white" : "black"}`,
              },
            },
          },
        }}
      />
      <Line
        className="mt-5"
        data={incomeChartData}
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
          scales: {
            x: {
              ticks: {
                color: `${currentMode === "Dark" ? "white" : "black"}`,
              },
            },
            y: {
              ticks: {
                color: `${currentMode === "Dark" ? "white" : "black"}`,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
