import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { range } from "fp-ts/lib/Array";

import { column, skeletonPulse, skeletonPulseBlue } from "styles/base";
import { gutters, borderRadius } from "styles/variables";
import Section from "components/ui/Section/Section";
import SectionContent from "components/ui/Section/SectionContent";
import Row from "components/ui/Grid/Row";
import { useIsMobile } from "hooks/useMediaQueryCustom";

export const Column = styled.div<{ isLargeImage: boolean }>(({ isLargeImage }) => [
  column({ small: 1 / 2, large: isLargeImage ? 1 / 4 : 1 / 6 }),
  css`
    margin-top: ${gutters.small}px;
  `,
]);

export const StyledRow = styled(Row)`
  margin-top: -${gutters.small}px;
`;

export const ImageCardLoading = styled.div(
  skeletonPulseBlue,
  css`
    border-radius: ${borderRadius};
    width: 100%;
    height: 140px;
  `
);

export const SectionHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const LoadingHeader = styled.div(
  skeletonPulse,
  css`
    margin-bottom: 16px;
    width: 200px;
    height: 20px;
  `
);

const LandingPageSectionLoading = ({
  isFirstSection,
  customTotalCards,
  className,
  isLargeImage = false,
}: {
  isFirstSection?: boolean;
  customTotalCards?: number;
  className?: string;
  isLargeImage?: boolean;
}) => {
  const isMobile = useIsMobile();
  const totalCards = isMobile ? 4 : customTotalCards || 24;

  return (
    <Section className={className} isFirstSection={isFirstSection}>
      <SectionHeaderWrapper>
        <LoadingHeader />
      </SectionHeaderWrapper>
      <SectionContent>
        <StyledRow>
          {range(1, totalCards).map(i => (
            <Column key={`${i}ImageCardLoading`} isLargeImage={isLargeImage}>
              <ImageCardLoading />
            </Column>
          ))}
        </StyledRow>
      </SectionContent>
    </Section>
  );
};

export default LandingPageSectionLoading;
