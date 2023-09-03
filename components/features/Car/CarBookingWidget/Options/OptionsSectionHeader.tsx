import React from "react";
import styled from "@emotion/styled";

import SectionBanner from "components/ui/BookingWidget/BookingWidgetSectionHeading";
import { gutters } from "styles/variables";

const Wrapper = styled.div`
  margin-top: ${gutters.large}px;
  margin-right: -${gutters.large}px;
  margin-left: -${gutters.large}px;
`;

const OptionsSectionHeader = ({ title }: { title: string }) => (
  <Wrapper>
    <SectionBanner color="primary">{title}</SectionBanner>
  </Wrapper>
);

export default OptionsSectionHeader;
