import React, { ComponentProps, lazy } from "react";
import { QueryParamProvider } from "use-query-params";
import { useQuery } from "@apollo/react-hooks";
import { ApolloError } from "apollo-client";

import OnDemandComponent from "../Lazy/OnDemandComponent";

import { constructLandingPageContent, getAdminLinks } from "./utils/landingPageUtils";
import LandingPageLoadingSkeleton from "./LandingPageLoadingSkeleton";
import SSRLandingPageFAQContainer from "./LandingPageFAQContainer?onDemand";
import LandingPageNLGQuery from "./queries/LandingPageNLGQuery.graphql";

import FrontCover from "components/ui/Cover/FrontCover/FrontCover";
import { Marketplace, GraphCMSPageType } from "types/enums";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import LandingPageValuePropositionsWrapper from "components/ui/LandingPages/LandingPageValuePropositionsWrapper";
import ErrorComponent from "components/ui/Error/ErrorComponent";
import FrontSearchWidgetContainer from "components/ui/FrontSearchWidget/FrontSearchWidgetContainer";
import FrontMobileStepsContainer from "components/ui/FrontSearchWidget/FrontMobileStepsContainer";
import Container from "components/ui/Grid/Container";
import { WaypointWrapperForMobileFooter } from "components/ui/Lazy/WaypointWrapper";
import { FrontSearchStateContext } from "components/ui/FrontSearchWidget/FrontSearchStateContext";
import useActiveLocale from "hooks/useActiveLocale";
import { useSettings } from "contexts/SettingsContext";
import LandingPageSEOContainer from "components/ui/LandingPages/LandingPageSEOContainer";
import FrontMobileFooterContainer from "components/ui/FrontSearchWidget/FrontMobileFooterContainer";
import LandingPageBreadcrumbs from "components/ui/LandingPages/LandingPageBreadcrumbs";
import FrontSearchStateContextProviderContainer from "components/ui/FrontSearchWidget/FrontSearchStateContextProviderContainer";
import useSession from "hooks/useSession";

const lazyLandingPageFAQContainer = lazy(() => import("./LandingPageFAQContainer"));

const CommonLandingPageContentContainer = ({
  queryData,
  queryError,
  queryLoading,
  queryCondition,
  activeServices,
  context,
  hideTabs,
  showBreadcrumbs = true,
  showFaqs = true,
  isIndexed,
  LandingPageSectionContent,
  functionalItems,
  SectionSkeletons,
  shouldInitializeLocationInput = false,
  hideLastBreadcrumb = true,
  requiredQuery = false,
  gteFrontPageMobileImageUrl,
}: {
  queryData?: LandingPageTypes.LandingPageContentQuery;
  queryError?: ApolloError | undefined;
  queryLoading: boolean;
  queryCondition: LandingPageTypes.LandingPageQueryCondition;
  activeServices: SharedTypes.PageItemType[];
  context: FrontSearchStateContext;
  hideTabs?: boolean;
  showBreadcrumbs?: boolean;
  showFaqs?: boolean;
  isIndexed?: boolean;
  LandingPageSectionContent: React.ReactNode;
  functionalItems?: AdminGearTypes.AdminFunctionalItem[];
  SectionSkeletons: JSX.Element[];
  shouldInitializeLocationInput?: boolean;
  hideLastBreadcrumb?: boolean;
  requiredQuery?: boolean;
  gteFrontPageMobileImageUrl?: string;
}) => {
  const locale = useActiveLocale();
  const { countryCode, marketplace } = useSettings();

  const landingPageContent =
    queryData?.landingPages && constructLandingPageContent(queryData?.landingPages, countryCode);

  const {
    id,
    uniqueId,
    title,
    subtitle,
    image,
    videoId,
    videoStartingTime,
    videoEndTime,
    pageVariation,
    pageType,
    subType,
  } = landingPageContent || {};

  const { user } = useSession();
  const nlgPageType =
    pageType === GraphCMSPageType.GTIFlights || pageType === GraphCMSPageType.GTTPFlights
      ? GraphCMSPageType.Flights
      : pageType;
  const { data: nlgContentData } = useQuery<{
    nlgContents: {
      id: string;
    }[];
  }>(LandingPageNLGQuery, {
    variables: {
      pageType: nlgPageType,
      pageVariation,
      website: marketplace === Marketplace.GUIDE_TO_EUROPE ? "GTE" : "GTI",
    },
    skip: !user?.isAdmin && !user?.isTranslator,
  });
  const nlgContentId = nlgContentData?.nlgContents[0]?.id;
  if (queryLoading) {
    return <LandingPageLoadingSkeleton SectionSkeletons={SectionSkeletons} />;
  }
  if (!queryData || queryData?.landingPages?.length === 0 || queryError) {
    return (
      <ErrorComponent
        error={queryError}
        isRequired={requiredQuery}
        componentName="CommonLandingPageContentContainer"
      />
    );
  }

  return (
    <>
      <LandingPageSEOContainer
        queryCondition={queryCondition}
        ogImages={image ? [image] : undefined}
        isIndexed={isIndexed}
        funnelType={queryCondition.pageType}
        pagePlace={queryData?.landingPages[0].destination}
      />
      <Container>
        {showBreadcrumbs && (
          <LandingPageBreadcrumbs
            queryCondition={queryCondition}
            hideLastBreadcrumb={hideLastBreadcrumb}
          />
        )}
        <QueryParamProvider>
          <FrontSearchStateContextProviderContainer
            context={context}
            skipCarLsLocation={shouldInitializeLocationInput}
            key={queryCondition.metadataUri}
          >
            <FrontCover
              title={title!}
              description={subtitle}
              images={[image!]}
              frontVideoId={videoId}
              frontVideoStartingTime={videoStartingTime}
              frontVideoEndTime={videoEndTime}
              hasBreadcrumbs={showBreadcrumbs}
              gteFrontPageMobileImageUrl={gteFrontPageMobileImageUrl}
            >
              <FrontSearchWidgetContainer
                activeServices={activeServices}
                hideTabs={hideTabs}
                shouldInitializeInputs={shouldInitializeLocationInput}
              />
            </FrontCover>
            <FrontMobileStepsContainer activeServices={activeServices} />
            {activeServices.length && (
              <FrontMobileFooterContainer activeServices={activeServices} />
            )}
          </FrontSearchStateContextProviderContainer>
        </QueryParamProvider>
        <WaypointWrapperForMobileFooter lazyloadOffset="-100px" />
        <LandingPageValuePropositionsWrapper pageType={queryCondition.pageType} />
        {LandingPageSectionContent}
        {showFaqs && (
          <OnDemandComponent<ComponentProps<typeof SSRLandingPageFAQContainer>>
            LazyComponent={lazyLandingPageFAQContainer}
            SsrOnlyComponent={SSRLandingPageFAQContainer}
            lazyHydrateProps={{ whenVisible: true }}
            activeLocale={locale}
            queryCondition={queryCondition}
            shouldRemoveLinks={queryCondition.pageType === GraphCMSPageType.Stays}
          />
        )}
      </Container>
      <AdminGearLoader
        links={getAdminLinks(id, nlgContentId)}
        hideCommonLinks
        functionalItems={functionalItems}
        infoText={[`Unique id: ${uniqueId}`]}
        templateInput={{
          pageVariation,
          funnel: pageType,
          subtype: subType,
          placeId: landingPageContent?.destination?.id,
        }}
      />
    </>
  );
};

export default CommonLandingPageContentContainer;
