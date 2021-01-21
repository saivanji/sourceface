import React, { Suspense } from "react";
import { render } from "react-dom";
import { RecoilRoot } from "recoil";
import Layout from "./Layout";

// name it "core" instead of "factory" and consider keeping toolkit here

// TODO: make sure we can access mount variable from any module in the page. Not specifically in the descendent tree.
// Display variable suggestion in case @mount is defined for the specific module. Display spinner in the source module until @mount resolves.
// consider having it as global page actions instead of mount since it's lazy and has nothing to do with a specific module.

// TODO: consider having default "container" module type which will be created with every page, so that will lead to the following changes:
// - layouts no longer attached to pages but only to the modules instead
// - only default module can have "mounts"?
// - have is_root flag in module table.

// TODO: fix extra fetch of a list when changing a selection
// TODO: consider having singular selectors for settings and local variables to be able to cache every setting / variable separately
// TODO: make sure we cache functions with recoil independently of a specific setting(previously that was solved by moving cache to a function space)
// TODO: prettify recoil state
// TODO: we might get rid of "maybePromise"

// investigate extra rerendering with recoil and performance in general

// - Stale
// - Non default pipelines(hold off implementation until it's needed)
// - Variable categories
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
