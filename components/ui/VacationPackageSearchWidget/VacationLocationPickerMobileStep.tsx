import React, { useCallback, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";

import MobileStepDoubleLocation from "../MobileSteps/MobileStepDoubleLocation";

import VacationPackageFlightToggle from "./VacationPackageFlightToggle";

import MobileSectionHeading from "components/ui/BookingWidget/MobileSectionHeading";
import MobileStepLocation from "components/ui/MobileSteps/MobileStepLocation";
import FlightGetLocationsQuery from "components/ui/FlightSearchWidget/queries/FlightLocations.graphql";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { gutters } from "styles/variables";
import { FlightFunnelType } from "types/enums";

const Wrapper = styled.div`
  position: relative;
`;

const StyledVacationPackageFlightToggle = styled(VacationPackageFlightToggle)`
  margin-top: ${gutters.small}px;
`;

const VacationLocationPickerMobileStep = ({
  defaultOriginId,
  defaultDestinationId,
  defaultDestination,
  defaultOrigin,
  origin,
  destination,
  onOriginLocationChange,
  onDestinationLocationChange,
  toggleVacationIncludesFlight,
  vacationIncludesFlight,
  forceOriginFocus,
  forceDestinationFocus,
}: {
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultOriginId?: string;
  defaultDestinationId?: string;
  origin?: string;
  destination?: string;
  onOriginLocationChange: (originId?: string, originName?: string, countryCode?: string) => void;
  onDestinationLocationChange: (destinationId?: string, destinationName?: string) => void;
  toggleVacationIncludesFlight: () => void;
  vacationIncludesFlight: boolean;
  forceOriginFocus?: boolean;
  forceDestinationFocus?: boolean;
}) => {
  const theme: Theme = useTheme();
  const { t } = useTranslation(Namespaces.vacationPackagesSearchN);
  const { t: vacationT } = useTranslation(Namespaces.vacationPackageNs);
  const defaultOriginInput = defaultOriginId !== "europe" && defaultOrigin ? defaultOrigin : "";
  const defaultDestinationInput =
    defaultDestinationId !== "europe" && defaultDestination ? defaultDestination : "";
  const [originInput, setOriginInput] = useState(defaultOriginInput);
  const [destinationInput, setDestinationInput] = useState(defaultDestinationInput);

  const onOriginInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOriginInput(e.target.value);
      if (e.target.value.length === 0) {
        onOriginLocationChange(undefined, undefined);
      }
    },
    [onOriginLocationChange]
  );

  const onDestinationInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDestinationInput(e.target.value);
      if (e.target.value.length === 0) {
        onDestinationLocationChange(undefined, undefined);
      }
    },
    [onDestinationLocationChange]
  );

  const { data: originData } = useQuery<FlightSearchTypes.FlightLocations>(
    FlightGetLocationsQuery,
    {
      variables: {
        input: {
          searchQuery: originInput,
          type: "From",
          funnel: FlightFunnelType.VACATION_PACKAGE,
        },
      },
    }
  );
  const { data: destinationData } = useQuery<FlightSearchTypes.FlightLocations>(
    FlightGetLocationsQuery,
    {
      variables: {
        input: {
          searchQuery: destinationInput,
          type: "To",
          funnel: FlightFunnelType.VACATION_PACKAGE,
        },
      },
    }
  );
  const originLocations = originData?.flightGetLocations?.locations ?? [];
  const destinationLocations = destinationData?.flightGetLocations?.locations ?? [];
  const fromHeading = t("Starting from");
  const toHeading = t("Going to");
  const originPlaceholder = defaultOriginId === "europe" ? defaultOrigin : fromHeading;
  const destinationPlaceholder = defaultDestinationId === "europe" ? defaultDestination : toHeading;
  const onOriginClick = useCallback(
    (item?: SharedTypes.AutocompleteItem) => {
      if (item) onOriginLocationChange(item.id, item.name, item.countryCode);
    },
    [onOriginLocationChange]
  );
  const onDestinationClick = useCallback(
    (item?: SharedTypes.AutocompleteItem) => {
      if (item) onDestinationLocationChange(item.id, item.name);
    },
    [onDestinationLocationChange]
  );
  return (
    <Wrapper>
      <MobileSectionHeading>{vacationT("Select details")}</MobileSectionHeading>
      {vacationIncludesFlight ? (
        <MobileStepDoubleLocation
          originId="vpFlightOrigin"
          destinationId="vpFlightDestination"
          defaultOrigin={defaultOrigin}
          origin={origin}
          originPlaceholder={originPlaceholder}
          originInput={originInput}
          onOriginLocationChange={onOriginInputChange}
          onDestinationLocationChange={onDestinationInputChange}
          defaultDestination={defaultDestination}
          destination={destination}
          originLabel={t("Departure")}
          destinationLabel={t("Destination")}
          originLocations={originLocations}
          destinationLocations={destinationLocations}
          destinationPlaceholder={destinationPlaceholder}
          destinationInput={destinationInput}
          onOriginItemClick={onOriginClick}
          onDestinationItemClick={onDestinationClick}
          forceFocusOrigin={forceOriginFocus}
          forceFocusDestination={forceDestinationFocus}
        />
      ) : (
        <MobileStepLocation
          startingLocationItems={destinationLocations}
          locationPlaceholder={destinationPlaceholder}
          onInputChange={onDestinationInputChange}
          onItemClick={onDestinationClick}
          defaultValue={destination}
          label={t("Destination")}
          forceFocus={forceDestinationFocus}
        />
      )}
      <StyledVacationPackageFlightToggle
        theme={theme}
        isChecked={vacationIncludesFlight}
        onChange={toggleVacationIncludesFlight}
        reverseColors
      />
    </Wrapper>
  );
};

export default VacationLocationPickerMobileStep;
