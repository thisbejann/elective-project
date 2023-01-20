import React, { useEffect, useMemo, useState } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
  Search,
} from "@syncfusion/ej2-react-grids";

import { ordersData, contextMenuItems, expenseGrid } from "../data/dummy";
import { Header, ExpenseDialog, Table } from "../components";
import { Link } from "react-router-dom";

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

  const filteredItems = useMemo(() => {
    if (!expenseQuery) return userExpenses;
    return userExpenses.filter((item) => {
      return (
        item.expenses?.amountValue.toString().includes(expenseQuery.toLowerCase()) ||
        item.expenses?.categoryValue.toLowerCase().includes(expenseQuery.toLowerCase()) ||
        item.expenses?.dateValue.toLowerCase().includes(expenseQuery.toLowerCase()) ||
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
  };

  return (
    <div
      className={`m-2 mt-10 md:m-10 p-2 md:p-10 bg-white rounded-3xl ${
        isClicked ? "hidden sm:block" : ""
      }`}
    >
      <div className="flex justify-between mt-12 md:mt-3 flex-col lg:flex-row lg:items-center">
        <Header category="Page" title="Expenses" />
        <div className=" sm:mr-5 flex justify-center">
          <input
            className="h-[3rem] w-[10rem] sm:w-[25rem] px-3 py-2 mr-5 font-semibold placeholder-gray-500 text-black rounded-2xl border-none ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2 outline-none "
            type="search"
            onChange={(e) => setExpenseQuery(e.target.value)}
            placeholder="Search..."
          />

          <ExpenseDialog />
        </div>
      </div>
      <div className="flex justify-end mt-5 items-center">
        <label>Sort By:</label>
        <select
          className="ring-2 text-center ring-gray-300 border-none rounded-2xl focus:ring-gray-500 focus:ring-2 outline-none h-[3rem] mx-3"
          name="sortBy"
          onChange={handleSorting}
          defaultValue="Please Select"
        >
          <option disabled>Please Select</option>
          {sortBy.map((sort, index) => {
            return (
              <option key={sort.name} value={[sort.properties.field, sort.properties.order]}>
                {sort.name}
              </option>
            );
          })}
        </select>
        {/* <button
          className="btn border-none outline-none rounded-2xl "
          style={{ color: "white", backgroundColor: currentColor }}
          // onClick={handleReset}
        >
          Reset
        </button> */}
      </div>
      <Table userData={userExpenses} filteredData={filteredItems} query={userExpenses} />
    </div>
  );
};

export default Expenses;
