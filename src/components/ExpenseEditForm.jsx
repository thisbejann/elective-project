import { React, useState, useRef, useEffect } from "react";

import validator from "validator";

import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";

import { useStateContext } from "../contexts/ContextProvider";

import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ExpenseDialog = ({ data }) => {
  const { currentColor, isClicked } = useStateContext();
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const cashRef = useRef();
  const cardRef = useRef();
  const dateRef = useRef();
  const amountRef = useRef();
  const descriptionRef = useRef();
  const categoryRef = useRef();

  const onChange = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    toast.success("Transaction added successfully", {
      position: "top-center",
      autoClose: 1500,
    });

    const transactionValue = cashRef.current.checked
      ? cashRef.current.value
      : cardRef.current.value;
    //format syncfusion datepicker value to yyyy-mm-dd
    const dateValue = dateRef.current.value.toString().split(" ").slice(1, 4).join("-");

    const amountValue = amountRef.current.value;
    const descriptionValue = descriptionRef.current.value;
    const categoryValue = categoryRef.current.value;

    const expenseObject = {
      transactionValue,
      dateValue,
      amountValue,
      descriptionValue,
      categoryValue,
    };
    if (
      !validator.isEmpty(
        transactionValue || dateValue || amountValue || descriptionValue || categoryValue
      )
    ) {
    }

    // make a firestore collection
    const expenseRef = collection(db, "expenses");
    await addDoc(expenseRef, {
      expenses: { ...expenseObject },
      timestamp: serverTimestamp(),
      user: user.uid,
      avatar: user.photoURL,
      name: user.displayName,
    });

    categoryRef.current.value = "";
    amountRef.current.value = "";
    descriptionRef.current.value = "";
    categoryRef.current.value = "";

    return navigate("/expenses");
  };

  const dateValue = new Date();

  return (
    <div
      className={`bg-gray-200 w-full min-h-screen flex justify-center items-center ${
        isClicked ? "hidden sm:block" : ""
      }`}
    >
      <div className="w-50 mx-4 sm:w-1/3  p-5 bg-white rounded-xl">
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between">
            <h3 className="text-lg font-bold">Add Transaction</h3>
            <Link to="/expenses">
              <label htmlFor="my-modal-3" className="btn btn-sm btn-circle  ">
                ✕
              </label>
            </Link>
          </div>
          <div className="modal-action flex-col">
            <div className="form-control flex-row gap-3 justify-center">
              <label className="label cursor-pointer">
                <span className="label-text mr-2">Cash</span>
                <input
                  type="radio"
                  name="transaction"
                  className="radio"
                  value="Cash"
                  ref={cashRef}
                  required
                  defaultChecked
                />
              </label>
              <label className="label cursor-pointer">
                <span className="label-text mr-2">Credit/Debit Card</span>
                <input
                  type="radio"
                  name="transaction"
                  className="radio"
                  value="Credit/Debit"
                  ref={cardRef}
                />
              </label>
            </div>
            <div className="mt-5">
              <DatePickerComponent
                ref={dateRef}
                value={dateValue}
                placeholder="Enter Date"
                floatLabelType="Always"
                name="calendar"
                required
              />
            </div>
            <div className="form-control flex flex-row gap-5">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Select a Category</span>
                </label>
                <select
                  ref={categoryRef}
                  className="select select-bordered w-full"
                  name="category"
                  required
                >
                  <option value="Bills">Bills</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Food">Food</option>
                  <option value="Wants">Wants</option>
                </select>
              </div>
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Enter Amount</span>
                </label>
                <input
                  ref={amountRef}
                  type="number"
                  min="1"
                  name="amount"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>
            <div className="form-control mt-2 mb-2">
              <div className="w-full">
                <label className="label">
                  <span className="label-text">Add Description</span>
                </label>
                <input
                  ref={descriptionRef}
                  type="text"
                  name="description"
                  className="input input-bordered w-full"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                className="btn border-none mt-2"
                style={{ color: "white", backgroundColor: currentColor }}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseDialog;
