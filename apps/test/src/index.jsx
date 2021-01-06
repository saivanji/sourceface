import React, { Suspense } from "react";
import { render } from "react-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import Module from "./module";
import { root } from "./store";

// - Module functions
// - Stale
// - Variable categories
//   - Argument
//   - Action
//   - Mount

function Modules() {
  const { result } = useRecoilValue(root);

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
