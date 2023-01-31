import React, { useEffect, useMemo, useState } from "react";

import { Header, SavingsDialog, Table } from "../components";

import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";

import { useStateContext } from "../contexts/ContextProvider";

const Savings = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const { isClicked, currentColor, userSavings, setUserSavings } = useStateContext();
  const [savingsQuery, setSavingsQuery] = useState("");
  const [sorting, setSorting] = useState({
    field: "timestamp",
    order: "desc",
  });
  const [initial, setInitial] = useState(false);

  const filteredItems = useMemo(() => {
    if (!savingsQuery) return userSavings;
    return userSavings.filter((item) => {
      return (
        item.savings?.amountValue.toString().includes(savingsQuery.toLowerCase()) ||
        item.savings?.categoryValue.toLowerCase().includes(savingsQuery.toLowerCase()) ||
        item.savings?.dateValue.toLowerCase().includes(savingsQuery.toLowerCase()) ||
        item.savings?.descriptionValue.toLowerCase().includes(savingsQuery.toLowerCase()) ||
        item.savings?.transactionValue.toLowerCase().includes(savingsQuery.toLowerCase())
      );
    });
  }, [userSavings, savingsQuery]);

  const getData = async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");

    const collectionRef = collection(db, "savings");
    const q = query(
      collectionRef,
      where("user", "==", user.uid),
      orderBy(`${sorting.field}`, `${sorting.order}`)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserSavings(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
    { name: "Category - Ascending", properties: { field: "savings.categoryValue", order: "asc" } },
    {
      name: "Category - Descending",
      properties: { field: "savings.categoryValue", order: "desc" },
    },
    { name: "Amount - Ascending", properties: { field: "savings.amountValue", order: "asc" } },
    { name: "Amount - Descending", properties: { field: "savings.amountValue", order: "desc" } },
    {
      name: "Transaction - Ascending",
      properties: { field: "savings.transactionValue", order: "asc" },
    },
    {
      name: "Transaction - Descending",
      properties: { field: "savings.transactionValue", order: "desc" },
    },
    { name: "Date - Ascending", properties: { field: "savings.dateValue", order: "asc" } },
    { name: "Date - Descending", properties: { field: "savings.dateValue", order: "desc" } },
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

  console.log(initial);

  return (
    <div
      className={`m-2 mt-10 md:m-10 p-2 md:p-10 bg-white rounded-3xl dark:bg-secondary-dark-bg ${
        isClicked ? "hidden sm:block" : ""
      }`}
    >
      <div className="flex justify-between mt-12 md:mt-3 flex-col lg:flex-row lg:items-center">
        <Header category="Page" title="Savings" />
        <div className=" sm:mr-5 flex justify-center">
          <input
            className="h-[3rem] w-[10rem] sm:w-[25rem] px-3 py-2 mr-5 font-semibold placeholder-gray-500 text-black rounded-2xl border-none ring-2 ring-gray-300 focus:ring-gray-500 focus:ring-2 outline-none "
            type="search"
            onChange={(e) => setSavingsQuery(e.target.value)}
            placeholder="Search..."
          />

          <SavingsDialog />
        </div>
      </div>
      <div className="flex justify-end mt-5 items-center">
        <div>
          <label className="dark:text-white">Sort By:</label>
          <select
            className="ring-2 w-[10rem] text-center ring-gray-300 border-none rounded-2xl focus:ring-gray-500 focus:ring-2 outline-none h-[3rem] mx-3"
            name="sortBy"
            onChange={handleSorting}
            value={initial ? "Please Select" : ""}
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
        </div>
        <button
          className="btn border-none outline-none rounded-2xl "
          style={{ color: "white", backgroundColor: currentColor }}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      <Table userData={userSavings} filteredData={filteredItems} />
    </div>
  );
};

export default Savings;
