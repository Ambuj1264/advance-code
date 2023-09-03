import React from "react";
import styled from "@emotion/styled";

import {
  getPriceGroupName,
  getPriceGroupAdditionalInformation,
} from "./utils/gteTourBookingWidgetUtils";
import { GTETourAgeBand } from "./types/enums";

import IncrementPicker from "components/ui/Inputs/IncrementPicker";
import { gutters } from "styles/variables";
import { typographyCaption } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { useTranslation } from "i18n";

const ExpandedInputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TravelersIncrementPicker = styled(IncrementPicker)`
  :not(:first-of-type) {
    margin-top: ${gutters.large}px;
  }
`;

const AdditionalInformation = styled.div(typographyCaption);

const GTETourTravelersInputContent = ({
  priceGroups,
  numberOfTravelers,
  onNumberOfTravelersChange,
  isAtMaxCapacity,
}: {
  priceGroups: GTETourBookingWidgetTypes.PriceGroup[];
  numberOfTravelers: GTETourBookingWidgetTypes.AgeBand[];
  onNumberOfTravelersChange: (travelerType: GTETourAgeBand, value: number) => void;
  isAtMaxCapacity: boolean;
}) => {
  const { t } = useTranslation(Namespaces.tourNs);
  return (
    <ExpandedInputContainer>
      {priceGroups.map(
        ({
          id,
          maxNumberOfTravelerType,
          minNumberOfTravelerType,
          minAge,
          maxAge,
          travelerType,
        }) => {
          const agesText = t("Ages {minAge} - {maxAge}", {
            minAge,
            maxAge,
          });
          const numberOfTravelerType =
            numberOfTravelers.find(traveler => traveler.ageBand === travelerType)
              ?.numberOfTravelers ?? 0;
          return (
            <TravelersIncrementPicker
              key={id}
              id={id}
              canDecrement={numberOfTravelerType > minNumberOfTravelerType}
              canIncrement={numberOfTravelerType < maxNumberOfTravelerType && !isAtMaxCapacity}
              count={numberOfTravelerType}
              title={`${getPriceGroupName(travelerType, t)} (${agesText})`}
              additionalInformation={
                <AdditionalInformation>
                  {getPriceGroupAdditionalInformation(
                    minNumberOfTravelerType,
                    maxNumberOfTravelerType
                  )}
                </AdditionalInformation>
              }
              onChange={(value: number) => onNumberOfTravelersChange(travelerType, value)}
            />
          );
        }
      )}
    </ExpandedInputContainer>
  );
};

export default GTETourTravelersInputContent;
