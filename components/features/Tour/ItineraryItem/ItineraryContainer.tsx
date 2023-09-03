import React from "react";

import ItineraryItem from "./ItineraryItem";

import { MobileContainer } from "components/ui/Grid/Container";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import SectionContent from "components/ui/Section/SectionContent";
import Section from "components/ui/Section/Section";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";

type Props = {
  sectionId: string;
  slug: string;
  firstItineraryItem: ItineraryItem;
  restOfItineraryItems: ReadonlyArray<ItineraryItem>;
};

const ItineraryContainer = ({
  sectionId,
  slug,
  firstItineraryItem,
  restOfItineraryItems,
}: Props) => {
  return (
    <div id={sectionId}>
      <Section key={firstItineraryItem.id}>
        <MobileContainer>
          <LeftSectionHeading>
            <Trans ns={Namespaces.tourNs}>Daily itinerary</Trans>
          </LeftSectionHeading>
          <SectionContent>
            <ItineraryItem itineraryItem={firstItineraryItem} slug={slug} />
          </SectionContent>
        </MobileContainer>
      </Section>
      {restOfItineraryItems.map((itineraryItem: ItineraryItem) => (
        <Section key={itineraryItem.id}>
          <MobileContainer>
            <ItineraryItem itineraryItem={itineraryItem} slug={slug} />
          </MobileContainer>
        </Section>
      ))}{" "}
    </div>
  );
};

export default ItineraryContainer;
