import react from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import { ContextProvider } from "./contexts/ContextProvider";

import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "ORg4AjUWIQA/Gnt2VVhjQlFac1lJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0djW39ZcndVQ2heUEc="
);

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById("root")
);
