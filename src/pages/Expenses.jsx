import React, { useEffect, useMemo, useState } from "react";

import { Header, ExpenseDialog, Table } from "../components";

import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

import { useStateContext } from "../contexts/ContextProvider";

const Expenses = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const { isClicked, currentColor, userExpenses, setUserExpenses } = useStateContext();
  const [expenseQuery, setExpenseQuery] = useState("");
  const [sorting, setSorting] = useState({
    field: "timestamp",
    order: "desc",
  });
  const [initial, setInitial] = useState(false);

  const filteredItems = useMemo(() => {
    if (!expenseQuery) return userExpenses;
    return userExpenses.filter((item) => {
      return (
        item.expenses?.amountValue.toString().includes(expenseQuery.toLowerCase()) ||
        item.expenses?.categoryValue.toLowerCase().includes(expenseQuery.toLowerCase()) ||
        new Date(item.expenses?.dateValue.toMillis())
          .toDateString()
          .split(" ")
          .slice(1)
          .join(" ")
          .toLowerCase()
          .includes(expenseQuery.toLowerCase()) ||
        item.expenses?.descriptionValue.toLowerCase().includes(expenseQuery.toLowerCase()) ||
        item.expenses?.transactionValue.toLowerCase().includes(expenseQuery.toLowerCase())
      );
    });
  }, [userExpenses, expenseQuery]);

  const getData = async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");

    const collectionRef = collection(db, "expenses");
    const q = query(
      collectionRef,
      where("user", "==", user.uid),
      orderBy(`${sorting.field}`, `${sorting.order}`)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserExpenses(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  };

  useEffect(() => {
    getData();
  }, [user, loading, sorting]);

  useEffect(() => {
    setInitial(true);
  }, []);

  const sortBy = [
    { name: "Category - Ascending", properties: { field: "expenses.categoryValue", order: "asc" } },
    {
      name: "Category - Descending",
      properties: { field: "expenses.categoryValue", order: "desc" },
    },
    { name: "Amount - Ascending", properties: { field: "expenses.amountValue", order: "asc" } },
    { name: "Amount - Descending", properties: { field: "expenses.amountValue", order: "desc" } },
    {
      name: "Transaction - Ascending",
      properties: { field: "expenses.transactionValue", order: "asc" },
    },
    {
      name: "Transaction - Descending",
      properties: { field: "expenses.transactionValue", order: "desc" },
    },
    { name: "Date - Ascending", properties: { field: "expenses.dateValue", order: "asc" } },
    { name: "Date - Descending", properties: { field: "expenses.dateValue", order: "desc" } },
  ];

  const handleSorting = (e) => {
    const { name, value } = e.target;
    let properties = value.split(",");
    setSorting({
      field: properties[0],
      order: properties[1],
    });
    setInitial(false);
  };

  const handleReset = () => {
    setSorting({
      field: "timestamp",
      order: "desc",
    });
    setInitial(true);
  };

  return (
    <div
      className={`m-2 mt-[5rem] md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg ${
        isClicked ? "hidden sm:block" : ""
      }`}
    >
      <div className="flex justify-between mt-12 md:mt-3 flex-col lg:flex-row">
        <Header category="Page" title="Expense" />
        <div className="flex flex-col justify-between mx-5">
          <div className="flex justify-between">
            <input
              className="h-[3rem] w-[10rem] sm:w-[25rem] px-3 mr-5 font-semibold placeholder-gray-500  rounded-2xl ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2 outline-none "
              type="search"
              onChange={(e) => setExpenseQuery(e.target.value)}
              placeholder="Search..."
            />

            <ExpenseDialog />
          </div>
          <div className="flex justify-between mt-5 items-center sm:justify-end ">
            <div>
              <select
                className="ring-2 h-[3rem] w-[10rem] px-3 ring-gray-300 border-none rounded-2xl font-semibold text-gray-500 focus:ring-gray-500 focus:ring-2 outline-none sm:mr-5"
                name="sortBy"
                onChange={handleSorting}
                value={initial ? "Sort By:" : ""}
              >
                <option disabled>Sort By:</option>
                {sortBy.map((sort, index) => {
                  return (
                    <option key={sort.name} value={[sort.properties.field, sort.properties.order]}>
                      {sort.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <button
              className="btn border-none outline-none rounded-2xl"
              style={{ color: "white", backgroundColor: currentColor }}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <Table userData={userExpenses} filteredData={filteredItems} />
    </div>
  );
};

export default Expenses;
