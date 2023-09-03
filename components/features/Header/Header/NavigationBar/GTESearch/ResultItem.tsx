import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Link from "@travelshift/ui/components/Inputs/Link";
import rgba from "polished/lib/color/rgba";

import { ResultItems } from "./GTESearch";
import { getIconAndCategoryLabel, checkIfFlag } from "./GTESearchUtils";

import {
  lightBlueColor,
  gutters,
  fontSizeBody2,
  fontSizeCaption,
  fontWeightSemibold,
  borderRadiusSmall,
  greyColor,
} from "styles/variables";
import { mqMax } from "styles/base";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { PageType, Marketplace } from "types/enums";
import CustomNextDynamic from "lib/CustomNextDynamic";
import IconLoading from "components/ui/utils/IconLoading";
import ClientLink from "components/ui/ClientLink";
import { getClientSideUrl } from "utils/helperUtils";
import useActiveLocale from "hooks/useActiveLocale";

const SearchIcon = CustomNextDynamic(() => import("components/icons/search.svg"), {
  loading: IconLoading,
});

export const lightBlueColorWithOpacity = rgba(lightBlueColor, 0.05);

const ResultContainer = styled.div<{ isIndented?: boolean }>(({ isIndented }) => [
  css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px ${gutters.small}px;
    padding-left: ${isIndented ? `${gutters.small * 2}px` : `${gutters.small}px`};
    cursor: pointer;

    &:hover,
    &:focus {
      background: ${lightBlueColorWithOpacity};
    }
  `,
]);

export const IconContainer = styled.div<{ isFlag?: boolean }>(({ isFlag }) => [
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: ${gutters.small / 2}px;
    svg {
      width: ${isFlag ? "20px" : `${gutters.small}px`};
      height: ${isFlag ? "20px" : `${gutters.small}px`};
      fill: ${lightBlueColor};
    }
  `,
]);

const Result = styled.p`
  color: ${lightBlueColor};
  font-size: ${fontSizeBody2};
  line-height: 22px;
`;

export const CategoryContainer = styled.div<{
  containerBackgroundColor: string;
  labelBackgroundOpacity?: number;
}>(({ containerBackgroundColor, labelBackgroundOpacity = 0.05 }) => [
  css`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: ${gutters.small / 3}px;
    border-radius: ${borderRadiusSmall};
    width: 96px;
    min-width: 96px;
    height: 24px;
    background: ${containerBackgroundColor
      ? `${rgba(containerBackgroundColor, labelBackgroundOpacity)}`
      : lightBlueColorWithOpacity};
    font-size: ${fontSizeCaption};
    font-weight: ${fontWeightSemibold};
  `,
]);

const HideLabelOnMobile = styled.div`
  ${mqMax.large} {
    display: none;
  }
`;

export const CategoryLabel = styled.div<{ labelFontColor?: string }>(
  ({ labelFontColor = lightBlueColor }) => [
    css`
      color: ${labelFontColor};
    `,
  ]
);

const IconAndTextContainer = styled.div`
  display: flex;
`;

export const LinkToSearchPage = ({
  value,
  toggleSearch,
}: {
  value: string;
  toggleSearch?: () => void;
}) => {
  const activeLocale = useActiveLocale();
  const { t } = useTranslation(Namespaces.headerNs);
  return (
    <ClientLink
      prefetch
      clientRoute={{
        route: `/${PageType.GTE_SEARCH_RESULTS}`,
        as: `${getClientSideUrl(
          PageType.GTE_SEARCH_RESULTS,
          activeLocale,
          Marketplace.GUIDE_TO_EUROPE
        )}?nextPageId=1&search=${value}`,
      }}
    >
      <ResultContainer onClick={toggleSearch}>
        <IconAndTextContainer>
          <IconContainer>
            <SearchIcon />
          </IconContainer>
          <Result>{value}</Result>
        </IconAndTextContainer>
        <HideLabelOnMobile>
          <CategoryContainer containerBackgroundColor={greyColor}>
            <CategoryLabel labelFontColor={greyColor}>{t("Search")}</CategoryLabel>
          </CategoryContainer>
        </HideLabelOnMobile>
      </ResultContainer>
    </ClientLink>
  );
};

const ResultItem = ({
  result,
  index,
  subResult,
}: {
  result: ResultItems;
  index: number;
  subResult?: boolean;
}) => {
  const key = `search-results-${index}`;

  const { pageType, countryCode, destinationId, metadataUri, title } = result;

  const isFlag = checkIfFlag(pageType);

  const { color, icon: Icon, category } = getIconAndCategoryLabel(pageType, countryCode);

  const { t } = useTranslation(Namespaces.headerNs);

  return (
    <Link id={`search-result-link${destinationId}-${index}`} href={metadataUri} key={key}>
      <ResultContainer isIndented={subResult}>
        <IconAndTextContainer>
          <IconContainer isFlag={isFlag}>{Icon && <Icon />}</IconContainer>
          <Result>{title}</Result>
        </IconAndTextContainer>
        <HideLabelOnMobile>
          <CategoryContainer containerBackgroundColor={color}>
            <CategoryLabel labelFontColor={color}>{t(category)}</CategoryLabel>
          </CategoryContainer>
        </HideLabelOnMobile>
      </ResultContainer>
    </Link>
  );
};

export default ResultItem;
