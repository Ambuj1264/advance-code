import React from "react";
import styled from "@emotion/styled";

import Dynamic from "./ItineraryMoreInformationDynamic";

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
  const title = t("Day {numberOfDay}", {
    numberOfDay: itineraryItem.numberOfDay,
  });
  return (
    <ItineraryExpandButtonWrapper>
      <Dynamic title={title} itineraryItem={itineraryItem} slug={slug} />
    </ItineraryExpandButtonWrapper>
  );
};

export default ItineraryItem;
