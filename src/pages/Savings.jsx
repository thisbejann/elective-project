import React, { useEffect, useState } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Edit,
  Toolbar,
  Sort,
  Filter,
} from "@syncfusion/ej2-react-grids";

import { customersData, savingsGrid } from "../data/dummy";
import { Header, SavingsDialog } from "../components";

import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { useStateContext } from "../contexts/ContextProvider";

const Savings = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  const [userSavings, setUserSavings] = useState([]);
  const { isClicked } = useStateContext();

  const getData = async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");

    const collectionRef = collection(db, "savings");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUserSavings(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
        <Header category="Page" title="Savings" />
        <SavingsDialog />
      </div>

      <GridComponent
        dataSource={userSavings.map((item) => ({
          amountValue: item.savings.amountValue,
          dateValue: item.savings.dateValue,
          categoryValue: item.savings.categoryValue,
          descriptionValue: item.savings.descriptionValue,
          transactionValue: item.savings.transactionValue,
        }))}
        allowPaging
        allowSorting
        toolbar={["Delete"]}
        width="auto"
        editSettings={{ allowDeleting: true, allowEditing: true }}
      >
        <ColumnsDirective>
          {savingsGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Toolbar, Selection, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Savings;
