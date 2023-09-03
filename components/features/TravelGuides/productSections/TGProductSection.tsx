import React from "react";

import TGDProductCard from "../sectioncards/TGDProductCard";

import SectionContent from "components/ui/Section/SectionContent";
import {
  Column,
  ScrollSnapCarouselStyled,
} from "components/ui/LandingPages/LandingPageCardSection";
import { LANDING_PAGE_PRODUCT_CARD_MOBILE_WIDTH } from "components/ui/LandingPages/LandingPageProductCardSection";

const productColumnSizes = {
  small: 0.5,
  large: 0.5,
  desktop: 0.5,
};

const TGProductSection = ({
  sectionCards,
  ssrRender = true,
}: {
  sectionCards: LandingPageTypes.LandingPageSectionCard[];
  ssrRender?: boolean;
}) => {
  return (
    <SectionContent>
      <ScrollSnapCarouselStyled
        itemsPerPage={2}
        mobileRows={1}
        mobileCardWidth={LANDING_PAGE_PRODUCT_CARD_MOBILE_WIDTH}
        ssrRender={ssrRender}
        columnSizes={productColumnSizes}
        ItemWrapper={Column}
      >
        {sectionCards.map(sectionCard => (
          <TGDProductCard key={sectionCard.linkUrl} sectionCard={sectionCard} />
        ))}
      </ScrollSnapCarouselStyled>
    </SectionContent>
  );
};

export default TGProductSection;
