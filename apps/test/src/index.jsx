import React, { Suspense } from "react";
import { render } from "react-dom";
import { RecoilRoot } from "recoil";
import Layout from "./Layout";

// TODO: implement clicking on table row and displaying according form data
// TODO: implement default value for input
// TODO: make sure we can access mount variable from any module in the page. Not specifically in the descendent tree.
// Display variable suggestion in case @mount is defined for the specific module. Display spinner in the source module until @mount resolves.

// investigate extra rerendering with recoil and performance in general

// - Stale
// - Non default pipelines
// - Variable categories
//   - Argument
//   - Action

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
