import React, { Suspense } from "react";
import { render } from "react-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import Module from "./module";
import * as store from "./store";

// - Module functions
// - Stale
// - Multiple action evaluation
// - Static config setting
// - Variable categories
//   - Argument
//   - Action
//   - Mount

function Modules() {
  const { ids } = useRecoilValue(store.modules);

  return (
    <div className="px-12 py-4 flex flex-col items-center text-center">
      {ids.map((id) => (
        <Module key={id} moduleId={id} />
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
