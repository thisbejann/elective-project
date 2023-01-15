import React, { useEffect, useState } from "react";
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

import { employeesData, contextMenuItems, incomeGrid } from "../data/dummy";
import { Header, IncomeDialog, Table } from "../components";

import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { documenteditor } from "@syncfusion/ej2";

import { useStateContext } from "../contexts/ContextProvider";

const Income = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [userIncome, setUserIncome] = useState([]);
  const { isClicked } = useStateContext();

  const getData = async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");

    const collectionRef = collection(db, "income");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserIncome(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div
      className={`m-2 mt-10 md:m-10 p-2 md:p-10 bg-white rounded-3xl ${
        isClicked ? "hidden sm:block" : ""
      }`}
    >
      <div className="flex justify-between mt-12 md:mt-3">
        <Header category="Page" title="Income" />
        <IncomeDialog />
      </div>

      <Table userData={userIncome} />
    </div>
  );
};

export default Income;
