import React, { useCallback, useState } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { useTheme } from "emotion-theming";

import WaypointWrapper from "../Lazy/WaypointWrapper";
import { LazyloadOffset } from "../Lazy/LazyComponent";
import ScrollSnapCarousel, { StyledScrollSnapRow } from "../ScrollSnapCarousel";
import { useGlobalContext } from "../../../contexts/GlobalContext";

import { getSectionTitleIcon } from "./utils/landingPageUtils";
import { FlagComp } from "./LandingPageCardOverlay";
import LandingPageCardContainer, {
  landingPageCardSkeletonStyles,
} from "./LandingPageCardContainer";
import { LandingSectionPaginationParams } from "./hooks/useSectionPagination";

import { column, mqMax, mqMin } from "styles/base";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { GraphCMSDisplayType, GraphCMSPageType } from "types/enums";
import Section from "components/ui/Section/Section";
import SectionHeading from "components/ui/Section/SectionHeading";
import SectionContent from "components/ui/Section/SectionContent";
import { useTranslation } from "i18n";
import { capitalize } from "utils/globalUtils";
import { gutters } from "styles/variables";

export type ColumnSizes = {
  small: number;
  large: number;
  desktop: number;
};

const SectionHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const iconStyles = (theme: Theme) => css`
  margin-right: ${gutters.small / 2}px;
  max-width: 20px;
  height: 20px;
  fill: ${theme.colors.primary};
  ${mqMax.large} {
    display: none;
  }
`;

const HeadingIconLoading = styled.div`
  margin-right: ${gutters.small / 2}px;
  width: 20px;
  height: 20px;
  ${mqMax.large} {
    display: none;
  }
`;

const FlagWrapper = styled.div`
  margin-right: ${gutters.small / 2}px;
  ${mqMax.large} {
    display: none;
  }
`;
export const ScrollSnapCarouselStyled = styled(ScrollSnapCarousel)<{
  displayType?: string;
}>`
  ${StyledScrollSnapRow} {
    ${mqMax.large} {
      grid-gap: ${gutters.small / 2}px ${gutters.small}px;
      padding-bottom: ${({ displayType }) =>
        displayType === GraphCMSDisplayType.PRODUCT_CARD ||
        displayType === GraphCMSDisplayType.TG_CARD
          ? `${gutters.large}px`
          : `${gutters.small / 2 - 2}px`};
    }
  }
`;
export const Column = styled.div<{
  isVisible: boolean;
  mobileCardWidth: number;
  columnSizes: ColumnSizes;
}>([
  ({ columnSizes }) => column(columnSizes),
  ({ isVisible, mobileCardWidth }) => css`
    min-width: ${mobileCardWidth}px;
    padding: 0;
    scroll-snap-align: start;

    ${mqMin.large} {
      display: ${isVisible ? "block" : "none"};
      margin-bottom: ${gutters.large}px;
      min-width: unset;
      scroll-snap-align: initial;
    }

    ${mqMax.large} {
      margin-top: -${gutters.small / 2}px;
    }
  `,
]);

const LandingPageCardSection = ({
  title,
  sectionContent,
  cardsOnPage,
  mobileRows,
  displayType,
  columnSizes,
  mobileCardWidth,
  ssrRender,
  placeNames,
  shortTitle,
  fixedHeight,
  isFirstSection,
  sectionPageType,
  paginationParams,
  dataTestid,
}: {
  title: string;
  sectionContent: LandingPageTypes.LandingPageSectionCard[];
  cardsOnPage: number;
  mobileRows: number;
  displayType: GraphCMSDisplayType;
  columnSizes: ColumnSizes;
  mobileCardWidth: number;
  ssrRender?: boolean;
  placeNames?: LandingPageTypes.PlaceNames;
  shortTitle?: string;
  fixedHeight?: number;
  isFirstSection: boolean;
  sectionPageType?: GraphCMSPageType;
  paginationParams: LandingSectionPaginationParams | null;
  dataTestid?: string;
}) => {
  const { isClientNavigation } = useGlobalContext();
  const theme: Theme = useTheme();
  const { t } = useTranslation();
  const [isPageScrolledDown, setIsPageScrolledDown] = useState(isFirstSection);
  const isMobile = useIsMobile();
  const onWaypointEnter = useCallback(() => setIsPageScrolledDown(true), []);
  const shouldSetHeight =
    (fixedHeight && sectionContent.length >= cardsOnPage) ||
    displayType === GraphCMSDisplayType.IMAGE_WITH_SVG_ICON;

  if (sectionContent.length === 0) return null;
  const Icon = sectionPageType ? getSectionTitleIcon(sectionPageType, isFirstSection) : undefined;
  const flag =
    sectionPageType === GraphCMSPageType.CountryPage
      ? sectionContent[0].destinationFlag
      : undefined;

  // using lazy load only when rendering from SSR and onVisible after client nav
  const shouldUseLazyImage = Boolean(
    typeof window === "undefined" || (isClientNavigation.current && !isPageScrolledDown)
  );

  return (
    <WaypointWrapper
      lazyloadOffset={!isMobile ? LazyloadOffset.Small : LazyloadOffset.Tiny}
      onEnter={!isPageScrolledDown ? onWaypointEnter : undefined}
    >
      <Section isFirstSection={isFirstSection} dataTestid={dataTestid}>
        <SectionHeaderWrapper>
          {!isPageScrolledDown && Boolean(Icon || flag) && <HeadingIconLoading />}
          {Icon && isPageScrolledDown && <Icon css={iconStyles(theme)} />}
          {!Icon && flag && isPageScrolledDown && (
            <FlagWrapper>
              <FlagComp {...flag} />
            </FlagWrapper>
          )}
          <SectionHeading
            dangerouslySetInnerHTML={{
              __html: capitalize(t(title, placeNames)),
            }}
          />
        </SectionHeaderWrapper>
        <SectionContent>
          <ScrollSnapCarouselStyled
            itemsPerPage={cardsOnPage}
            mobileRows={mobileRows}
            mobileCardWidth={mobileCardWidth}
            ssrRender={ssrRender}
            columnSizes={columnSizes}
            fixedHeight={shouldSetHeight ? fixedHeight : undefined}
            ItemWrapper={Column}
            paginationParams={paginationParams}
            SkeletonComponent={landingPageCardSkeletonStyles[displayType]}
            displayType={displayType}
          >
            {sectionContent.map((sectionCard, index) => (
              <LandingPageCardContainer
                key={`${sectionCard.linkUrl}-${index.toString()}`}
                cardContent={sectionCard}
                displayType={displayType}
                disablePrefetch
                shortTitle={shortTitle}
                shouldUseLazyImage={shouldUseLazyImage}
                index={index}
              />
            ))}
          </ScrollSnapCarouselStyled>
        </SectionContent>
      </Section>
    </WaypointWrapper>
  );
};

export default LandingPageCardSection;
