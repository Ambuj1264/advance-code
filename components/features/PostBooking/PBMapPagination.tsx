import React from "react";
import rgba from "polished/lib/color/rgba";
import styled from "@emotion/styled";

import { PostBookingTypes } from "./types/postBookingTypes";
import { useGetPBClientRoutes } from "./hooks/useGetPBClientRoutes";

import { MapOverlayWrapper, MapOverlayLink, Wrapper } from "components/ui/Map/MapOverlayLinks";
import { getShortMonthNumbericDateFormat } from "utils/dateUtils";
import useActiveLocale from "hooks/useActiveLocale";
import { lightBlueColor, zIndex } from "styles/variables";

const MapOverlayWrapperStyled = styled(MapOverlayWrapper)`
  position: relative;
  z-index: ${zIndex.z4};
  background-color: ${rgba(lightBlueColor, 0.1)};
`;

const PBMapPagination = ({
  className,
  navigationDays,
  activeDay = 1,
}: {
  className?: string;
  navigationDays?: PostBookingTypes.NavigationDay[];
  activeDay?: number;
}) => {
  const activeLocale = useActiveLocale();
  const { getDayNavigationClientRoute } = useGetPBClientRoutes();

  return (
    <MapOverlayWrapperStyled id="mapHeader" className={className} alwaysDisplay>
      <Wrapper>
        {navigationDays?.map(day => {
          const isActive = activeDay === day.dayNumber;
          const dayTitle = getShortMonthNumbericDateFormat(day.dateWithoutTimezone, activeLocale);

          return (
            <MapOverlayLink
              key={day.dayNumber}
              clientRoute={getDayNavigationClientRoute(day.dayNumber, true)}
              isActive={isActive}
            >
              {dayTitle}
            </MapOverlayLink>
          );
        })}
      </Wrapper>
    </MapOverlayWrapperStyled>
  );
};

export default PBMapPagination;
