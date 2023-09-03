import { useEffect, SyntheticEvent } from "react";

const useMapEventHandler = ({
  mapInstance,
  handler,
}: {
  mapInstance?: BMap.Map;
  handler: (event: SyntheticEvent) => void;
}) => {
  useEffect(
    function attachMapClickEvent() {
      if (!mapInstance) {
        return () => {};
      }

      mapInstance?.addEventListener("click", handler);

      return () => mapInstance?.removeEventListener("click", handler);
    },
    [mapInstance, handler]
  );
};

export default useMapEventHandler;
