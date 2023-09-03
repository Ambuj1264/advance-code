import React from "react";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import AdminGearLoader from "../AdminGear/AdminGearLoader";

import TravelCommunityQuery from "./queries/TravelCommunityQuery.graphql";
import TravelCommunityClientQuery from "./queries/TravelCommunityClientQuery.graphql";
import TravelCommunitySEO from "./TravelCommunitySEO";
import PopularTips from "./PopularTips";
import LatestTips from "./LatestTips";
import TopBloggers from "./TopBloggers/TopBloggers";
import { getPropsWithDefaults } from "./utils/travelCommunityUtils";

import SearchHeader from "components/ui/Inputs/SearchHeader";
import ArticleAndBlogSearchPageCover from "components/ui/Cover/ArticleAndBlogSearchPageCover";
import Container from "components/ui/Grid/Container";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import TopAttractionsContainer from "components/ui/TopAttractionsContainer/TopAttractionsContainer";
import TopTravelPlansContainer from "components/features/CountryPage/TopTravelPlansContainer/TopTravelPlansContainer";
import { constructTours } from "utils/typeConversionUtils";
import useEffectOnScrollMobile from "hooks/useEffectOnScrollMobile";
import { LandingPageType, PageType } from "types/enums";
import { getTravelCommunityAdminLinks } from "components/features/AdminGear/utils";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import FrontValuePropositions from "components/ui/FrontValuePropositions/FrontValuePropositions";
import { cleanAsPath } from "utils/routerUtils";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";

const TravelCommunityContainer = ({ isLocals = false }: { isLocals?: boolean }) => {
  const { asPath } = useRouter();
  const activeLocale = useActiveLocale();
  const { adminUrl } = useSettings();
  const pageType = isLocals ? PageType.LOCALCOMMUNITY : PageType.TRAVELCOMMUNITY;

  const {
    data: travelCommunityData,
    error: travelCommunityError,
    loading: travelCommunityLoading,
  } = useQuery<TravelCommunityTypes.PageQuery>(TravelCommunityQuery, {
    variables: { pageType },
  });

  const [fetchClientData, { data: clientData }] =
    useLazyQuery<TravelCommunityTypes.PageClientQuery>(TravelCommunityClientQuery, {
      context: {
        fetchOptions: {
          method: "POST",
        },
      },
    });

  useEffectOnScrollMobile(fetchClientData);

  if (travelCommunityError) {
    return <ErrorComponent error={travelCommunityError} componentName="TravelCommunityContainer" />;
  }

  const { travelCoverProps, topAttractionsProps, bestTravelPlansProps } =
    getPropsWithDefaults(travelCommunityData);

  const bestTravelPlanTours = constructTours(
    bestTravelPlansProps.tours,
    clientData?.bestTravelPlans?.tours
  );

  const bloggerType = isLocals ? PageType.LOCALCOMMUNITY : PageType.TRAVELCOMMUNITY;

  return (
    <>
      <TravelCommunitySEO tours={bestTravelPlanTours} />
      <Container
        data-testid={isLocals ? "local-community-container" : "travel-community-container"}
      >
        <BreadcrumbsContainer
          type={bloggerType}
          landingPageType={
            isLocals ? LandingPageType.LOCALBLOGGERS : LandingPageType.TRAVELBLOGGERS
          }
        />
        <ArticleAndBlogSearchPageCover {...travelCoverProps}>
          <SearchHeader
            searchTerm="text"
            searchLink={`/${cleanAsPath(asPath)}/search`}
            hiddenQueryParams={[
              {
                name: "bloggerType",
                value: bloggerType,
              },
            ]}
          />
        </ArticleAndBlogSearchPageCover>
        <FrontValuePropositions />
        <TopBloggers isLocals={isLocals} />
        <LazyHydrateWrapper whenVisible key="popularTip">
          <PopularTips isLocals={isLocals} />
        </LazyHydrateWrapper>
        <LazyHydrateWrapper whenVisible key="latestTip">
          <LatestTips isLocals={isLocals} />
        </LazyHydrateWrapper>
        <LazyHydrateWrapper whenVisible key="topAttraction">
          <TopAttractionsContainer {...topAttractionsProps} loading={travelCommunityLoading} />
        </LazyHydrateWrapper>
        <LazyHydrateWrapper whenVisible key="topTravel">
          <TopTravelPlansContainer
            bestTravelPlanTours={bestTravelPlanTours}
            metadata={bestTravelPlansProps.metadata}
            loading={travelCommunityLoading}
          />
        </LazyHydrateWrapper>
      </Container>
      <AdminGearLoader links={getTravelCommunityAdminLinks(activeLocale, adminUrl)} />
    </>
  );
};

export default TravelCommunityContainer;
