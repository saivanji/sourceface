import React from "react";
import ReactDOM from "react-dom";
import { StoreProvider } from "../store";
import { Layout } from "../content";
import { modules } from "./mocks";

const rootElement = document.getElementById("root");

(ReactDOM as any).createRoot(rootElement).render(
  <React.StrictMode>
    <StoreProvider modules={modules}>
      <div className="bg-gray-200 min-h-screen">
        <Layout />
      </div>
    </StoreProvider>
  </React.StrictMode>
);
