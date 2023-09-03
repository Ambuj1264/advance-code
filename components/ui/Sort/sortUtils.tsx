import React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import rgba from "polished/lib/color/rgba";

import { Trans } from "i18n";
import ArrowDownIcon from "components/icons/arrow-thick-down.svg";
import StarIcon from "components/icons/star.svg";
import FireIcon from "components/icons/fire.svg";
import DurationLongIcon from "components/icons/duration-long.svg";
import DurationShortIcon from "components/icons/duration-short.svg";
import NewestIcon from "components/icons/synchronize-arrow-clock.svg";
import { mqMin, singleLineTruncation } from "styles/base";
import { gutters, greyColor } from "styles/variables";
import { typographyBody2 } from "styles/typography";
import { Namespaces } from "shared/namespaces";
import { OrderBy, OrderDirection } from "types/enums";

export const sortParameters = [
  { orderBy: "popularity", orderDirection: "desc" },
  { orderBy: "rating", orderDirection: "desc" },
  { orderBy: "price", orderDirection: "asc" },
  { orderBy: "price", orderDirection: "desc" },
  { orderBy: "duration", orderDirection: "asc" },
  { orderBy: "duration", orderDirection: "desc" },
] as SearchPageTypes.SortParameter[];

export const bloggerSortParameters = [
  { orderBy: "popularity", orderDirection: "desc" },
  { orderBy: "date", orderDirection: "desc" },
];

export const getSortParametersByIndex = (
  index: number,
  customSortParameters?: SearchPageTypes.SortParameter[]
): SearchPageTypes.SortParameter =>
  customSortParameters ? customSortParameters[index] : sortParameters[index];

type compareFnType = (obj1: any, obj2: any) => number;

const greaterCompareFn: compareFnType = (val1, val2) => ((val1 ?? 0) > (val2 ?? 0) ? 1 : -1);

export const byPriceConstructor = (byProperty: string) => (obj1: any, obj2: any) =>
  greaterCompareFn(obj1[byProperty], obj2[byProperty]);

export const byPriceDescConstructor = (byProperty: string) => (obj1: any, obj2: any) =>
  greaterCompareFn(obj2[byProperty], obj1[byProperty]);

export const byPopularityConstructor = (byProperty: string) => (obj1: any, obj2: any) =>
  greaterCompareFn(obj1[byProperty], obj2[byProperty]);

export const byPopularityDescConstructor = (byProperty: string) => (obj1: any, obj2: any) =>
  greaterCompareFn(obj2[byProperty], obj1[byProperty]);

export const byRating: compareFnType = (a, b) =>
  -greaterCompareFn(a.averageRating, b.averageRating);

export const iconStyles = (theme: Theme) => css`
  flex: 14px 0 0;
  margin: 0 ${gutters.small / 2}px;
  width: 14px;
  height: 14px;
  fill: ${theme.colors.primary};

  ${mqMin.large} {
    flex-basis: 20px;
    margin: 0 ${gutters.small}px;
    width: 20px;
    height: 20px;
  }
`;

export const Label = styled.span([
  typographyBody2,
  css`
    margin-right: ${gutters.small / 2}px;
    max-width: 100%;
    color: ${greyColor};

    ${mqMin.large} {
      margin-right: ${gutters.small}px;
    }
  `,
]);

export const SectionContainer = styled.div<{ isSelected?: boolean }>(({ theme, isSelected }) => [
  !isSelected
    ? css`
        border-bottom: 1px solid ${rgba(greyColor, 0.2)};
        &:hover {
          background-color: ${rgba(theme.colors.primary, 0.1)};
        }
      `
    : css`
        width: calc(100% - 36px);
        ${Label} {
          width: 100%;
          text-align: center;
          ${singleLineTruncation}
        }
      `,
  css`
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    align-items: center;
    padding: ${gutters.small}px 0 ${gutters.small}px ${gutters.small}px;
    &:hover {
      cursor: pointer;
    }

    ${mqMin.large} {
      padding: ${gutters.small / 2}px 0;
    }
  `,
]);

