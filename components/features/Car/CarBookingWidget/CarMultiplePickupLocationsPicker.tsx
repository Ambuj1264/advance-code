import React, { useState, useCallback, useMemo, MutableRefObject, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import rgba from "polished/lib/color/rgba";

import {
  getCarLocationKeyId,
  getCarTiedReturnLocations,
  getCarUniquePickupLocations,
} from "./utils/carBookingWidgetUtils";

import ContentDropdown, {
  DisplayValue,
  DropdownContainer,
  DropdownContentWrapper,
} from "components/ui/Inputs/ContentDropdown";
import useToggle from "hooks/useToggle";
import AirportIcon from "components/icons/airport.svg";
import HotelIcon from "components/icons/house-heart.svg";
import LocationIcon from "components/icons/gps.svg";
import TrainStationIcon from "components/icons/train-station.svg";
import { LocationType } from "types/enums";
import {
  borderRadiusSmall,
  borderRadiusTiny,
  fontWeightSemibold,
  greyColor,
  gutters,
  guttersPx,
  separatorColorLight,
} from "styles/variables";
import { container } from "styles/base";

const getIconByLocationType = (locationType?: LocationType) => {
  switch (locationType?.toLocaleLowerCase()) {
    case LocationType.AIRPORT:
      return <AirportIcon />;
    case LocationType.HOTEL:
      return <HotelIcon />;
    case LocationType.CITY:
      return <LocationIcon />;
    case LocationType.TRAIN_STATION:
      return <TrainStationIcon />;

    default:
      return <LocationIcon />;
  }
};

const StyledContentDropdown = styled(ContentDropdown)<{
  highlightOnOpen: boolean;
  isContentOpen: boolean;
}>(({ isContentOpen, theme, highlightOnOpen }) => [
  css`
    ${container} {
      padding: 0;
    }

    ${DropdownContentWrapper} {
      padding: ${guttersPx.smallHalf} 0;
    }

    ${DisplayValue} {
      border-color: ${separatorColorLight};
    }

    ${DropdownContainer} {
      border-color: ${separatorColorLight};
    }
  `,
  highlightOnOpen &&
    isContentOpen &&
    css`
      position: relative;
      &::before {
        content: "";
        position: absolute;
        right: 4px;
        left: 4px;
        display: block;
        border-radius: ${borderRadiusTiny};
        height: 100%;
        background: ${rgba(theme.colors.primary, 0.1)};
      }
    `,
]);

const CarLocationIconWrapper = styled.span(
  () => css`
    flex-grow: 0;
    flex-shrink: 0;
    margin-right: ${guttersPx.small};
    width: 16px;
    height: 16px;
    svg {
      width: 100%;
      height: 100%;
      fill: ${greyColor};
    }
  `
);

const selectedIconStyle = (theme: Theme) => css`
  svg {
    fill: ${theme.colors.primary};
  }
`;

const CarLocationText = styled.span`
  flex-grow: 1;
  text-align: center;
`;

const StyledDisplayValue = styled(DisplayValue)<{ isSelected: boolean }>(
  ({ isSelected, theme }) => css`
    margin-top: 0;
    border: none;
    border-radius: 0;
    padding: 0 ${guttersPx.small};

    background: ${isSelected ? rgba(theme.colors.primary, 0.1) : ""};

    &:hover {
      background: ${rgba(theme.colors.primary, 0.1)};
    }
    ${CarLocationText} {
      font-weight: ${fontWeightSemibold};
      text-align: left;
    }
  `
);

const Separator = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 1px;
  height: 24px;
  background-color: ${rgba(greyColor, 0.5)};
`;

const ContentDropdownDoubleWrapper = styled.div<{}>`
  display: flex;
  align-items: center;
  margin-top: ${guttersPx.smallHalf};
  border: 1px solid ${separatorColorLight};
  border-radius: ${borderRadiusSmall};
  height: 42px;
  padding: ${gutters.small / 4} 0;

  ${StyledContentDropdown} {
    width: 50%;
    ${DisplayValue} {
      margin: 0;
      border: none;
      height: 30px;

      ${CarLocationText} {
        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    ${DropdownContainer} {
      top: 40px;
      border-color: ${separatorColorLight};
    }

    &:nth-child(1) {
      ${DropdownContainer} {
        right: -100%;
        left: 0;
      }
    }

    &:nth-child(3) {
      ${DropdownContainer} {
        right: 0;
        left: -100%;
      }
    }
  }
`;

const constructDropdownActiveDisplayValue = (
  locationData?: CarTypes.AvailableLocationPickupOrDropOff
) => {
  return (
    <>
      <CarLocationIconWrapper css={selectedIconStyle}>
        {getIconByLocationType(locationData?.locationType as LocationType)}
      </CarLocationIconWrapper>
      <CarLocationText>{locationData?.name}</CarLocationText>
    </>
  );
};

const CarMultiplePickupLocationsPicker = ({
  locations,
  selectedLocationOfferId = "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onAfterLocationSelect = () => {},
  singleLocationsLabel,
  doubleLocationsLabel,
  isMobileSearchWidgetBtnClicked,
}: {
  locations?: CarTypes.AvailableLocation[];
  selectedLocationOfferId?: string;
  onAfterLocationSelect?: (location: CarTypes.AvailableLocation) => void;
  singleLocationsLabel: React.ReactElement;
  doubleLocationsLabel: React.ReactElement;
  isMobileSearchWidgetBtnClicked?: MutableRefObject<boolean | undefined>;
}) => {
  const [selectedLocation, setSelectedLocation] = useState<CarTypes.AvailableLocation | undefined>(
    locations?.find(location => location.idContext === selectedLocationOfferId) ?? locations?.[0]
  );

  const [
    isLocationDropdownOpen,
    toggleLocationDropdown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _,
    closeLocationDropdown,
  ] = useToggle(false);

  const [
    isDropoffLocationDropdownOpen,
    toggleDropoffLocationDropdown,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _unused,
    closeDropoffLocationDropdown,
  ] = useToggle(false);

  const samePickupDropoffAcrossAllLocations = useMemo(
    () =>
      locations?.every(
        location =>
          location.pickupLocation.name === location.returnLocation.name &&
          location.pickupLocation.locationType === location.returnLocation.locationType
      ),
    [locations]
  );

  const constructDropdownListItems = useCallback(
    (
      isPickupLocationDisplay,
      matchSelectedItemCriteria: "byName" | "byId",
      availableLocations?: CarTypes.AvailableLocation[],
      disableOnClick?: boolean
    ) => {
      if (!availableLocations?.length) return null;

      return availableLocations?.map(location => (
        <StyledDisplayValue
          onClick={() => {
            if (isPickupLocationDisplay) {
              closeLocationDropdown();
            } else {
              closeDropoffLocationDropdown();
            }

            if (!disableOnClick) {
              setSelectedLocation(location);
              onAfterLocationSelect?.(location);

              // this is to overcome history being navigated back when we push the new state
              // https://github.com/GuideToIceland/monorepo/blob/86d952cf6a26625279e0399302a465c4bbd1c76a/src/js/web/src/hooks/useMobileWidgetBackButton.tsx#L56-L61
              if (isMobileSearchWidgetBtnClicked) {
                // eslint-disable-next-line no-param-reassign
                isMobileSearchWidgetBtnClicked.current = true;
              }
            }
          }}
          isSelected={
            matchSelectedItemCriteria === "byName"
              ? getCarLocationKeyId(location.pickupLocation) ===
                getCarLocationKeyId(selectedLocation?.pickupLocation)
              : selectedLocation?.idContext === location.idContext
          }
          key={`${
            matchSelectedItemCriteria === "byName"
              ? getCarLocationKeyId(location.pickupLocation)
              : location.idContext
          }`}
        >
          <CarLocationIconWrapper>
            {getIconByLocationType(
              (isPickupLocationDisplay
                ? location.pickupLocation.locationType
                : location.returnLocation.locationType) as LocationType
            )}
          </CarLocationIconWrapper>
          <CarLocationText>
            {isPickupLocationDisplay ? location.pickupLocation.name : location.returnLocation.name}
          </CarLocationText>
        </StyledDisplayValue>
      ));
    },
    [
      selectedLocation?.pickupLocation,
      selectedLocation?.idContext,
      onAfterLocationSelect,
      isMobileSearchWidgetBtnClicked,
      closeLocationDropdown,
      closeDropoffLocationDropdown,
    ]
  );

  const tiedPickupLocations = useMemo(
    () => getCarUniquePickupLocations(locations, selectedLocation),
    [locations, selectedLocation]
  );

  const tiedReturnLocations = useMemo(
    () => getCarTiedReturnLocations(locations, selectedLocation),
    [locations, selectedLocation]
  );

  useEffect(
    () => () => {
      if (isMobileSearchWidgetBtnClicked && isMobileSearchWidgetBtnClicked.current) {
        // eslint-disable-next-line no-param-reassign
        isMobileSearchWidgetBtnClicked.current = false;
      }
    },
    [isMobileSearchWidgetBtnClicked]
  );

  if (samePickupDropoffAcrossAllLocations) {
    return (
      <>
        {singleLocationsLabel}
        <StyledContentDropdown
          highlightOnOpen={false}
          isContentOpen={isLocationDropdownOpen}
          toggleContent={toggleLocationDropdown}
          id="multiple-pickup-locations"
          onOutsideClick={closeLocationDropdown}
          displayValue={constructDropdownActiveDisplayValue(selectedLocation?.pickupLocation)}
        >
          {constructDropdownListItems(true, "byId", locations, locations?.length === 1)}
        </StyledContentDropdown>
      </>
    );
  }

  const disableSingleLocationOnClick =
    tiedPickupLocations.length === tiedReturnLocations.length && tiedPickupLocations.length === 1;

  return (
    <>
      {doubleLocationsLabel}
      <ContentDropdownDoubleWrapper>
        <StyledContentDropdown
          highlightOnOpen
          isContentOpen={isLocationDropdownOpen}
          toggleContent={toggleLocationDropdown}
          id="multiple-pickup-locations-pickup"
          onOutsideClick={closeLocationDropdown}
          displayValue={constructDropdownActiveDisplayValue(selectedLocation?.pickupLocation)}
        >
          {constructDropdownListItems(
            true,
            "byName",
            tiedPickupLocations,
            disableSingleLocationOnClick
          )}
        </StyledContentDropdown>
        <Separator />
        <StyledContentDropdown
          highlightOnOpen
          isContentOpen={isDropoffLocationDropdownOpen}
          toggleContent={toggleDropoffLocationDropdown}
          id="multiple-pickup-locations-dropoff"
          onOutsideClick={closeDropoffLocationDropdown}
          displayValue={constructDropdownActiveDisplayValue(selectedLocation?.returnLocation)}
        >
          {constructDropdownListItems(
            false,
            "byId",
            tiedReturnLocations,
            disableSingleLocationOnClick
          )}
        </StyledContentDropdown>
      </ContentDropdownDoubleWrapper>
    </>
  );
};

export default CarMultiplePickupLocationsPicker;
