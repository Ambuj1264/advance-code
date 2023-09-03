import React, { useState, useCallback } from "react";
import { useQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";

import SingleLocationPicker from "components/ui/SearchWidget/SingleLocationPicker";
import DoubleLocationPicker from "components/ui/SearchWidget/DoubleLocationPicker";
import Label, { LabelParagraph } from "components/ui/SearchWidget/Label";
import FlightGetLocationsQuery from "components/ui/FlightSearchWidget/queries/FlightLocations.graphql";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { AutoCompleteType, FlightFunnelType } from "types/enums";
import { mqMin } from "styles/base";

const LabelsWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;

  ${LabelParagraph} {
    flex-grow: 1;
  }
`;

const StyledDoubleLocationPicker = styled(DoubleLocationPicker)`
  height: 48px;
  ${mqMin.large} {
    height: 50px;
  }
`;

const VacationLocationPicker = ({
  onOriginLocationChange,
  onOriginLocationClick,
  onDestinationLocationClick,
  onDestinationLocationChange,
  destination,
  defaultDestination,
  origin,
  defaultOrigin,
  isMobile,
  defaultDestinationId,
  defaultOriginId,
  vacationIncludesFlight,
  hideLabels = false,
  isOnProductPage = false,
  className,
  isOpen = false,
  originInputRef,
}: {
  isMobile: boolean;
  hideLabels?: boolean;
  onOriginLocationChange: (originId?: string, originName?: string, countryCode?: string) => void;
  onDestinationLocationChange: (destinationId?: string, destinationName?: string) => void;
  onOriginLocationClick?: () => void;
  onDestinationLocationClick?: () => void;
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultOriginId?: string;
  defaultDestinationId?: string;
  origin?: string;
  destination?: string;
  vacationIncludesFlight?: boolean;
  isOnProductPage?: boolean;
  className?: string;
  isOpen?: boolean;
  originInputRef?: React.MutableRefObject<VacationPackageTypes.originInputRef>;
}) => {
  const { t: vacationT } = useTranslation(Namespaces.vacationPackageNs);
  const defaultOriginInput = defaultOriginId !== "europe" && defaultOrigin ? defaultOrigin : "";
  const defaultDestinationInput =
    defaultDestinationId !== "europe" && defaultDestination ? defaultDestination : "";
  const [originInput, setOriginInput] = useState(defaultOriginInput);
  const [destinationInput, setDestinationInput] = useState(defaultDestinationInput);

  const onDestinationInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDestinationInput(e.target.value);
      if (e.target.value.length === 0) {
        onDestinationLocationChange(undefined, undefined);
      }
    },
    [onDestinationLocationChange]
  );

  const onOriginInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setOriginInput(e.target.value);
      if (e.target.value.length === 0) {
        onOriginLocationChange(undefined, undefined, undefined);
      }
    },
    [onOriginLocationChange]
  );

  const { data: originData } = useQuery<FlightSearchTypes.FlightLocations>(
    FlightGetLocationsQuery,
    {
      variables: {
        input: {
          searchQuery: originInput.toLowerCase(),
          type: "From",
          funnel: FlightFunnelType.VACATION_PACKAGE,
        },
      },
      skip: !vacationIncludesFlight,
    }
  );
  const { data: destinationData } = useQuery<FlightSearchTypes.FlightLocations>(
    FlightGetLocationsQuery,
    {
      variables: {
        input: {
          searchQuery: destinationInput.toLowerCase(),
          type: "To",
          funnel: FlightFunnelType.VACATION_PACKAGE,
        },
      },
    }
  );
  const originLocations = originData?.flightGetLocations?.locations ?? [];
  const destinationLocations = destinationData?.flightGetLocations?.locations ?? [];
  const originPlaceholder =
    defaultOriginId === "europe" ? defaultOrigin : vacationT("Starting from");
  const destinationPlaceholder =
    defaultDestinationId === "europe" ? defaultDestination : vacationT("Going to");
  return (
    <>
      {!hideLabels && (
        <LabelsWrapper className={className}>
          {!vacationIncludesFlight && <Label>{vacationT("Location")}</Label>}
          {vacationIncludesFlight && <Label>{vacationT("From")}</Label>}
          {vacationIncludesFlight && <Label>{vacationT("To")}</Label>}
        </LabelsWrapper>
      )}
      {vacationIncludesFlight && (
        <StyledDoubleLocationPicker
          firstAutocompleteInputType={AutoCompleteType.PLANE_TAKEOFF}
          secondAutocompleteInputType={AutoCompleteType.PLANE_LAND}
          id="vpsearch-widget-location-picker"
          isMobile={isMobile}
          onOriginLocationChange={onOriginLocationChange}
          onDestinationLocationChange={onDestinationLocationChange}
          onOriginLocationClick={onOriginLocationClick}
          onDestinationLocationClick={onDestinationLocationClick}
          defaultOrigin={defaultOrigin}
          defaultDestination={defaultDestination}
          origin={origin}
          destination={destination}
          originPlaceholder={originPlaceholder}
          destinationPlaceholder={destinationPlaceholder}
          originLocations={originLocations}
          destinationLocations={destinationLocations}
          onOriginInputChange={onOriginInputChange}
          onDestinationInputChange={onDestinationInputChange}
          disableDestinationInput={isOnProductPage}
          className={className}
          isOpen={isOpen}
          originInputRef={originInputRef}
        />
      )}
      {!vacationIncludesFlight && (
        <SingleLocationPicker
          id="vpsearch-widget-single-location-picker"
          isMobile={isMobile}
          onOriginLocationChange={onDestinationLocationChange}
          onLocationClick={onDestinationLocationClick}
          defaultOrigin={defaultDestination}
          origin={destination}
          originPlaceholder={destinationPlaceholder}
          originLocations={destinationLocations}
          onOriginInputChange={onDestinationInputChange}
          className={className}
        />
      )}
    </>
  );
};

export default VacationLocationPicker;
