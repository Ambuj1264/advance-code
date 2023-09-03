import { useEffect, MutableRefObject, useCallback } from "react";
import { KeyboardKey } from "@travelshift/ui/types/enums";

import { useModalHistoryContext } from "contexts/ModalHistoryContext";

// TODO: cover with test, it's a copy of useOnOutsideClick
export default function useOnModalOutsideClick({
  ref,
  handler,
  modalId,
}: {
  ref: MutableRefObject<Element | null>;
  handler: (event: Event) => void;
  modalId?: string;
}) {
  const { currentId } = useModalHistoryContext();

  const listener = useCallback(
    (event: Event) => {
      const { target } = event;
      const element = ref.current;

      // do nothing if modal is not the latest one
      if (currentId !== modalId) return;

      // Do nothing if clicking ref's element or descendent elements
      if ((element && target instanceof Node && element.contains(target)) || element === null) {
        return;
      }

      handler(event);
    },
    [currentId, handler, modalId, ref]
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === KeyboardKey.Escape) {
        handler(event);
      }
    },
    [handler]
  );

  useEffect(() => {
    if (!ref.current || !handler) {
      return undefined;
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", listener);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", listener);
    };
  }, [currentId, handler, listener, modalId, onKeyDown, ref]);
}
