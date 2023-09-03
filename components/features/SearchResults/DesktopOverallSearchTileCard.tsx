import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import Link from "@travelshift/ui/components/Inputs/Link";

import {
  CategoryLabel,
  IconContainer,
  CategoryContainer,
} from "../Header/Header/NavigationBar/GTESearch/ResultItem";
import { SubtitleWrapper } from "../TravelGuideLanding/TGLandingGridCard";

import { handleImgixImage } from "./utils/SearchResultUtils";

import { mqMin } from "styles/base";
import {
  ListCardRowDescription,
  TileProductCardWrapper,
} from "components/ui/Search/utils/sharedSearchUtils";
import CardHeader from "components/ui/Search/CardHeader";
import { StyledHeadline } from "components/ui/Search/TileProductCard";
import { ListProductCardDescription } from "components/ui/Search/ListProductCard";
import {
  CardFooter,
  CardFooterWrapper,
  ArrowCircleStyledGreen,
} from "components/ui/Search/TileProductCardFooter";
import { Trans } from "i18n";
import { Namespaces } from "shared/namespaces";
import { whiteColor, lightBlueColor, gutters, blueColor, fontSizeBody2 } from "styles/variables";
import { Wrapper } from "components/ui/ReviewSummary/ReviewSummary";

const TGListCardFooterRightColumn = styled.div`
  display: flex;
  flex-grow: 1;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
`;

const StyledCardHeader = styled(CardHeader)`
  ${Wrapper} {
    position: absolute;
    top: -${gutters.small / 4}px;
    left: -${gutters.small / 4}px;
  }
`;

export const LabelPlacement = styled.div`
  position: absolute;
  top: ${gutters.small / 2}px;
  right: ${gutters.small / 2}px;
`;

const OverallSearchCardHeadline = styled(StyledHeadline)`
  height: fit-content;
  &:hover {
    text-decoration: underline;
    text-decoration-color: ${blueColor};
  }
`;

const StyledListProductCardDescription = styled(ListProductCardDescription)`
  margin-bottom: ${gutters.small}px;
  width: 100%;
  padding-left: ${gutters.large / 2}px;
  font-size: ${fontSizeBody2};
`;

const StyledCategoryContainer = styled(CategoryContainer)`
  margin: 2px 0 10px 0;
  width: fit-content;
  padding: 0 ${gutters.small / 2}px;
  ${mqMin.large} {
    margin: 0;
  }
`;

const StyledIconContainer = styled(IconContainer)<{ iconColor?: string; isFlag: boolean }>(
  ({ iconColor = lightBlueColor, isFlag = false }) => [
    css`
      svg {
        width: ${isFlag ? "20px" : "14px"};
        height: ${isFlag ? "20px" : "14px"};
        fill: ${iconColor};
      }
    `,
  ]
);

export const OverallSearchPageLabel = ({
  Icon,
  color,
  isFlag = false,
  category = "Search",
  labelBackgroundOpacity = 0.05,
  iconAndFontColor,
}: {
  Icon?: React.ComponentType<{}>;
  color: string;
  isFlag: boolean;
  category: string;
  labelBackgroundOpacity?: number;
  iconAndFontColor?: string;
}) => {
  return (
    <StyledCategoryContainer
      containerBackgroundColor={color}
      labelBackgroundOpacity={labelBackgroundOpacity}
    >
      <StyledIconContainer iconColor={iconAndFontColor || color} isFlag={isFlag}>
        {Icon && <Icon />}
      </StyledIconContainer>
      <CategoryLabel labelFontColor={iconAndFontColor || color}>{category}</CategoryLabel>
    </StyledCategoryContainer>
  );
};

const DesktopOverallSearchTileCard = ({
  id,
  metadataUri,
  title,
  color,
  isFlag,
  Icon,
  category,
  description,
  imageSrc,
  reviewScore,
}: {
  id: string;
  metadataUri: string | null;
  title: string | null;
  color: string;
  isFlag: boolean;
  Icon?: React.ComponentType<{}>;
  category: string;
  description: string;
  imageSrc: string | null;
  reviewScore?: {
    totalScore: number;
    totalCount: number;
  };
}) => {
  const theme: Theme = useTheme();
  return (
    <TileProductCardWrapper>
      <Link id={`overall-search-page${id}`} href={metadataUri}>
        <StyledCardHeader
          averageRating={reviewScore?.totalScore}
          reviewsCount={reviewScore?.totalCount}
          image={{ id, url: handleImgixImage(imageSrc) || "" }}
          isLoading={false}
          leftTopContent={
            <LabelPlacement>
              <OverallSearchPageLabel
                Icon={Icon}
                isFlag={isFlag}
                category={category}
                color={color}
                labelBackgroundOpacity={0.9}
                iconAndFontColor={whiteColor}
              />
            </LabelPlacement>
          }
        />
      </Link>
      <Link id={`overall-search-page-title-link${id}`} href={metadataUri}>
        <OverallSearchCardHeadline>{title}</OverallSearchCardHeadline>
      </Link>
      <ListCardRowDescription>
        {description && (
          <StyledListProductCardDescription>{description}</StyledListProductCardDescription>
        )}
      </ListCardRowDescription>
      <Link id={`overall-search-page-footer-link${id}`} href={metadataUri}>
        <CardFooterWrapper>
          <CardFooter hasPriceSubtitle={false} data-testid="cardFooter">
            <TGListCardFooterRightColumn>
              <SubtitleWrapper>
                <Trans ns={Namespaces.commonNs}>See more</Trans>
              </SubtitleWrapper>
              <ArrowCircleStyledGreen theme={theme} />
            </TGListCardFooterRightColumn>
          </CardFooter>
        </CardFooterWrapper>
      </Link>
    </TileProductCardWrapper>
  );
};

export default DesktopOverallSearchTileCard;
