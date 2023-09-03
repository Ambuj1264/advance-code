import React from "react";
import { range } from "fp-ts/lib/Array";

import { StyledScrollSnapRow } from "../ScrollSnapCarousel";

import { SectionHeaderWrapper, LoadingHeader } from "./LandingPageSectionLoading";
import {
  LANDING_PAGE_PRODUCT_CARD_COLUMN_SIZES,
  LANDING_PAGE_PRODUCT_CARD_MOBILE_WIDTH,
} from "./LandingPageProductCardSection";
import { Column } from "./LandingPageCardSection";

import Section from "components/ui/Section/Section";
import SectionContent from "components/ui/Section/SectionContent";
import TileProductCardSkeleton from "components/ui/Search/TileProductCardSkeleton";
import { useIsMobile } from "hooks/useMediaQueryCustom";

const LandingPageProductSectionLoading = ({
  className,
  isFirstSection,
  customTotalCards = 8,
}: {
  className?: string;
  isFirstSection?: boolean;
  customTotalCards?: number;
}) => {
  const isMobile = useIsMobile();
  const totalCards = isMobile ? 4 : customTotalCards;

  return (
    <Section className={className} isFirstSection={isFirstSection}>
      <SectionHeaderWrapper>
        <LoadingHeader />
      </SectionHeaderWrapper>
      <SectionContent>
        <StyledScrollSnapRow mobileCardWidth={LANDING_PAGE_PRODUCT_CARD_MOBILE_WIDTH}>
          {range(1, totalCards).map((_, index) => (
            <Column
              key={`landingPageProductSkeleton-${index.toString()}`}
              mobileCardWidth={LANDING_PAGE_PRODUCT_CARD_MOBILE_WIDTH}
              columnSizes={LANDING_PAGE_PRODUCT_CARD_COLUMN_SIZES}
              isVisible
            >
              <TileProductCardSkeleton />
            </Column>
          ))}
        </StyledScrollSnapRow>
      </SectionContent>
    </Section>
  );
};

export default LandingPageProductSectionLoading;
