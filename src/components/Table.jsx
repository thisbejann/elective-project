import React from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { toast } from "react-toastify";

const Table = ({ userData }) => {
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
    <div className="mt-[100px]">
      <table>
        <thead>
          <tr>
            <th className="text-center">Transaction</th>
            <th className="text-center">Date</th>
            <th className="text-center">Amount</th>
            <th className="text-center">Description</th>
            <th className="text-center">Category</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((data) => (
            <tr key={data.id}>
              <td className="text-center">
                {data.expenses?.transactionValue ||
                  data.savings?.transactionValue ||
                  data.income?.transactionValue}
              </td>
              <td className="text-center">
                {data.expenses?.dateValue || data.savings?.dateValue || data.income?.dateValue}
              </td>
              <td className="text-center">
                {data.expenses?.amountValue ||
                  data.savings?.amountValue ||
                  data.income?.amountValue}
              </td>
              <td className="text-center">
                {data.expenses?.descriptionValue ||
                  data.savings?.descriptionValue ||
                  data.income?.descriptionValue}
              </td>
              <td className="text-center">
                {data.expenses?.categoryValue ||
                  data.savings?.categoryValue ||
                  data.income?.categoryValue}
              </td>
              <td>
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
  );
};

export default Table;
