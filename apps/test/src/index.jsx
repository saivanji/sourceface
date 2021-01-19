import React, { Suspense } from "react";
import { render } from "react-dom";
import { RecoilRoot } from "recoil";
import Layout from "./Layout";

// name it "core" instead of "factory"

// TODO: make sure we can access mount variable from any module in the page. Not specifically in the descendent tree.
// Display variable suggestion in case @mount is defined for the specific module. Display spinner in the source module until @mount resolves.

// investigate extra rerendering with recoil and performance in general

// - Stale
// - Non default pipelines
// - Variable categories
//   - Argument
//   - Action

// Editor

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
