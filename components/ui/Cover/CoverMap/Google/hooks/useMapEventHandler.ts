import { useEffect } from "react";

const useMapEventHandler = ({
  mapInstance,
  event,
  handler,
}: {
  mapInstance?: google.maps.Map;
  event: "click";
  handler: (event: google.maps.MouseEvent) => void;
}) => {
  useEffect(
    function attachMapClickEvent() {
      if (!mapInstance) {
        return () => {};
      }

      const eventListener = window.google.maps.event.addListener(mapInstance, "click", handler);

      return () => {
        window.google.maps.event.removeListener(eventListener);
      };
    },
    [mapInstance, event, handler]
  );
};

export default useMapEventHandler;
