import React from "react";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";
import { css } from "@emotion/core";
import Link from "@travelshift/ui/components/Inputs/Link";

import {
  getIconAndCategoryLabel,
  checkIfFlag,
} from "../Header/Header/NavigationBar/GTESearch/GTESearchUtils";

import { OverallSearchPageLabel } from "./DesktopOverallSearchTileCard";
import { PageResultItems } from "./SearchResultContainer";
import { handleImgixImage } from "./utils/SearchResultUtils";

import { clampLines } from "styles/base";
import {
  ItemsWrapper,
  ListCardButtonStyled,
  ListCardFooter,
  ListCardFooterRightColumn,
  ListCardHeadline,
  ListCardRightColumn,
  ListCardRowDescription,
  ListCardWrapper,
  ListRowContent,
} from "components/ui/Search/utils/sharedSearchUtils";
import {
  ListCardRowTitle,
  ListProductCardDescription,
  StyledCardHeader,
} from "components/ui/Search/ListProductCard";
import { Namespaces } from "shared/namespaces";
import { Trans, useTranslation } from "i18n";
import { gutters, fontSizeCaption } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import { TopWidgetsWrapper } from "components/ui/Search/CardHeader";
import { ReviewTotalCountText } from "components/ui/ReviewSummary/ReviewSummaryCount";
import { Star } from "components/ui/ReviewStars";

const StyledListCardRowTitle = styled(ListCardRowTitle)`
  display: flex;
`;

const StyledOverallSearchPageLabel = styled(OverallSearchPageLabel)`
  flex-shrink: 0;
`;

const StyledListCardHeadline = styled(ListCardHeadline)([
  clampLines(1),
  css`
    flex-grow: 1;
    flex-shrink: 1;
  `,
]);

const StyledListProductCardDescription = styled(ListProductCardDescription)([
  clampLines(2),
  typographyBody2,
  css`
    width: 88%;
  `,
]);
const OverallListCardWrapper = styled(ListCardWrapper)`
  height: 171px;
`;

export const PageLabelPlacement = styled.div`
  position: absolute;
  top: ${gutters.small * 0.75}px;
  right: ${gutters.small}px;
`;

const OverallSearchCardHeader = styled(StyledCardHeader)`
  width: 181px;

  ${TopWidgetsWrapper} {
    top: ${gutters.small / 2}px;
    left: ${gutters.small / 2}px;
  }

  ${ReviewTotalCountText} {
    font-size: ${fontSizeCaption};
  }

  ${Star} {
    width: ${gutters.large / 2}px;
    height: ${gutters.large / 2}px;
  }
`;

const OverallSearchListCardButton = styled(ListCardButtonStyled)`
  margin-left: 0;
`;

const OverallSearchListCard = ({
  product,
  imgixParams,
  fallBackImg,
}: {
  product: PageResultItems;
  imgixParams?: SharedTypes.ImgixParams;
  fallBackImg?: ImageWithSizes;
}) => {
  const theme: Theme = useTheme();
  const { title, description, metadataUri, pageType, countryCode, id, imageSrc, reviewScore } =
    product;
  const { color, icon: Icon, category } = getIconAndCategoryLabel(pageType, countryCode);
  const image = { id, url: handleImgixImage(imageSrc) || "" };
  const isFlag = checkIfFlag(pageType);
  const { t } = useTranslation(Namespaces.headerNs);

  const descriptionWithDots = description?.length >= 180 ? `${description}...` : description;
  return (
    <ItemsWrapper key={id}>
      <OverallListCardWrapper>
        <ListRowContent>
          <Link id={`overall-search-page-list-header-link${id}`} href={metadataUri}>
            <OverallSearchCardHeader
              image={image}
              height={114}
              defaultImageWidth={181}
              imgixParams={imgixParams}
              fallBackImg={fallBackImg}
              averageRating={reviewScore?.totalScore}
              reviewsCount={reviewScore?.totalCount}
            />
          </Link>
          <ListCardRightColumn>
            <StyledListCardRowTitle>
              <Link id={`overall-search-page-list-title-link${id}`} href={metadataUri}>
                <StyledListCardHeadline>{title}</StyledListCardHeadline>
              </Link>
              <StyledOverallSearchPageLabel
                Icon={Icon}
                isFlag={isFlag}
                category={t(category)}
                color={color}
              />
            </StyledListCardRowTitle>
            <ListCardRowDescription>
              {description && (
                <StyledListProductCardDescription>
                  {descriptionWithDots}
                </StyledListProductCardDescription>
              )}
            </ListCardRowDescription>
          </ListCardRightColumn>
        </ListRowContent>
        <ListCardFooter theme={theme} data-testid="cardFooter">
          <ListCardFooterRightColumn>
            <Link id={`overall-search-page-list-footer-link${id}`} href={metadataUri}>
              <OverallSearchListCardButton theme={theme} color="action">
                <Trans ns={Namespaces.commonNs}>See more</Trans>
              </OverallSearchListCardButton>
            </Link>
          </ListCardFooterRightColumn>
        </ListCardFooter>
      </OverallListCardWrapper>
    </ItemsWrapper>
  );
};

export default OverallSearchListCard;
