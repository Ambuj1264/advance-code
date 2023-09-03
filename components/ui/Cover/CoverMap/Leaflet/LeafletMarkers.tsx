import React, { useCallback, useEffect } from "react";
import { css, Global } from "@emotion/core";

import { getMarkerIconByPointType } from "../mapUtils";

import { useLeafletMapContext } from "./context/leafletContext";
import { INFOBOX_ID, INFOBOX_POPUP_CLASS, INFOBOX_WIDTH } from "./LeafletInfobox";

import { borderRadiusCircle, fontWeightBold, whiteColor } from "styles/variables";

const LeafletMarkers = () => {
  const { instance, map, mapData, setContextState, useAlternateInfobox, isClusteringEnabled } =
    useLeafletMapContext();

  const onMarkerClick = useCallback(
    point => () => {
      setContextState({
        selectedPoint: point,
      });
    },
    [setContextState]
  );
  useEffect(() => {
    let markersInCluster: L.Marker[] = [];
    const markers: L.Marker[] = [];
    if (instance && map && mapData?.points) {
      markersInCluster = isClusteringEnabled
        ? // @ts-ignore
          instance.markerClusterGroup({
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            // @ts-ignore
            iconCreateFunction(cluster) {
              return instance.divIcon({
                html: cluster.getChildCount(),
                className: "travelshift-markers-cluster",
                iconSize: [34, 34],
              });
            },
          })
        : [];
      mapData.points?.forEach(point => {
        const marker = instance.marker([point.latitude, point.longitude], {
          icon: new instance.Icon({
            iconSize: [34, 34],
            iconUrl: getMarkerIconByPointType(point.type),
          }),
        });
        marker.addEventListener("click", onMarkerClick(point));
        marker.bindPopup(`<div id="${INFOBOX_ID}"></div>`, {
          minWidth: useAlternateInfobox ? INFOBOX_WIDTH.ALTERNATE : INFOBOX_WIDTH.USUAL,
          className: INFOBOX_POPUP_CLASS,
        });

        if (isClusteringEnabled && !point.excludeFromClusterisation) {
          // @ts-ignore
          markersInCluster.addLayer(marker);
        } else {
          marker.addTo(map);
          markers.push(marker);
        }
      });

      if (isClusteringEnabled) {
        // @ts-ignore;
        map.addLayer(markersInCluster);
      }
    }

    return () => {
      // @ts-ignore
      map?.removeLayer(markersInCluster);
      markers.forEach(marker => {
        map?.removeLayer(marker);
      });
    };
  }, [instance, isClusteringEnabled, map, mapData, onMarkerClick, useAlternateInfobox]);

  return (
    <Global
      styles={css`
        .travelshift-markers-cluster {
          box-shadow: 0px 0px 8px 0px #80c348;
          border: 1px solid ${whiteColor};
          border-radius: ${borderRadiusCircle};
          padding-top: 7px;
          background: #80c348;
          color: ${whiteColor};
          font-weight: ${fontWeightBold};
          text-align: center;
        }
      `}
    />
  );
};

export default LeafletMarkers;