export const getCommonSortOptions = (theme: Theme, removeRating?: boolean) => {
  return [
    ...(!removeRating
      ? [
          <>
            <StarIcon css={iconStyles(theme)} />
            <Label>
              <Trans ns={Namespaces.commonSearchNs}>Top rated</Trans>
            </Label>
          </>,
        ]
      : []),
    <>
      <ArrowDownIcon css={iconStyles(theme)} />
      <Label>
        <Trans ns={Namespaces.commonSearchNs}>Price (Lowest first)</Trans>
      </Label>
    </>,
    <>
      <ArrowDownIcon
        css={css`
          ${iconStyles(theme)};
          transform: rotate(180deg);
        `}
      />
      <Label>
        <Trans ns={Namespaces.commonSearchNs}>Price (Highest first)</Trans>
      </Label>
    </>,
  ];
};

export const getSortOptions = (theme: Theme, removeRating?: boolean) => [
  <>
    <FireIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.commonSearchNs}>Most popular</Trans>
    </Label>
  </>,
  ...getCommonSortOptions(theme, removeRating),
];

export const getTourSortOptions = (theme: Theme) => [
  ...getSortOptions(theme),
  <>
    <DurationShortIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.tourSearchNs}>Duration (Shortest first)</Trans>
    </Label>
  </>,
  <>
    <DurationLongIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.tourSearchNs}>Duration (Longest first)</Trans>
    </Label>
  </>,
];

export const getBlogSortOptions = (theme: Theme) => [
  <>
    <FireIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.commonSearchNs}>Most popular</Trans>
    </Label>
  </>,
  <>
    <NewestIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.bloggerSearchNs}>Newest</Trans>
    </Label>
  </>,
];

export const getCarSortOptions = (theme: Theme) => [
  <>
    <ArrowDownIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.commonSearchNs}>Price (Lowest first)</Trans>
    </Label>
  </>,
  <>
    <ArrowDownIcon
      css={css`
        ${iconStyles(theme)};
        transform: rotate(180deg);
      `}
    />
    <Label>
      <Trans ns={Namespaces.commonSearchNs}>Price (Highest first)</Trans>
    </Label>
  </>,
  <>
    <StarIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.commonSearchNs}>Top rated</Trans>
    </Label>
  </>,
];

export const getBestPlacesSortOptions = (theme: Theme) => [
  <>
    <FireIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.commonSearchNs}>Most popular</Trans>
    </Label>
  </>,
  <>
    <StarIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.commonSearchNs}>Top rated</Trans>
    </Label>
  </>,
];

export const getFlightsSortOptions = (theme: Theme) => [
  <>
    <StarIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.commonSearchNs}>Best</Trans>
    </Label>
  </>,
  <>
    <ArrowDownIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.commonSearchNs}>Price (Lowest first)</Trans>
    </Label>
  </>,
  <>
    <ArrowDownIcon
      css={css`
        ${iconStyles(theme)};
        transform: rotate(180deg);
      `}
    />
    <Label>
      <Trans ns={Namespaces.commonSearchNs}>Price (Highest first)</Trans>
    </Label>
  </>,
  <>
    <DurationShortIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.commonSearchNs}>Duration (Shortest first)</Trans>
    </Label>
  </>,
];

export const getVPSearchSortOptions = (theme: Theme) => [
  // TODO: enable back rankings
  // as discussed with Gumbo, order by rankings is disabled
  // as we don't have enough rankings
  <>
    <FireIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.vacationPackagesSearchN}>Most popular</Trans>
    </Label>
  </>,
  <>
    <ArrowDownIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.vacationPackagesSearchN}>Price (Lowest first)</Trans>
    </Label>
  </>,
  <>
    <ArrowDownIcon
      css={css`
        ${iconStyles(theme)};
        transform: rotate(180deg);
      `}
    />
    <Label>
      <Trans ns={Namespaces.vacationPackagesSearchN}>Price (Highest first)</Trans>
    </Label>
  </>,
  <>
    <DurationShortIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.vacationPackagesSearchN}>Duration (Shortest first)</Trans>
    </Label>
  </>,
  <>
    <DurationLongIcon css={iconStyles(theme)} />
    <Label>
      <Trans ns={Namespaces.vacationPackagesSearchN}>Duration (Longest first)</Trans>
    </Label>
  </>,
];

export const VPSearchSortParams = [
  { orderBy: OrderBy.POPULARITY, orderDirection: OrderDirection.DESC },
  { orderBy: OrderBy.PRICE, orderDirection: OrderDirection.ASC },
  { orderBy: OrderBy.PRICE, orderDirection: OrderDirection.DESC },
  { orderBy: OrderBy.DURATION, orderDirection: OrderDirection.ASC },
  { orderBy: OrderBy.DURATION, orderDirection: OrderDirection.DESC },
];
