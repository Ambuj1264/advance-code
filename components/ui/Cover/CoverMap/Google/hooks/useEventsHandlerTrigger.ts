import { useState, useRef, RefObject, useEffect } from "react";

const useEventsHandler = ({
  events,
  eventOptions = {
    once: true,
    capture: true,
    passive: true,
  },
  handler,
}: {
  events: string[];
  eventOptions?: {
    once: boolean;
    capture: boolean;
    passive: boolean;
  };
  handler?: EventListener;
}): [RefObject<HTMLDivElement> | null, boolean] => {
  const elementRef = useRef<HTMLDivElement>(null);

  const [eventFired, setEventFired] = useState<boolean>(false);

  useEffect(
    function bindListenerToListOfEvents() {
      const eventListener: EventListener = event => {
        setEventFired(true);
        handler?.(event);
      };
      const element = elementRef.current;
      events.map(event => {
        return element?.addEventListener(event, eventListener, eventOptions);
      });

      return () => {
        events.map(event => {
          return element?.removeEventListener(event, eventListener, eventOptions);
        });
      };
    },
    [events, eventOptions, handler]
  );

  return [elementRef, eventFired];
};

export default useEventsHandler;
