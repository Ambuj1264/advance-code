import React, { useCallback, useEffect } from "react";
import { css, Global } from "@emotion/core";
import { useTranslation } from "react-i18next";

import { getMarkerIconByPointType } from "../mapUtils";

import { useLeafletMapContext } from "./context/leafletContext";
import { INFOBOX_ID, INFOBOX_POPUP_CLASS, INFOBOX_WIDTH } from "./LeafletInfobox";

import { whiteColor, borderRadiusBig } from "styles/variables";
import { getStaticDirPath } from "utils/globalUtils";

const LeafletPolylineMarkers = () => {
  const { instance, map, mapData, setContextState, useAlternateInfobox, showChildPoints } =
    useLeafletMapContext();
  const { t } = useTranslation();
  const onChildMarkerClick = useCallback(
    point => () => {
      setContextState({
        selectedPoint: point,
      });
    },
    [setContextState]
  );

  const onDestinationMarkerClick = useCallback(
    point => () => {
      map?.setView([point.latitude, point.longitude], 12);
      setContextState({
        showChildPoints: true,
      });
    },
    [setContextState, map]
  );

  const onSetMarkerCountInView = useCallback(() => {
    let markerInViewCount = 0;
    const hasSameFirstAndLastPoint = mapData?.points?.[0].id === mapData?.points?.slice(-1)?.[0].id;
    mapData?.points?.forEach((point, pointIndex) => {
      const isInView = map?.getBounds().contains({ lat: point.latitude, lng: point.longitude });
      const isLast = mapData.points?.length === pointIndex + 1 && hasSameFirstAndLastPoint;
      if (isInView && !isLast) {
        markerInViewCount += 1;
      }
    });
    if (markerInViewCount > 1) {
      setContextState({
        showChildPoints: false,
      });
    } else {
      setContextState({
        showChildPoints: true,
      });
    }
  }, [setContextState, map, mapData?.points]);

  useEffect(() => {
    const markers: L.Marker[] = [];
    const lines: L.Polyline[] = [];
    const onDestinationMarkerClickFns: (() => void)[] = [];
    const onChildMarkerClickFns: (() => void)[] = [];
    let childMarkerIndex = 0;
    if (instance && map && mapData?.points) {
      const hasSameFirstAndLastPoint =
        mapData.points.length > 1 && mapData.points?.[0].id === mapData.points?.slice(-1)?.[0].id;
      const line = instance.polyline([], { color: "rgba(171, 207, 251, 1)" }).addTo(map);
      mapData.points?.forEach((point, pointIndex) => {
        const extraNightText =
          pointIndex === 0 && hasSameFirstAndLastPoint
            ? mapData.points?.slice(-1)?.[0].numberOfNights
            : undefined;
        const markerTitle = `${point.title}${
          point.numberOfNights
            ? ` / ${t("{numberOfNights} nights", { numberOfNights: point.numberOfNights })}`
            : ""
        }${
          extraNightText
            ? ` + ${t("{numberOfNights} nights", { numberOfNights: extraNightText })}`
            : ""
        }`;
        const marker = instance.marker([point.latitude, point.longitude], {
          icon: instance.divIcon({
            html: `${String(
              pointIndex + 1
            )}<div class="marker-info"><span>${markerTitle}</span></div>`,
            className: "marker-icon",
            iconSize: [42, 42],
          }),
          opacity: showChildPoints ? 0 : 1,
        });
        if (!showChildPoints) {
          const eventListener = onDestinationMarkerClick(point);
          marker.addEventListener("click", eventListener);
          const currentPointIndex = pointIndex + 1;
          onDestinationMarkerClickFns[currentPointIndex] = eventListener;
          const isLast = mapData.points?.length === pointIndex + 1 && hasSameFirstAndLastPoint;
          line.addLatLng(marker.getLatLng());
          lines.push(line);
          if (!isLast) {
            marker.addTo(map);
            markers.push(marker);
          }
        }
        point.childPoints?.forEach((childPoint, childPointIndex) => {
          const childMarker = instance.marker([childPoint.latitude, childPoint.longitude], {
            icon: new instance.Icon({
              iconSize: [34, 34],
              iconUrl: getMarkerIconByPointType(childPoint.type),
            }),
            opacity: showChildPoints ? 1 : 0,
          });
          if (showChildPoints) {
            const childEventListener = onChildMarkerClick(childPoint);
            childMarker.addEventListener("click", childEventListener);
            const currentChildMarkerIndex = childPointIndex + childMarkerIndex + 1;
            onChildMarkerClickFns[currentChildMarkerIndex] = childEventListener;
            childMarker.bindPopup(`<div id="${INFOBOX_ID}"></div>`, {
              minWidth: useAlternateInfobox ? INFOBOX_WIDTH.ALTERNATE : INFOBOX_WIDTH.USUAL,
              className: INFOBOX_POPUP_CLASS,
            });
            childMarker.addTo(map);
            markers.push(childMarker);
          }
        });
        childMarkerIndex += point.childPoints?.length ?? 0;
      });
    }

    return () => {
      markers.forEach((marker, pointIndex) => {
        map?.removeLayer(marker);
        const currentPointIndex = pointIndex + 1;
        if (!showChildPoints) {
          marker.removeEventListener("click", onDestinationMarkerClickFns[currentPointIndex]);
        } else {
          marker.removeEventListener("click", onChildMarkerClickFns[currentPointIndex]);
        }
      });
      lines.forEach(line => {
        map?.removeLayer(line);
      });
    };
  }, [
    instance,
    map,
    mapData,
    onChildMarkerClick,
    useAlternateInfobox,
    onDestinationMarkerClick,
    showChildPoints,
    setContextState,
    t,
  ]);

  useEffect(() => {
    if (instance && map && mapData?.points) {
      map.on("zoomend", onSetMarkerCountInView);
    }
    return () => {
      map?.off("zoomend", onSetMarkerCountInView);
    };
  }, [map, mapData, setContextState, instance, onSetMarkerCountInView]);

  return (
    <Global
      styles={css`
        .marker-icon {
          display: flex !important;
          flex-direction: column;
          align-items: center;
          background-image: url(${`${getStaticDirPath()}/icons/map/pin.png`});
          background-position: center;
          background-size: cover;
          color: ${whiteColor};
          font-size: 14px;
          font-weight: 700;
          line-height: 36px;
          text-align: center;
        }
        .marker-info {
          margin-top: 2px;
          width: fit-content;
          span {
            border: 1px solid ${whiteColor};
            border-radius: ${borderRadiusBig};
            width: 100%;
            padding: 4px 6px;
            background-color: #50cae4;
            white-space: nowrap;
          }
        }
      `}
    />
  );
};

export default LeafletPolylineMarkers;
