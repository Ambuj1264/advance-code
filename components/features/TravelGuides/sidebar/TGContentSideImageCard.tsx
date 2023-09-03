import React, { ElementType } from "react";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { GraphCMSDisplayType } from "types/enums";
import { typographySubtitle2, typographySubtitle2Regular } from "styles/typography";
import { clampLinesWithFixedHeight, mqMax } from "styles/base";
import TGContentWidgetSectionHeader from "components/features/TravelGuides/sidebar/TGContentWidgetSectionHeader";
import LandingPageCardContainer from "components/ui/LandingPages/LandingPageCardContainer";
import {
  CardImageWrapper,
  Title,
  Description,
} from "components/ui/Teaser/variants/TeaserSideImageCard";
import { StyledTeaserSideImageCard } from "components/ui/LandingPages/LandingPageCard";
import { Country } from "components/ui/LandingPages/LandingPageCardOverlayShared";
import { greyColor, guttersPx } from "styles/variables";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";

const LandingPageCardContainerStyled = styled(LandingPageCardContainer)`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${rgba(greyColor, 0.3)};
  height: 112px;
  ${CardImageWrapper} {
    width: 94px;
    height: 80px;
  }
  ${StyledTeaserSideImageCard} {
    ${mqMax.large} {
      margin: 0;
    }
  }
  img {
    width: inherit;
    height: inherit;
  }
  ${Description} {
    ${typographySubtitle2Regular};
    ${clampLinesWithFixedHeight({ numberOfLines: 3, lineHeight: 22 })}
    line-height: 22px;
  }
  h3 {
    ${typographySubtitle2};
    ${mqMax.large} {
      margin: 0;
    }
    &:before {
      width: 94px;
      height: 80px;
    }
  }
  ${Title} {
    ${typographySubtitle2};
    height: auto;
  }
  ${Country} {
    width: ${guttersPx.small};
    height: ${guttersPx.small};
    img {
      width: ${guttersPx.small};
      height: ${guttersPx.small};
    }
  }
`;

const TGContentSideImageCard = ({
  title,
  Icon,
  displayType,
  cardContent,
}: {
  title: string;
  Icon: ElementType;
  displayType: GraphCMSDisplayType;
  cardContent: LandingPageTypes.LandingPageSectionCard[];
}) => {
  const { t: travelGuidesT } = useTranslation(Namespaces.travelGuidesNs);
  return (
    <>
      <TGContentWidgetSectionHeader title={travelGuidesT(title)} Icon={Icon} />
      {cardContent.map((card, i) => (
        <LandingPageCardContainerStyled
          // eslint-disable-next-line react/no-array-index-key
          key={`side-card-container${i}`}
          displayType={displayType}
          isVisible
          cardContent={card}
          index={i}
        />
      ))}
    </>
  );
};

export default TGContentSideImageCard;
