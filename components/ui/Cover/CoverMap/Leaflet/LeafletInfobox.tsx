import React, { useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { css, Global } from "@emotion/core";
import { useLazyQuery } from "@apollo/react-hooks";

import MapCard from "../Google/MapCard";
import MapCardQuery from "../../query/MapCardQuery.graphql";
import { constructMapCardQueryVariables, getMapCardData } from "../mapUtils";

import { useLeafletMapContext } from "./context/leafletContext";

import useToggle from "hooks/useToggle";
import { MAP_TYPE } from "types/enums";
import { borderRadiusCircle, whiteColor } from "styles/variables";
import { useSettings } from "contexts/SettingsContext";

export const INFOBOX_ID = "travelshift-leaflet-popup-infobox";
export const INFOBOX_WIDTH = {
  ALTERNATE: 229,
  USUAL: 160,
};
export const INFOBOX_POPUP_CLASS = "travelshift-leaflet-popup";
const StyledMapCard = styled(MapCard)(
  () => css`
    border: 0;
    width: ${INFOBOX_WIDTH}px;
  `
);

const InfoBox = () => {
  const { selectedPoint, useAlternateInfobox } = useLeafletMapContext();
  const { marketplace } = useSettings();

  // fetch point data if it does not have title
  const [fetchPointData, { data }] = useLazyQuery<{
    [key in SharedTypes.MapPointTypeValues]: MapTypes.MapCardInfoType;
  }>(MapCardQuery, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    // no need to request point data if we already have images
    if (selectedPoint?.id && !selectedPoint.description && !selectedPoint.image) {
      fetchPointData({
        variables: constructMapCardQueryVariables(selectedPoint, MAP_TYPE.GOOGLE, marketplace),
      });
    }
  }, [fetchPointData, selectedPoint, marketplace]);

  const pointData = useMemo(() => {
    if (data && selectedPoint && selectedPoint.orm_name) {
      const mapCardType = selectedPoint.orm_name;
      const mapCardItem =
        data[mapCardType] || data[selectedPoint.type] || data.itineraryMapDetail || {};
      return getMapCardData(mapCardItem, selectedPoint);
    }

    return selectedPoint;
  }, [data, selectedPoint]);

  return (
    <StyledMapCard
      key={selectedPoint?.id ?? "info-box-container"}
      pointData={pointData}
      isStreetViewAvailable={false}
      isStreetViewStatusLoading={false}
      isDirectionsEnabled={!!useAlternateInfobox}
      useAlternateInfobox={useAlternateInfobox}
    />
  );
};

const InfoBoxPortal = ({
  infoboxId,
  mapId,
  children,
}: {
  infoboxId: string;
  mapId: string;
  children: React.ReactNode;
}) => {
  const el = document.querySelector(`#${mapId} #${infoboxId}`);
  if (!el) return null;

  return createPortal(children, el);
};

const InjectGlobalStyles = React.memo(
  ({ useAlternateInfobox }: { useAlternateInfobox: boolean }) => {
    return (
      <Global
        styles={css`
          .${INFOBOX_POPUP_CLASS} {
            .leaflet-popup-content {
              margin: 0;
              min-height: ${useAlternateInfobox ? 160 : 140}px;
            }
          }
          ${useAlternateInfobox
            ? `
          .leaflet-popup-pane
            .${INFOBOX_POPUP_CLASS}
            a.leaflet-popup-close-button {
            top: -10px;
            right: -10px;
            border-radius: ${borderRadiusCircle};
            background-color: ${whiteColor};
          `
            : undefined}
        `}
      />
    );
  }
);

export const LeafletInfobox = () => {
  const { mapId, map, useAlternateInfobox, setContextState } = useLeafletMapContext();

  const [isOpen, , open, close] = useToggle(false);

  const openPopup = useCallback(() => {
    // TODO - it takes some time for leaflet to close the popup
    //  while it displays another popup...
    setTimeout(open, 250);
  }, [open]);

  const closePopup = useCallback(() => {
    close();
    setContextState({
      selectedPoint: undefined,
    });
  }, [setContextState, close]);

  useEffect(() => {
    map?.addEventListener("popupopen", openPopup);
    map?.addEventListener("popupclose", closePopup);

    return () => {
      map?.removeEventListener("popupopen", openPopup);
      map?.removeEventListener("popupclose", closePopup);
    };
  }, [closePopup, map, openPopup]);

  return (
    <>
      <InjectGlobalStyles useAlternateInfobox={useAlternateInfobox} />
      {isOpen && (
        <InfoBoxPortal infoboxId={INFOBOX_ID} mapId={mapId}>
          <InfoBox />
        </InfoBoxPortal>
      )}
    </>
  );
};

export default LeafletInfobox;
