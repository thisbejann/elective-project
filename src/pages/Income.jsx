import React from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Search,
  Inject,
  Toolbar,
  Edit,
  Selection,
  Sort, 
  Filter
} from "@syncfusion/ej2-react-grids";

import { employeesData, employeesGrid } from "../data/dummy";
import { Header, IncomeDialog } from "../components";

const Income = () => {
  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between mt-12 md:mt-3">
        <Header category="Page" title="Income" />
        <IncomeDialog />
      </div>

      <GridComponent
        dataSource={employeesData}
        allowPaging
        allowSorting
        toolbar={["Search","Delete"]}
        width="auto"
        editSettings={{ allowDeleting: true, allowEditing: true }}
      >
        <ColumnsDirective>
          {employeesGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Search, Toolbar,Edit, Selection, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Income;
