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
      if (userData[0].expenses) {
        await deleteDoc(doc(db, "expenses", id));
        toast.success("Expense deleted successfully", {
          position: "top-center",
          autoClose: 1500,
        });
      } else if (userData[0].savings) {
        await deleteDoc(doc(db, "savings", id));
        toast.success("Savings deleted successfully", {
          position: "top-center",
          autoClose: 1500,
        });
      } else if (userData[0].income) {
        await deleteDoc(doc(db, "income", id));
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
          <thead className="bg-gray-500 text-white border-b-2 border-gray-200">
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
          <tbody className="[&>*:nth-child(odd)]:bg-white [&>*:nth-child(even)]:bg-gray-300 divide-y divide-gray-100">
            {filteredData.map((data) => (
              <tr key={data.id}>
                <td className="p-3 text-center text-sm text-gray-700 whitespace-nowrap">
                  {data.expenses?.categoryValue ||
                    data.savings?.categoryValue ||
                    data.income?.categoryValue}
                </td>
                <td className="p-3 text-center text-sm text-gray-700 whitespace-nowrap">
                  {data.expenses?.amountValue ||
                    data.savings?.amountValue ||
                    data.income?.amountValue}
                </td>
                <td className="p-3 text-sm text-center text-gray-700 whitespace-nowrap">
                  {data.expenses?.transactionValue ||
                    data.savings?.transactionValue ||
                    data.income?.transactionValue}
                </td>
                <td className="p-3 text-center text-sm text-gray-700 whitespace-nowrap">
                  {data.expenses?.dateValue || data.savings?.dateValue || data.income?.dateValue}
                </td>
                <td className="p-3 text-center text-sm text-gray-700 whitespace-nowrap">
                  {data.expenses?.descriptionValue ||
                    data.savings?.descriptionValue ||
                    data.income?.descriptionValue}
                </td>

                <td className="text-center text-sm  whitespace-nowrap">
                  {/* <Link to={`/edit/${data.id}`}>
                  <label
                    htmlFor="my-modal-3"
                    className="btn border-none"
                    style={{ color: "white", backgroundColor: currentColor }}
                  >
                    Edit
                  </label>
                </Link> */}

                  <button
                    className="btn border-none"
                    style={{ color: "white", backgroundColor: currentColor }}
                    onClick={() => deleteData(data.id)}
                  >
                    Delete
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
