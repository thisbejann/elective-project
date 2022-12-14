import { React, useState, useRef } from "react";

import validator from "validator";

import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";

import { useStateContext } from "../contexts/ContextProvider";

const ExpenseDialog = () => {
  const { currentColor, handleChange, values, inputAmount, expense, setExpense } =
    useStateContext();

  // const [visibility, setDialogVisibility] = useState(false);
  // const dialogClose = () => {
  //   setDialogVisibility(false);
  // };
  // const dialogClick = () => {
  //   setDialogVisibility(true);
  // };
  const cashRef = useRef();
  const cardRef = useRef();
  const dateRef = useRef();
  const amountRef = useRef();
  const descriptionRef = useRef();
  const categoryRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    const transactionValue = cashRef.current.checked
      ? cashRef.current.value
      : cardRef.current.value;
    //format syncfusion datepicker value to yyyy-mm-dd
    const dateValue = dateRef.current.value.toString().split(" ").slice(1, 4).join("-");
    const amountValue = amountRef.current.value;
    const descriptionValue = descriptionRef.current.value;
    const categoryValue = categoryRef.current.value;

    if (
      !validator.isEmpty(
        transactionValue || dateValue || amountValue || descriptionValue || categoryValue
      )
    ) {
      setExpense([
        {
          transaction: transactionValue,
          date: dateValue,
          amount: amountValue,
          description: descriptionValue,
          category: categoryValue,
        },
      ]);
    }
    categoryRef.current.value = "";
    amountRef.current.value = "";
    dateRef.current.value = "";
    descriptionRef.current.value = "";
    categoryRef.current.value = "";
  };

  console.log(expense);

  const dateValue = new Date();

  return (
    <div>
      <label
        htmlFor="my-modal-3"
        className="btn border-none"
        style={{ color: "white", backgroundColor: currentColor }}
      >
        Add Transaction
      </label>
      <input type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">
            ✕
          </label>
          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-bold">Add Transaction</h3>
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
                    type="text"
                    // value={expense.amount}
                    name="amount"
                    className="input input-bordered w-full"
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
                    // value={values.description}
                    name="description"
                    className="input input-bordered w-full"
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

export default ExpenseDialog;
