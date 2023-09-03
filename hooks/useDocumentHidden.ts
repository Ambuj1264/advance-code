import { useEffect } from "react";

import { useDebouncedCallback } from "./useDebounce";

const useDocumentHidden = ({
  onDocumentHiddenStatusChange,
  debounceTimer = 0,
}: {
  onDocumentHiddenStatusChange: () => void;
  debounceTimer?: number;
}) => {
  const debouncedHandler = useDebouncedCallback(onDocumentHiddenStatusChange, debounceTimer);
  useEffect(() => {
    document.addEventListener("visibilitychange", debouncedHandler);
    return () => document.removeEventListener("visibilitychange", debouncedHandler);
  }, [debouncedHandler, onDocumentHiddenStatusChange]);
};

export default useDocumentHidden;
