import React, { useEffect } from "react";
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

import { ordersData, contextMenuItems, ordersGrid } from "../data/dummy";
import { Header, ExpenseDialog } from "../components";

import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const Expenses = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const getData = async () => {
    if (loading) return;
    if (!user) return navigate("/auth/login");
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div className="m-2 mt-10 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between mt-12 md:mt-3">
        <Header category="Page" title="Expenses" />
        <ExpenseDialog />
      </div>

      <GridComponent
        id="gridcomp"
        dataSource={ordersData}
        allowPaging
        allowSorting
        editSettings={{ allowDeleting: true }}
        toolbar={["Search", "Delete"]}
      >
        <ColumnsDirective>
          {ordersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject
          services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Search]}
        />
      </GridComponent>
    </div>
  );
};

export default Expenses;
