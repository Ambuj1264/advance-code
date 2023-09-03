import React, { useState, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";
import { useQuery } from "@apollo/react-hooks";

import { constructTopBloggers, NUMBER_OF_TOP_BLOGGERS } from "../utils/travelCommunityUtils";
import TopBloggersQuery from "../queries/TopBloggersQuery.graphql";

import TopBloggerCard, { TopBloggerCardSSRSkeleton } from "./TopBloggerCard";
import TopBloggersLoading from "./TopBloggersLoading";

import { useGlobalContext } from "contexts/GlobalContext";
import CustomNextDynamic from "lib/CustomNextDynamic";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import LazyComponent, { LazyloadOffset } from "components/ui/Lazy/LazyComponent";
import Button from "components/ui/Inputs/Button";
import { ButtonSize } from "types/enums";
import Row from "components/ui/Grid/Row";
import Section from "components/ui/Section/Section";
import SectionHeading from "components/ui/Section/SectionHeading";
import SectionSubHeading from "components/ui/Section/SectionSubHeading";
import SectionContent from "components/ui/Section/SectionContent";
import { gutters } from "styles/variables";
import { mqMin, column } from "styles/base";
import { Trans } from "i18n";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const TopBloggersLanguageDropdown = CustomNextDynamic(
  () => import("./TopBloggersLanguageDropdown"),
  { ssr: false }
);

const Column = styled.div([
  column({ small: 1 / 2, medium: 1 / 3, large: 1 / 4, desktop: 1 / 6 }),
  css`
    margin-top: ${gutters.small}px;
  `,
]);

const StyledSection = styled(Section)`
  position: relative;
`;

const formStyles = css`
  display: flex;
  justify-content: center;
  margin-top: ${gutters.small}px;

  ${mqMin.medium} {
    margin-top: ${gutters.large}px;
  }
  button {
    width: 168px;
  }
`;

const ButtonWrapper = styled.div(formStyles);

export const showMoreBloggersQueryParam = "showMoreBloggers";

type State = {
  bloggers: TravelCommunityTypes.Blogger[];
  currentPage: number;
  selectedLocale: string;
};

const TopBloggers = ({ isLocals }: { isLocals: boolean }) => {
  const theme: Theme = useTheme();
  const isMobile = useIsMobile();
  const initialState = {
    bloggers: [],
    currentPage: 1,
    selectedLocale: "",
  };
  const [state, setState] = useState<State>(initialState);

  const [cacheHitPaginationLoading, setCacheHitPaginationLoading] = useState(false);

  const {
    error,
    data,
    loading,
    refetch: fetchMoreBloggers,
  } = useQuery<TravelCommunityTypes.QueryTopBloggers>(TopBloggersQuery, {
    variables: {
      type: isLocals ? "local" : "travel",
      page: state.currentPage,
      languageId: state.selectedLocale,
      limit: NUMBER_OF_TOP_BLOGGERS,
    },
    onCompleted: ({ topBloggers }) => {
      setCacheHitPaginationLoading(false);
      setState({
        ...state,
        bloggers: state.bloggers.concat(constructTopBloggers(topBloggers.bloggers, isLocals)),
      });
    },
  });

  const getMoreBloggers = useCallback(() => {
    setCacheHitPaginationLoading(true);
    fetchMoreBloggers();
    setTimeout(() => {
      setState({
        ...state,
        currentPage: state.currentPage + 1,
      });
    }, 750);
  }, [fetchMoreBloggers, state]);

  const changeLocaleFilter = useCallback(
    (selectedLocale: string) => {
      setCacheHitPaginationLoading(true);
      setState({
        ...state,
        bloggers: [],
      });
      fetchMoreBloggers();
      setTimeout(() => {
        setState({
          ...state,
          currentPage: 1,
          bloggers: [],
          selectedLocale,
        });
      }, 750);
    },
    [fetchMoreBloggers, state]
  );

  const isLoading = cacheHitPaginationLoading || loading;
  const { isClientNavigation } = useGlobalContext();
  const shouldShowSkeletonItems = !isClientNavigation.current;

  if (error || !data) return null;

  const topBloggers =
    state.bloggers.length > 0 || (cacheHitPaginationLoading && state.bloggers.length === 0)
      ? state.bloggers
      : constructTopBloggers(data.topBloggers.bloggers, isLocals);
  const showSeeMoreButton = state.currentPage < data.topBloggers.metadata.pages;

  const fullyRenderedItems = 2;
  const fullBloggerItems = !shouldShowSkeletonItems
    ? topBloggers
    : topBloggers.slice(0, fullyRenderedItems);
  const skeletonBloggerItems = !shouldShowSkeletonItems
    ? []
    : topBloggers.slice(fullyRenderedItems, topBloggers.length);

  return (
    <StyledSection isFirstSection>
      <SectionHeading>{data.topBloggers.metadata.title}</SectionHeading>
      <SectionSubHeading>{data.topBloggers.metadata.subtitle}</SectionSubHeading>
      <SectionContent>
        {isLocals && (
          <TopBloggersLanguageDropdown
            onChange={changeLocaleFilter}
            selectedValue={state.selectedLocale}
            isDisabled={isLoading}
          />
        )}
        <Row>
          {fullBloggerItems.map((blogger: TravelCommunityTypes.Blogger) => (
            <Column key={blogger.id.toString()}>
              <TopBloggerCard cardInfo={blogger} />
            </Column>
          ))}
          {skeletonBloggerItems.length > 0 && (
            <LazyComponent
              lazyloadOffset={isMobile ? LazyloadOffset.None : LazyloadOffset.Medium}
              loadingElement={
                <LazyHydrateWrapper ssrOnly>
                  {skeletonBloggerItems.map(blogger => (
                    <Column key={blogger.id.toString()} data-testid="bloggerCard">
                      <TopBloggerCardSSRSkeleton cardInfo={blogger} />
                    </Column>
                  ))}
                </LazyHydrateWrapper>
              }
            >
              {skeletonBloggerItems.map(blogger => (
                <Column key={blogger.id.toString()} data-testid="bloggerCard">
                  <TopBloggerCard cardInfo={blogger} />
                </Column>
              ))}
            </LazyComponent>
          )}
        </Row>
        {loading && <TopBloggersLoading />}
        {showSeeMoreButton && (
          <ButtonWrapper>
            <Button
              type="button"
              onClick={getMoreBloggers}
              id="seeMoreBloggers"
              buttonSize={ButtonSize.Small}
              theme={theme}
              disabled={isLoading}
            >
              <Trans>See more</Trans>
            </Button>
          </ButtonWrapper>
        )}
      </SectionContent>
    </StyledSection>
  );
};

export default TopBloggers;
