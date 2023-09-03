import React from "react";

import Section from "components/ui/Section/Section";
import SectionContent from "components/ui/Section/SectionContent";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { MobileContainer } from "components/ui/Grid/Container";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import VPLoadingCardsRow from "components/features/VacationPackageProductPage/VPLoadingCardsRow";

const StayRoomLoadingSection = ({ sectionTitle }: { sectionTitle: string }) => {
  return (
    <Section id="roomSelection">
      <MobileContainer>
        <LeftSectionHeading>
          <Trans ns={Namespaces.accommodationNs}>{sectionTitle}</Trans>
        </LeftSectionHeading>
        <SectionContent>
          <VPLoadingCardsRow />
        </SectionContent>
      </MobileContainer>
    </Section>
  );
};

export default StayRoomLoadingSection;
