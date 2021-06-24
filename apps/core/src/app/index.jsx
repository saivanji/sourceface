import React from "react";
import ReactDOM from "react-dom";
import * as store from "../store";
import { stock } from "../modules";
import { Layout } from "../content";
import { data } from "./mocks";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <store.RootProvider data={data} stock={stock}>
      <div className="bg-gray-200 min-h-screen">
        <Layout />
      </div>
    </store.RootProvider>
  </React.StrictMode>,
  rootElement
);
