import React from "react";
import ReactDOM from "react-dom";
import * as core from "../core";
import { stock } from "../modules";
import { Layout } from "../content";
import { data } from "./mocks";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <core.RootProvider data={data} stock={stock}>
      <div className="bg-gray-200 min-h-screen">
        <Layout />
      </div>
    </core.RootProvider>
  </React.StrictMode>,
  rootElement
);
