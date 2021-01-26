import React from "react";
import cx from "classnames";
import Skeleton from "react-loading-skeleton";
import { moduleContext, useModule } from "../consumers";

export default function ModuleProvider({ moduleId }) {
  return (
    <moduleContext.Provider value={moduleId}>
      <Module />
    </moduleContext.Provider>
  );
}

function Module() {
  const selection = null;
  const error = null;
  const isLoading = false;
  const isPristine = false;

  const { module, blueprint } = useModule();

  const { Root } = blueprint;

  if (isPristine) {
    return <Skeleton width={200} height={80} className="mb-3" />;
  }

  if (error) {
    console.log(error);
    return JSON.stringify(error);
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={cx(
        "rounded-md border-2 border-dashed p-4 bg-white mb-3",
        isLoading && "opacity-75",
        selection === module.id ? "border-blue-500" : "border-green-300"
      )}
    >
      <Root />
    </div>
  );
}
