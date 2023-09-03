import React, { useState, useEffect, useCallback, useRef } from "react";
import styled from "@emotion/styled";
import { loadScript } from "@travelshift/ui/hooks/useDynamicScript";
import { useLazyQuery } from "@apollo/react-hooks";

import MapCard from "../../Google/MapCard";
import MapCardQuery from "../../../query/MapCardQuery.graphql";
import { constructMapCardQueryVariables, getMapCardData } from "../../mapUtils";

import { MAP_TYPE } from "types/enums";
import { useSettings } from "contexts/SettingsContext";

const BAIDU_MAP_INFOBOX_LIB_URL = "//api.map.baidu.com/library/InfoBox/1.2/src/InfoBox_min.js";

const InfoBoxCardContainer = styled.div`
  display: none;
`;

const useInfoBox = ({
  mapInstance,
  markers,
  useAlternateInfobox,
}: {
  mapInstance?: BMap.Map;
  markers: BMap.Marker[];
  useAlternateInfobox: boolean;
}) => {
  const { marketplace } = useSettings();
  const [currentInfoBox, setCurrentInfoBox] = useState<any>();
  const [currentInfoBoxData, setCurrentInfoBoxData] = useState<{
    pointData: SharedTypes.MapPoint;
    markerItem: BMap.Marker;
  }>();
  const cardInfoBoxRef = useRef<HTMLDivElement>(null);

  const [fetchMapCarData] = useLazyQuery<{
    [key in SharedTypes.MapPointTypeValues]: MapTypes.MapCardInfoType;
  }>(MapCardQuery, {
    onCompleted: data => {
      const mapCardType = currentInfoBoxData?.pointData.orm_name;

      if (data && mapCardType && currentInfoBoxData?.markerItem) {
        const mapCardItem = data[mapCardType] || data?.itineraryMapDetail || {};
        const currentPointData = currentInfoBoxData?.pointData;

        setCurrentInfoBoxData({
          markerItem: currentInfoBoxData?.markerItem,
          pointData: getMapCardData(mapCardItem, currentPointData),
        });
      }
    },
  });

  const handleMarkerClick = useCallback(
    (markerItem: BMap.Marker) => (event: any) => {
      const {
        target: { pointData: currentPointData },
      } = event as {
        target: {
          pointData: SharedTypes.MapPoint;
        };
      };

      setCurrentInfoBoxData({
        pointData: currentPointData,
        markerItem,
      });

      if (currentPointData?.id && !currentPointData?.title) {
        fetchMapCarData({
          variables: constructMapCardQueryVariables(currentPointData, MAP_TYPE.BAIDU, marketplace),
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(
    function initInfoBox() {
      if (!mapInstance) return;

      const createInfoWindow = () => {
        // eslint-disable-next-line array-callback-return
        markers.map(markerItem => {
          markerItem.addEventListener("click", handleMarkerClick(markerItem));
        });
      };

      if (!window.BMapLib) {
        loadScript("baiduInfoBox", BAIDU_MAP_INFOBOX_LIB_URL, {}, createInfoWindow);
      } else {
        createInfoWindow();
      }

      // eslint-disable-next-line consistent-return
      return () => {
        markers.map(markerItem =>
          markerItem.removeEventListener("click", handleMarkerClick(markerItem))
        );
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mapInstance, mapInstance, markers]
  );

  useEffect(
    function createMapInfoBox() {
      if (cardInfoBoxRef.current?.innerHTML) {
        if (currentInfoBox) {
          currentInfoBox.close();
        }

        const infoBox = new window.BMapLib.InfoBox(mapInstance, cardInfoBoxRef.current?.innerHTML, {
          boxStyle: {
            width: "160px",
            height: "135px",
          },
        });

        infoBox.open(currentInfoBoxData?.markerItem);

        setCurrentInfoBox(infoBox);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cardInfoBoxRef?.current?.innerHTML, currentInfoBoxData]
  );

  const infoBoxCardContainer = (
    <InfoBoxCardContainer ref={cardInfoBoxRef}>
      <MapCard
        pointData={currentInfoBoxData?.pointData}
        useAlternateInfobox={useAlternateInfobox}
        isStreetViewAvailable={false}
        isStreetViewStatusLoading={false}
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      />
    </InfoBoxCardContainer>
  );

  return { infoBoxCardContainer, infoBox: currentInfoBox };
};

export default useInfoBox;
