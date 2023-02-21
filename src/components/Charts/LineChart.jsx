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
import "chartjs-adapter-moment";
import { useStateContext } from "../../contexts/ContextProvider";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, onSnapshot, query, where, orderBy, limit } from "firebase/firestore";
import { auth, db } from "../../utils/firebase";
import moment from "moment";

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
  const [user, loading] = useAuthState(auth);
  const { userExpenses, setUserExpenses } = useStateContext();

  const [expenseChartData, setExpenseChartData] = useState({ datasets: [] });

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

      //  group the expenses by date and add them together, also limit the array to 7 items only to display on the chart
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

      // //get all items from userExpenses that has the same dateValue and add them
      // const groupedExpenses = userExpenses.reduce((acc, curr) => {
      //   const date = curr.expenses.dateValue.toDate().toLocaleDateString("en-US");
      //   if (!acc[date]) {
      //     acc[date] = [];
      //   }
      //   acc[date].push(curr);
      //   return acc;
      // }, {});

      // reverse the array to get the latest data
      groupedExpenses.reverse();

      setExpenseChartData({
        labels: groupedExpenses.map((data) => data.date),
        datasets: [
          {
            label: "Expenses",
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

  return (
    <div>
      <Line
        data={expenseChartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
          animation: false,
        }}
      />
    </div>
  );
};

export default LineChart;
