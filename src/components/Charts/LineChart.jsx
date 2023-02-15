import React, { useState, useEffect } from "react";
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
      const q = query(collectionRef, where("user", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setUserExpenses(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
      setExpenseChartData({
        labels: userExpenses.map((data) => data.expenses.dateValue),
        datasets: [
          {
            label: "Expenses",
            data: userExpenses.map((data) => data.expenses.amountValue),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      });
      return unsubscribe;
    };
    getExpenses();
  }, []);

  return (
    <div>
      <Line
        data={expenseChartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
