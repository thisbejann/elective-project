import React, { useEffect, useState, useMemo } from "react";

import { Header, IncomeDialog, Table } from "../components";

import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

import { useStateContext } from "../contexts/ContextProvider";

const Income = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const { isClicked, currentColor, userIncomes, setUserIncomes } = useStateContext();
  const [incomeQuery, setIncomeQuery] = useState("");
  const [sorting, setSorting] = useState({
    field: "timestamp",
    order: "desc",
  });

  const filteredItems = useMemo(() => {
    if (!incomeQuery) return userIncomes;
    return userIncomes.filter((item) => {
      return (
        item.incomes?.amountValue.toString().includes(incomeQuery.toLowerCase()) ||
        item.incomes?.categoryValue.toLowerCase().includes(incomeQuery.toLowerCase()) ||
        item.incomes?.dateValue.toLowerCase().includes(incomeQuery.toLowerCase()) ||
        item.incomes?.descriptionValue.toLowerCase().includes(incomeQuery.toLowerCase()) ||
        item.incomes?.transactionValue.toLowerCase().includes(incomeQuery.toLowerCase())
      );
    });
  }, [userIncomes, incomeQuery]);

  const getData = async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");

    const collectionRef = collection(db, "incomes");
    const q = query(
      collectionRef,
      where("user", "==", user.uid),
      orderBy(`${sorting.field}`, `${sorting.order}`)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserIncomes(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getData();
  }, [user, loading, sorting]);

  const sortBy = [
    { name: "Category - Ascending", properties: { field: "incomes.categoryValue", order: "asc" } },
    {
      name: "Category - Descending",
      properties: { field: "incomes.categoryValue", order: "desc" },
    },
    { name: "Amount - Ascending", properties: { field: "incomes.amountValue", order: "asc" } },
    { name: "Amount - Descending", properties: { field: "incomes.amountValue", order: "desc" } },
    {
      name: "Transaction - Ascending",
      properties: { field: "incomes.transactionValue", order: "asc" },
    },
    {
      name: "Transaction - Descending",
      properties: { field: "incomes.transactionValue", order: "desc" },
    },
    { name: "Date - Ascending", properties: { field: "incomes.dateValue", order: "asc" } },
    { name: "Date - Descending", properties: { field: "incomes.dateValue", order: "desc" } },
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
      className={`m-2 mt-10 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg ${
        isClicked ? "hidden sm:block" : ""
      }`}
    >
      <div className="flex justify-between mt-12 md:mt-3 flex-col lg:flex-row lg:items-center">
        <Header category="Page" title="Incomes" />
        <div className=" sm:mr-5 flex justify-center">
          <input
            className="h-[3rem] w-[10rem] sm:w-[25rem] px-3 py-2 mr-5 font-semibold placeholder-gray-500 text-black rounded-2xl border-none ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2 outline-none "
            type="search"
            onChange={(e) => setIncomeQuery(e.target.value)}
            placeholder="Search..."
          />

          <IncomeDialog />
        </div>
      </div>
      <div className="flex justify-end mt-5 items-center">
        <label className="dark:text-white">Sort By:</label>
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
      <Table userData={userIncomes} filteredData={filteredItems} />
    </div>
  );
};

export default Income;
