import React, { Suspense } from "react";
import { render } from "react-dom";
import { RecoilRoot } from "recoil";
import Layout from "./Layout";

// TODO: make sure we can access mount variable from any module in the page. Not specifically in the descendent tree.
// Display variable suggestion in case @mount is defined for the specific module. Display spinner in the source module until @mount resolves.

// investigate extra rerendering with recoil and performance in general

// TODO: consider having only hooks for getting settings, variables or functions instead of mutating root component. They will report to the Spawn to
// trigger corresponding loading/error state but will return plain data without loading/error flags. Use some sort of Suspense alternative until useTransition
// api will not be implemented. So using computation hooks will trigger loading/error state update in the nearest ancestor of Suspense like component.
// By default will have that component appear in Spawn.

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
