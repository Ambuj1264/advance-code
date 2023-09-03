import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import L from "leaflet";

type LeafletMapContext = {
  map?: L.Map;
  mapData?: SharedTypes.Map;
  mapId: string;
  maxZoom: number;
  instance?: typeof L;
  selectedPoint?: SharedTypes.MapPoint;
  useAlternateInfobox: boolean;
  isDirectionsEnabled: boolean;
  isClusteringEnabled: boolean;
  isUsingPolyLine: boolean;
  showChildPoints?: boolean;
  setContextState: (newState: Partial<LeafletMapContext>) => void;
};

const defaultCtxState: LeafletMapContext = {
  map: undefined,
  mapData: undefined,
  mapId: "map",
  maxZoom: 18,
  instance: undefined,
  selectedPoint: undefined,
  useAlternateInfobox: false,
  isDirectionsEnabled: false,
  isClusteringEnabled: true,
  isUsingPolyLine: false,
  showChildPoints: false,
  // @ts-ignore
  setContextState: () => {},
};

const Context = React.createContext(defaultCtxState);

export const useLeafletMapContext = () => useContext(Context);

export const LeafletMapProvider = ({
  children,
  ...props
}: Omit<LeafletMapContext, "setContextState"> & {
  children: React.ReactNode;
}) => {
  const [defaultState, setDefaultState] = useState(props);
  const setContextState = useCallback((newPartialState: Partial<LeafletMapContext>) => {
    setDefaultState(prevState => ({
      ...prevState,
      ...newPartialState,
    }));
  }, []);

  useEffect(() => {
    setContextState({
      mapData: props.mapData,
    });
  }, [props.mapData, setContextState]);

  const contextValue = useMemo(
    () => ({
      ...defaultState,
      setContextState,
    }),
    [defaultState, setContextState]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
