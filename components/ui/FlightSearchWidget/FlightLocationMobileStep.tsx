import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";

import MobileStepDoubleLocation from "../MobileSteps/MobileStepDoubleLocation";

import FlightGetLocationsQuery from "./queries/FlightLocations.graphql";

import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";
import { AutoCompleteType, FlightFunnelType } from "types/enums";

const FlightLocationMobileStep = ({
  onOriginLocationChange,
  onDestinationLocationChange,
  defaultOrigin,
  defaultDestination,
  defaultOriginId,
  defaultDestinationId,
  origin,
  destination,
  disableDestinationInput = false,
  forceOriginFocus,
  forceDestinationFocus,
}: {
  onOriginLocationChange: (originId?: string, originName?: string) => void;
  onDestinationLocationChange: (destinationId?: string, destinationName?: string) => void;
  defaultOrigin?: string;
  defaultDestination?: string;
  defaultOriginId?: string;
  defaultDestinationId?: string;
  origin?: string;
  destination?: string;
  disableDestinationInput?: boolean;
  forceOriginFocus?: boolean;
  forceDestinationFocus?: boolean;
}) => {
  const { t } = useTranslation(Namespaces.flightSearchNs);
  const defaultOriginInput = defaultOriginId !== "europe" && defaultOrigin ? defaultOrigin : "";
  const defaultDestinationInput =
    defaultDestinationId !== "europe" && defaultDestination ? defaultDestination : "";
  const [originInput, setOriginInput] = useState(defaultOriginInput);
  const [destinationInput, setDestinationInput] = useState(defaultDestinationInput);
  const { data: originData } = useQuery<FlightSearchTypes.FlightLocations>(
    FlightGetLocationsQuery,
    {
      variables: {
        input: {
          searchQuery: originInput,
          type: "From",
          funnel: FlightFunnelType.FLIGHT,
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
          funnel: FlightFunnelType.FLIGHT,
        },
      },
    }
  );
  const originLocations = originData?.flightGetLocations?.locations ?? [];
  const destinationLocations = destinationData?.flightGetLocations?.locations ?? [];
  const originPlaceholder = defaultOriginId === "europe" ? defaultOrigin : t("Flying from");
  const destinationPlaceholder =
    defaultDestinationId === "europe" ? defaultDestination : t("Flying to");
  return (
    <MobileStepDoubleLocation
      originId="flightOrigin"
      destinationId="flightDestination"
      onOriginLocationChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setOriginInput(e.target.value);
        if (e.target.value.length === 0) {
          onOriginLocationChange(undefined, undefined);
        }
      }}
      onDestinationLocationChange={
        !disableDestinationInput
          ? (e: React.ChangeEvent<HTMLInputElement>) => {
              setDestinationInput(e.target.value);
              if (e.target.value.length === 0) {
                onDestinationLocationChange(undefined, undefined);
              }
              e.target.scrollIntoView({ block: "center" });
            }
          : () => {}
      }
      defaultOrigin={defaultOrigin}
      defaultDestination={defaultDestination}
      origin={origin}
      destination={destination}
      disableDestinationInput={disableDestinationInput}
      originLabel={t("Departure")}
      destinationLabel={t("Destination")}
      originLocations={originLocations}
      destinationLocations={destinationLocations}
      originPlaceholder={originPlaceholder}
      destinationPlaceholder={destinationPlaceholder}
      defaultOriginAutocompleteIconType={AutoCompleteType.PLANE_TAKEOFF}
      defaultDestinationAutocompleteIconType={AutoCompleteType.PLANE_LAND}
      originInput={originInput}
      destinationInput={destinationInput}
      onOriginItemClick={item => item && onOriginLocationChange(item.id, item.name)}
      onDestinationItemClick={item => item && onDestinationLocationChange(item.id, item.name)}
      forceFocusOrigin={forceOriginFocus}
      forceFocusDestination={forceDestinationFocus}
    />
  );
};

export default FlightLocationMobileStep;
