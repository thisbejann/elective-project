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
  const [initial, setInitial] = useState(false);

  const filteredItems = useMemo(() => {
    if (!incomeQuery) return userIncomes;
    return userIncomes.filter((item) => {
      return (
        item.incomes?.amountValue.toString().includes(incomeQuery.toLowerCase()) ||
        item.incomes?.categoryValue.toLowerCase().includes(incomeQuery.toLowerCase()) ||
        new Date(item.incomes?.dateValue.toMillis())
          .toDateString()
          .split(" ")
          .slice(1)
          .join(" ")
          .toLowerCase()
          .includes(incomeQuery.toLowerCase()) ||
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

  useEffect(() => {
    setInitial(true);
  }, []);

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
      className={`m-2 mt-[5rem] rounded-3xl bg-white p-2 dark:bg-secondary-dark-bg md:m-10 md:p-10 ${
        isClicked ? "hidden sm:block" : ""
      }`}
    >
      <div className="mt-12 flex flex-col justify-between md:mt-3 lg:flex-row">
        <Header category="Page" title="Income" />
        <div className="mx-5 flex flex-col justify-between">
          <div className="flex justify-between">
            <input
              className="mr-5 h-[3rem] w-[10rem] rounded-2xl px-3 font-semibold placeholder-gray-500  outline-none ring-2 ring-gray-300 focus:ring-2 focus:ring-gray-500 sm:w-[25rem] "
              type="search"
              onChange={(e) => setIncomeQuery(e.target.value)}
              placeholder="Search..."
            />

            <IncomeDialog />
          </div>
          <div className="mt-5 flex items-center justify-between sm:justify-end ">
            <div>
              <select
                className="mr-5 h-[3rem] w-[14rem] rounded-2xl border-none px-3 font-semibold text-gray-500 outline-none ring-2 ring-gray-300 focus:ring-2 focus:ring-gray-500 sm:mr-5 sm:w-[15rem]"
                name="sortBy"
                onChange={handleSorting}
                value={initial ? "Sort By:" : `${sorting.field},${sorting.order}`}
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
              className="btn rounded-2xl border-none outline-none"
              style={{ color: "white", backgroundColor: currentColor }}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <Table userData={userIncomes} filteredData={filteredItems} />
    </div>
  );
};

export default Income;
