import { SyntheticEvent, useCallback, useState } from "react";

const useToggle = (defaultValue = false) => {
  const [isActive, setState] = useState(defaultValue);
  const toggle = useCallback(
    (isOpen?: boolean | SyntheticEvent) =>
      setState(typeof isOpen === "boolean" ? isOpen : !isActive),
    [isActive]
  );
  const close = useCallback(() => setState(false), []);
  const open = useCallback(() => setState(true), []);
  return [isActive, toggle, open, close] as const;
};

export default useToggle;
