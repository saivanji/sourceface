import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import * as api from "./api";
import createStore from "./store";
import normalize from "./schema";
import { Layout } from "./components";

function Root() {
  const [store, setStore] = useState(null);

  useEffect(() => {
    api.listModules().then((response) => {
      const { result: modules, entities } = normalize(response);
      const initialState = { entities, modules };

      setStore(createStore(initialState));
    });
  }, []);

  return (
    <div className="bg-gray-200 min-h-screen">
      {!store ? (
        "Loading..."
      ) : (
        <Provider store={store}>
          <Layout />
        </Provider>
      )}
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<Root />, rootElement);
