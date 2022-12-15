import React from "react";
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

const Expenses = () => {
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
