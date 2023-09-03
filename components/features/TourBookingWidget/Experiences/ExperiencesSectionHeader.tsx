import React from "react";
import styled from "@emotion/styled";

import SectionBanner from "components/ui/BookingWidget/BookingWidgetSectionHeading";
import { gutters } from "styles/variables";
import { Namespaces } from "shared/namespaces";
import { Trans } from "i18n";

const Wrapper = styled.div`
  margin-top: ${gutters.large}px;
  margin-right: -${gutters.large}px;
  margin-left: -${gutters.large}px;
`;

const ExperiencesSectionHeader = () => (
  <Wrapper>
    <SectionBanner color="primary">
      <Trans ns={Namespaces.tourBookingWidgetNs}>Personalize your experience</Trans>
    </SectionBanner>
  </Wrapper>
);

export default ExperiencesSectionHeader;
