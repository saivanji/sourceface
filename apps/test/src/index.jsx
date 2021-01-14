import React, { Suspense } from "react";
import { render } from "react-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import Module from "./spawn";
import { page } from "./store";

// investigate extra rerendering with recoil and performance in general

// - Stale
// - Modules nesting
// - Non default pipelines
// - Variable categories
//   - Argument
//   - Action
//   - Mount

function Modules() {
  const { result } = useRecoilValue(page);

  return (
    <div className="px-12 py-4 flex flex-col items-center text-center">
      {result.map((moduleId) => (
        <Module key={moduleId} moduleId={moduleId} />
      ))}
    </div>
  );
}

function App() {
  return (
    <div className="bg-gray-200 min-h-screen">
      <RecoilRoot>
        <Suspense fallback="Loading...">
          <Modules />
        </Suspense>
      </RecoilRoot>
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
