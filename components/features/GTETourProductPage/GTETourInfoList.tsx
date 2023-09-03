import React from "react";
import styled from "@emotion/styled";

import { MobileContainer } from "components/ui/Grid/Container";
import IconList from "components/ui/IconList/IconList";
import Section from "components/ui/Section/Section";
import { LeftSectionHeading } from "components/ui/Section/SectionHeading";
import Column from "components/ui/Grid/Column";
import Row from "components/ui/Grid/Row";
import { mqMin } from "styles/base";
import { gutters } from "styles/variables";

const StyledColumn = styled(Column)`
  margin-top: ${gutters.small * 2}px;
  ${mqMin.medium} {
    margin-top: 0;
  }
`;

const GTETourInfoList = ({
  additionalInfo,
  safetyInfo,
  t,
}: {
  additionalInfo: SharedTypes.Icon[];
  safetyInfo: SharedTypes.Icon[];
  t: TFunction;
}) => {
  return additionalInfo.length || safetyInfo.length ? (
    <Section id="tourSafetyAndAdditionalInfo">
      <MobileContainer>
        <Row>
          {additionalInfo.length > 0 && (
            <Column columns={{ small: 1, medium: 2 }}>
              <LeftSectionHeading>{t("Good to know")}</LeftSectionHeading>
              <IconList sectionId="tourAdditionalInfo" iconList={additionalInfo} iconLimit={4} />
            </Column>
          )}
          {safetyInfo.length > 0 && (
            <StyledColumn columns={{ small: 1, medium: 2 }}>
              <LeftSectionHeading>{t("Safety")}</LeftSectionHeading>
              <IconList sectionId="tourSafetyInfo" iconList={safetyInfo} iconLimit={4} />
            </StyledColumn>
          )}
        </Row>
      </MobileContainer>
    </Section>
  ) : null;
};

export default GTETourInfoList;
