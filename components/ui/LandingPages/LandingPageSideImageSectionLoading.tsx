import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import { SectionHeaderWrapper, LoadingHeader } from "./LandingPageSectionLoading";

import { column, skeletonPulse, skeletonPulseBlue } from "styles/base";
import { gutters, borderRadius } from "styles/variables";
import Section from "components/ui/Section/Section";
import SectionContent from "components/ui/Section/SectionContent";
import Row from "components/ui/Grid/Row";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const Column = styled.div([
  column({ small: 1, medium: 1 / 2, large: 1 / 4 }),
  css`
    margin-top: ${gutters.small}px;
  `,
]);

export const StyledRow = styled(Row)`
  flex-wrap: nowrap;
  margin-top: -${gutters.large}px;
  overflow: scroll;
`;

const ImageCardLoading = styled.div(
  skeletonPulseBlue,
  css`
    flex-shrink: 0;
    border-radius: ${borderRadius};
    width: 87px;
    height: 65px;
  `
);

const LoadingTitle = styled.div(
  skeletonPulse,
  css`
    flex-shrink: 0;
    margin-left: ${gutters.large}px;
    width: 150px;
    height: 20px;
  `
);

const LoadingSideImageSectionWrapper = styled.div(
  () => css`
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    width: 300px;
    padding: ${gutters.small / 2}px ${gutters.small / 2}px ${gutters.small / 2}px 0;
  `
);

const LandingPageSideImageSectionLoading = ({
  isFirstSection,
  className,
}: {
  isFirstSection?: boolean;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const totalCards = isMobile ? 6 : 12;
  const itemsPerColumn = 3;

  return (
    <Section className={className} isFirstSection={isFirstSection}>
      <SectionHeaderWrapper>
        <LoadingHeader />
      </SectionHeaderWrapper>
      <SectionContent>
        <StyledRow>
          {range(1, totalCards / itemsPerColumn).map(columnIndex => (
            <Column key={`${columnIndex}ImageCardLoadingColumn`}>
              {range(1, itemsPerColumn).map(i => (
                <LoadingSideImageSectionWrapper key={`${i}ImageCardLoadingColumnItem`}>
                  <ImageCardLoading />
                  <LoadingTitle />
                </LoadingSideImageSectionWrapper>
              ))}
            </Column>
          ))}
        </StyledRow>
      </SectionContent>
    </Section>
  );
};

export default LandingPageSideImageSectionLoading;
