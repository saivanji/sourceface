import React from "react";
import ReactDOM from "react-dom";
import { RootProvider, Layout } from "../core";
import * as stock from "../modules";
import { data } from "./mocks";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <RootProvider data={data} stock={stock}>
      <div className="bg-gray-200 min-h-screen p-4 flex flex-col items-center">
        <Layout />
      </div>
    </RootProvider>
  </React.StrictMode>,
  rootElement
);
