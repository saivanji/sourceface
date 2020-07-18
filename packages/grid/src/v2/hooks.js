import { useMemo } from "react";

export const useApply = (func, args) => useMemo(() => func(...args), args);
