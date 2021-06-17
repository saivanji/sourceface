import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import initStore from "./store";
import { modules } from "./mocks";
import Layout from "./Layout";
import type { Module } from "./types";

type LibProps = {
  modules: Module[];
};

function Lib({ modules }: LibProps) {
  // TODO: since "core" will be exported as a library, keep in mind behavior of
  // the store creation on parent component re-render.
  const store = initStore(modules);

  return (
    <Provider store={store}>
      <div className="bg-gray-200 min-h-screen">
        <Layout />
      </div>
    </Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Lib modules={modules} />
  </React.StrictMode>,
  document.getElementById("root")
);
