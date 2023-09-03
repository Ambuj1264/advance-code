import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { Card, CardTitle } from "../TeaserComponents";

import ClientLinkPrefetch from "components/ui/ClientLinkPrefetch";
import { getProductSlugFromHref } from "utils/routerUtils";
import ArrowRightIcon from "components/icons/arrow-right.svg";
import TravellerIcon from "components/icons/traveler.svg";
import CarIcon from "components/icons/car.svg";
import BedroomHotelIcon from "components/icons/bedroom-hotel.svg";
import BulbIcon from "components/icons/bulb-alternate.svg";
import { mqMin } from "styles/base";
import {
  gutters,
  whiteColor,
  textColorLight,
  separatorColor,
  fontWeightSemibold,
  fontWeightBold,
  borderRadiusSmall,
  borderRadius,
  borderRadiusLarger,
  fontSizeCaption,
} from "styles/variables";
import { typographySubtitle2 } from "styles/typography";
import { CategoryBannerType, PageType } from "types/enums";
import {
  getPageColor,
  getRegularLinkClientRoute,
} from "components/ui/ArticleLayout/utils/articleLayoutUtils";

const StyledCard = styled(Card)`
  padding: 0;

  ${mqMin.medium} {
    align-items: center;
    border: 1px solid ${separatorColor};
    border-radius: ${borderRadius};
    padding: ${gutters.small}px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  border: 1px solid ${separatorColor};
  border-right: 0;
  border-left: 0;
  padding: ${gutters.small / 2}px ${gutters.small}px;

  ${mqMin.medium} {
    flex-direction: column;
    align-items: flex-start;
    border: 0;
    border-radius: 0;
    padding: 0 ${gutters.small}px;
  }
`;

const CardSubTitle = styled.div`
  display: none;
  color: ${textColorLight};
  font-size: ${fontSizeCaption};
  font-weight: ${fontWeightSemibold};
  line-height: 16px;

  ${mqMin.medium} {
    display: block;
  }
`;

const StyledCardTitle = styled(CardTitle)<{ pageColor: string }>(
  ({ pageColor }) => css`
    color: ${pageColor};
  `
);

const CardIcon = styled.div<{ pageColor: string }>([
  ({ pageColor }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${borderRadiusLarger};
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    width: 20%;
    background-color: ${pageColor};
    color: ${whiteColor};

    ${mqMin.medium} {
      border-radius: ${borderRadiusLarger};
      width: 40px;
      height: 40px;
    }

    svg {
      width: 24px;
      height: 30px;
      fill: currentColor;

      ${mqMin.medium} {
        height: 60%;
      }
    }
  `,
]);

const Action = styled.div([
  typographySubtitle2,
  ({ theme }) => css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${theme.colors.action};
    border-radius: ${borderRadiusLarger};
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: 20%;
    max-width: 180px;
    padding: ${gutters.large / 2}px;
    background-color: ${theme.colors.action};
    color: ${whiteColor};
    font-weight: ${fontWeightBold};
    text-align: center;

    ${mqMin.medium} {
      margin-left: auto;
      border-radius: ${borderRadiusSmall};
      width: 30%;
      padding-right: ${gutters.small * 2}px;
      background-color: ${whiteColor};
      color: ${theme.colors.action};
    }
  `,
]);

const StyledArrowRightIcon = styled(ArrowRightIcon)`
  position: absolute;
  right: ${gutters.small}px;
  display: none;
  width: 13px;
  fill: currentColor;

  ${mqMin.medium} {
    display: block;
  }
`;

const getCategoryIcon = (categoryId?: string): React.ReactType => {
  switch (categoryId) {
    case CategoryBannerType.TOUR:
    case CategoryBannerType.TOUR_SEARCH:
      return TravellerIcon;
    case CategoryBannerType.CAR:
    case CategoryBannerType.CAR_SEARCH:
      return CarIcon;
    case CategoryBannerType.HOTEL:
    case CategoryBannerType.HOTEL_SEARCH:
      return BedroomHotelIcon;
    default:
      return BulbIcon;
  }
};

const ROUTE_MAP: { [categoryId: string]: string } = {
  [CategoryBannerType.TOUR]: PageType.TOURCATEGORY,
  [CategoryBannerType.TOUR_SEARCH]: PageType.TOURSEARCH,
};

const getClientRoute = (categoryId: string | undefined, href: string): SharedTypes.ClientRoute => {
  const regularLinkRoute = getRegularLinkClientRoute(href);

  if (!categoryId) {
    return regularLinkRoute;
  }

  const route = ROUTE_MAP[categoryId];
  if (!route) {
    return regularLinkRoute;
  }

  const clientRoute = {
    ...regularLinkRoute,
    query: {
      slug: getProductSlugFromHref(href),
    },
    route: `/${route}`,
  };

  return clientRoute;
};

const TeaserCategoryBanner = ({
  url,
  title,
  action,
  description,
  ormName: categoryId,
  pageType,
}: TeaserTypes.Teaser) => {
  const theme: Theme = useTheme();
  const pageColor = getPageColor(pageType, theme);
  const Icon = getCategoryIcon(categoryId);
  const clientRoute = getClientRoute(categoryId, url);
  return (
    <ClientLinkPrefetch
      linkUrl={clientRoute.as}
      useRegularLink={clientRoute.route === `/${PageType.PAGE}`}
      clientRoute={clientRoute}
      title={title}
    >
      <StyledCard>
        <CardIcon pageColor={pageColor}>
          <Icon />
        </CardIcon>
        <ContentWrapper>
          <CardSubTitle>{description}</CardSubTitle>
          <StyledCardTitle pageColor={pageColor}>{title}</StyledCardTitle>
        </ContentWrapper>
        <Action>
          {action}
          <StyledArrowRightIcon />
        </Action>
      </StyledCard>
    </ClientLinkPrefetch>
  );
};

export default TeaserCategoryBanner;
