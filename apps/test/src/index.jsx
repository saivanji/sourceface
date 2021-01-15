import React, { Suspense } from "react";
import { render } from "react-dom";
import { RecoilRoot } from "recoil";
import Layout from "./Layout";

// investigate extra rerendering with recoil and performance in general

// - Stale
// - Modules nesting
// - Non default pipelines
// - Variable categories
//   - Argument
//   - Action
//   - Mount

function App() {
  return (
    <div className="bg-gray-200 min-h-screen">
      <RecoilRoot>
        <Suspense fallback="Loading...">
          <Layout />
        </Suspense>
      </RecoilRoot>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
