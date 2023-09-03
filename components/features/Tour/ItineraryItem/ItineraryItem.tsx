import React from "react";
import styled from "@emotion/styled";

import ItineraryDivider from "./ItineraryDivider";
import ItineraryInformation from "./ItineraryInformation";
import ItineraryMoreInformation from "./ItineraryMoreInformation/ItineraryMoreInformation";

import { gutters } from "styles/variables";
import { mqMin } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

type Props = {
  itineraryItem: ItineraryItem;
  slug: string;
};

const ItineraryExpandButtonWrapper = styled.div`
  margin-top: ${gutters.small}px;
  ${mqMin.large} {
    margin-top: ${gutters.large}px;
  }
`;

const ItineraryItem = ({ itineraryItem, slug }: Props) => {
  const { t } = useTranslation(Namespaces.tourNs);
  const dayNumber = t("Day {numberOfDay}", {
    numberOfDay: itineraryItem.numberOfDay,
  });
  return (
    <>
      <ItineraryDivider title={dayNumber} />
      <ItineraryInformation
        dayNumber={dayNumber}
        heading={itineraryItem.name}
        information={itineraryItem.information}
        image={itineraryItem.image}
      />
      {itineraryItem.hasContentTemplates && (
        <ItineraryExpandButtonWrapper>
          <ItineraryMoreInformation itineraryItem={itineraryItem} slug={slug} />
        </ItineraryExpandButtonWrapper>
      )}
    </>
  );
};

export default ItineraryItem;
