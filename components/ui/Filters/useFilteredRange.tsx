import { useCallback, useState } from "react";

const useFilteredRange = ({ min, max }: { min: number; max: number }) => {
  const [minMax, setMinMaxValues] = useState<number[]>([min, max]);
  const setValues = useCallback(
    (el: number | number[] | undefined) => el && typeof el !== "number" && setMinMaxValues(el),
    []
  );
  return [minMax, setValues] as const;
};

export default useFilteredRange;
