import React from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { toast } from "react-toastify";

const Table = ({ userData, filteredData }) => {
  const { currentColor } = useStateContext();

  const deleteData = async (id) => {
    // delete collection id from firebase with condition if collection is from expenses, savings, or income
    if (window.confirm("Are you sure you want to delete this data?")) {
      if (filteredData[0].expenses) {
        await deleteDoc(doc(db, "expenses", id));
        toast.success("Expense deleted successfully", {
          position: "top-center",
          autoClose: 1500,
        });
      } else if (filteredData[0].savings) {
        await deleteDoc(doc(db, "savings", id));
        toast.success("Savings deleted successfully", {
          position: "top-center",
          autoClose: 1500,
        });
      } else if (filteredData[0].incomes) {
        await deleteDoc(doc(db, "incomes", id));
        toast.success("Income deleted successfully", {
          position: "top-center",
          autoClose: 1500,
        });
      }
    }
  };

  return (
    <div className="p-5 h-screen">
      <div className="overflow-auto rounded-lg shadow">
        <table className="w-full">
          <thead className="dark:bg-main-dark-bg text-white bg-gray-500 border-b-2 border-gray-200">
            <tr>
              <th className="w-16 p-3 text-sm font-semibold tracking-wide text-center">Category</th>
              <th className="w-16 p-3 text-sm font-semibold tracking-wide text-center">Amount</th>
              <th className="w-24 p-3 text-sm font-semibold tracking-wide text-center">
                Transaction
              </th>
              <th className="w-24 p-3 text-sm font-semibold tracking-wide text-center">Date</th>
              <th className="w-32 p-3 text-sm font-semibold tracking-wide text-center">
                Description
              </th>
              <th className="w-24 p-3 text-sm font-semibold tracking-wide text-center">Action</th>
            </tr>
          </thead>
          <tbody className=" divide-y divide-gray-100]">
            {filteredData.map((data) => (
              <tr
                key={data.id}
                className="odd:bg-white even:bg-[color:var(--some-color)] [&>*:last-child>button]:even:bg-white [&>*:last-child>button]:even:text-black [&>*:last-child>button]:odd:bg-[color:var(--some-color)] 
                [&>*]:even:text-white [&>*]:odd:text-black"
                style={{ "--some-color": currentColor }}
              >
                <td className="p-3 text-center text-sm  whitespace-nowrap">
                  {data.expenses?.categoryValue ||
                    data.savings?.categoryValue ||
                    data.incomes?.categoryValue}
                </td>
                <td className="p-3 text-center text-sm  whitespace-nowrap">
                  {data.expenses?.amountValue ||
                    data.savings?.amountValue ||
                    data.incomes?.amountValue}
                </td>
                <td className="p-3 text-sm text-center  whitespace-nowrap">
                  {data.expenses?.transactionValue ||
                    data.savings?.transactionValue ||
                    data.incomes?.transactionValue}
                </td>
                <td className="p-3 text-center text-sm  whitespace-nowrap">
                  {data.expenses?.dateValue.toDate().toLocaleDateString("en-US") ||
                    data.savings?.dateValue.toDate().toLocaleDateString("en-US") ||
                    data.incomes?.dateValue.toDate().toLocaleDateString("en-US")}
                </td>
                <td className="p-3 text-center text-sm  whitespace-nowrap">
                  {data.expenses?.descriptionValue ||
                    data.savings?.descriptionValue ||
                    data.incomes?.descriptionValue}
                </td>

                <td className="text-center text-sm whitespace-nowrap">
                  <button
                    className="btn btn-sm gap-[4px] border-none "
                    onClick={() => deleteData(data.id)}
                  >
                    <div className="flex justify-center items-center gap-[5px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <p>Delete</p>
                    </div>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
