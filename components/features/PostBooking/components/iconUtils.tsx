import React from "react";
import styled from "@emotion/styled";
import { getFlagIcon } from "@travelshift/ui/utils/flagUtils";
import { css } from "@emotion/core";

import { PB_ITINERARY_ICON_TYPE, PB_ITINERARY_TRAVELMODE_TYPE } from "../types/postBookingEnums";

import { hotPink } from "styles/variables";
import { DateIcon } from "components/ui/DateIcon/DateIcon";
import { mqMin } from "styles/base";
import CustomNextDynamic from "lib/CustomNextDynamic";
import IconLoading from "components/ui/utils/IconLoading";

const PlaceIcon = CustomNextDynamic(() => import("components/icons/gps.svg"), {
  loading: IconLoading,
});
const FlightIcon = CustomNextDynamic(() => import("components/icons/plane-1.svg"), {
  loading: IconLoading,
});
const PickupCarIcon = CustomNextDynamic(() => import("components/icons/car-actions-check-1.svg"), {
  loading: IconLoading,
});
const DriveCarIcon = CustomNextDynamic(() => import("components/icons/car.svg"), {
  loading: IconLoading,
});
const StayIcon = CustomNextDynamic(() => import("components/icons/house-heart.svg"), {
  loading: IconLoading,
});
const WalkIcon = CustomNextDynamic(() => import("components/icons/walk.svg"), {
  loading: IconLoading,
});
const DrinkIcon = CustomNextDynamic(() => import("components/icons/cocktail-glass.svg"), {
  loading: IconLoading,
});
const FoodIcon = CustomNextDynamic(() => import("components/icons/fork-knife.svg"), {
  loading: IconLoading,
});
const FlightTicket = CustomNextDynamic(() => import("components/icons/travel-ticket.svg"), {
  loading: IconLoading,
});
const GteFavicon = CustomNextDynamic(() => import("components/icons/gte-favicon.svg"), {
  loading: IconLoading,
});
const TravelerIcon = CustomNextDynamic(() => import("components/icons/traveler.svg"), {
  loading: IconLoading,
});

const StyledDriveCar = styled(DriveCarIcon)(({ theme }) => `fill: ${theme.colors.primary}`);

const StyledGteFavicon = styled(GteFavicon)(({ theme }) => `fill: ${theme.colors.primary}`);

const StyledFlight = styled(FlightIcon)(({ theme }) => `fill: ${theme.colors.primary}`);

const StyledFlightTicket = styled(FlightTicket)(({ theme }) => `fill: ${theme.colors.primary}`);

const StyledPickupCar = styled(PickupCarIcon)(({ theme }) => `fill: ${theme.colors.primary}`);
const StyledWalk = styled(WalkIcon)(({ theme }) => `fill: ${theme.colors.primary}`);

const StyledTouristWalk = styled(TravelerIcon)(({ theme }) => `fill: ${theme.colors.primary}`);

const StyledStay = styled(StayIcon)`
  fill: ${hotPink};
`;

const StyledPlace = styled(PlaceIcon)`
  fill: ${hotPink};
`;

const StyledFood = styled(FoodIcon)`
  fill: ${hotPink};
`;

const StyledDrink = styled(DrinkIcon)`
  fill: ${hotPink};
`;

const StyledFlagWrapper = styled.div(
  () => css`
    border-radius: 50%;
    width: 16px;
    height: 16px;
    overflow: hidden;

    > svg {
      position: relative;
      top: -4px;
      transform: scale(1.8);
    }

    ${mqMin.large} {
      width: 24px;
      height: 24px;

      > svg {
        position: relative;
        top: -1px;
        max-height: 100%;
      }
    }
  `
);

const NoIcon = styled.div``;

const getTimelineMarkerIcon = (iconType: PB_ITINERARY_ICON_TYPE) => {
  switch (iconType) {
    case PB_ITINERARY_ICON_TYPE.DRINK:
      return <StyledDrink />;
    case PB_ITINERARY_ICON_TYPE.CAR:
      return <StyledDriveCar />;
    case PB_ITINERARY_ICON_TYPE.FLIGHT:
      return <StyledFlight />;
    case PB_ITINERARY_ICON_TYPE.FLIGHT_DEPART:
      return <StyledFlightTicket />;
    case PB_ITINERARY_ICON_TYPE.RESTAURANT:
      return <StyledFood />;
    case PB_ITINERARY_ICON_TYPE.CAR_CHECKMARK:
      return <StyledPickupCar />;
    case PB_ITINERARY_ICON_TYPE.MARKER:
    case PB_ITINERARY_ICON_TYPE.CAMERA:
      return <StyledPlace />;
    case PB_ITINERARY_ICON_TYPE.HOUSE_WITH_HEART:
      return <StyledStay />;
    case PB_ITINERARY_ICON_TYPE.HUMAN_WALK:
      return <StyledWalk />;
    case PB_ITINERARY_ICON_TYPE.TOURIST_WALK:
    case PB_ITINERARY_ICON_TYPE.TOURS_AND_TICKETS:
      return <StyledTouristWalk />;
    default:
      return <NoIcon />;
  }
};

export const getTravelModeIcon = (type: PB_ITINERARY_TRAVELMODE_TYPE) => {
  switch (type) {
    case PB_ITINERARY_TRAVELMODE_TYPE.DRIVING:
      return <StyledDriveCar />;
    case PB_ITINERARY_TRAVELMODE_TYPE.WALK:
      return <StyledWalk />;
    case PB_ITINERARY_TRAVELMODE_TYPE.FLIGHT:
      return <StyledFlight />;
    case PB_ITINERARY_TRAVELMODE_TYPE.UNKNOWN:
    default:
      return <NoIcon />;
  }
};

export const getCustomIcon = (
  iconType: PB_ITINERARY_ICON_TYPE,
  date?: Date,
  countryCode?: string
) => {
  if (iconType === PB_ITINERARY_ICON_TYPE.CALENDAR && date) {
    return <DateIcon date={date} />;
  }
  if (iconType === PB_ITINERARY_ICON_TYPE.COUNTRY_FLAG) {
    const Flag = getFlagIcon(countryCode) || (StyledGteFavicon as React.ComponentType);
    return (
      <StyledFlagWrapper>
        <Flag />
      </StyledFlagWrapper>
    );
  }

  return getTimelineMarkerIcon(iconType);
};
