import { React, useState, useRef } from "react";

import validator from "validator";

import { useStateContext } from "../contexts/ContextProvider";

import { Timestamp, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { toast } from "react-toastify";

const SavingsDialog = () => {
  const { currentColor } = useStateContext();

  const [user, loading] = useAuthState(auth);

  const cashRef = useRef();
  const cardRef = useRef();
  const dateRef = useRef();
  const amountRef = useRef();
  const descriptionRef = useRef();
  const categoryRef = useRef();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // add toast if user successfully submitted
    try {
      toast.success("Transaction added successfully", {
        position: "top-center",
        autoClose: 1500,
      });
    } catch (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 1500,
      });
    }

    const transactionValue = cashRef.current.checked
      ? cashRef.current.value
      : cardRef.current.value;
    //format syncfusion datepicker value to yyyy-mm-dd
    const dateValue = Timestamp.fromDate(new Date(dateRef.current.value));
    const amountValue = parseInt(amountRef.current.value);
    const descriptionValue = descriptionRef.current.value;
    const categoryValue = categoryRef.current.value;

    const savingsObject = {
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
    const savingsRef = collection(db, "savings");
    await addDoc(savingsRef, {
      savings: { ...savingsObject },
      timestamp: serverTimestamp(),
      user: user.uid,
      avatar: user.photoURL,
      name: user.displayName,
    });

    console.log(savingsObject);
  };

  return (
    <div>
      <label
        htmlFor="my-modal-3"
        className="btn border-none rounded-2xl"
        style={{ color: "white", backgroundColor: currentColor }}
      >
        Add Transaction
      </label>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative dark:bg-main-dark-bg">
          <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">
            ✕
          </label>
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Transaction</h3>
            <div className="modal-action flex-col">
              <div className="form-control flex-row gap-3 justify-center">
                <label className="label cursor-pointer">
                  <span className="label-text mr-2 text-slate-900 dark:text-white">Cash</span>
                  <input
                    type="radio"
                    name="transaction"
                    className="radio bg-white"
                    value="Cash"
                    ref={cashRef}
                    required
                    defaultChecked
                  />
                </label>
                <label className="label cursor-pointer">
                  <span className="label-text mr-2 text-slate-900 dark:text-white">
                    Credit/Debit Card
                  </span>
                  <input
                    type="radio"
                    name="transaction"
                    className="radio bg-white"
                    value="Credit/Debit"
                    ref={cardRef}
                  />
                </label>
              </div>
              <div className="mt-5">
                <div className="w-full">
                  <label className="label">
                    <span className="label-text text-white">Select a Date</span>
                  </label>
                  <input
                    type="date"
                    className="w-full input input-bordered"
                    max={new Date().toISOString().split("T")[0]}
                    ref={dateRef}
                    required
                  />
                </div>
              </div>
              <div className="form-control flex flex-row gap-5">
                <div className="w-full">
                  <label className="label">
                    <span className="label-text dark:text-white">Select a Category</span>
                  </label>
                  <select
                    ref={categoryRef}
                    className="select select-bordered w-full"
                    name="category"
                  >
                    <option value="Emergency">Emergency</option>
                    <option value="Regular">Regular</option>
                    <option value="Long-term">Long-term</option>
                    <option value="Insurance">Insurance</option>
                  </select>
                </div>
                <div className="w-full">
                  <label className="label">
                    <span className="label-text dark:text-white">Enter Amount</span>
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
                    <span className="label-text dark:text-white">Add Description</span>
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
    </div>
  );
};

export default SavingsDialog;
