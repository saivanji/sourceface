import { useMemo } from "react";
import { useSelector } from "react-redux";

export const usePrivateSelector = (makeSelector, param) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const selector = useMemo(makeSelector, []);

  return useSelector(selector(param));
};
