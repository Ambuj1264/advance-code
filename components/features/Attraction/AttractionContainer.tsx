import React, { useMemo } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import AttractionLeftColumnContent from "./AttractionLeftColumnContent";
import AttractionQuery from "./queries/AttractionQuery.graphql";
import { constructAttraction } from "./utils/attractionUtils";

import AttractionStructuredData from "components/features/SEO/AttractionStructuredData?ssrOnly";
import BookingWidgetFooterMobile from "components/ui/ArticleLayout/BookingWidgetFooterMobile";
import BreadcrumbsContainer from "components/ui/Breadcrumbs/BreadcrumbsContainer";
import CoverMap from "components/ui/Cover/CoverMap/CoverMapContainer";
import ArticleLayoutHeading from "components/ui/ArticleLayout/ArticleLayoutHeading";
import {
  Cover,
  Row,
  WidgetsRow,
  WrapOldHtml,
  WidgetsFullWidth,
  FAQ,
  TemperatureWidget,
  Propositions,
} from "components/ui/ArticleLayout";
import {
  ContentPageWrapper,
  ContentLayoutHeadingWrapper,
  WidgetsRowWrapper,
  CoverMapWrapper,
} from "components/ui/ArticleLayout/ArticleLayout";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import { Trans, useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import { getAttractionAdminLinks } from "components/features/AdminGear/utils";
import { useSettings } from "contexts/SettingsContext";
import { PageType, OpenGraphType, Marketplace } from "types/enums";
import useActiveLocale from "hooks/useActiveLocale";
import SEOContainer from "components/features/SEO/SEOContainer";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import { constructAlternateCanonical } from "components/features/SEO/utils/SEOUtils";

const AttractionContainer = ({ slug }: { slug: string }) => {
  const { adminUrl, marketplace } = useSettings();
  const activeLocale = useActiveLocale();
  const { marketplaceUrl } = useSettings();
  const { asPath } = useRouter();
  const { t: commonCarNsT } = useTranslation(Namespaces.commonCarNs);
  const { t: commonNsT } = useTranslation(Namespaces.commonNs);
  const { t: quickFactsNsT } = useTranslation(Namespaces.quickFactsNs);

  const { error, data, loading } = useQuery<ContentTypes.QueryAttractionData>(AttractionQuery, {
    variables: { slug },
  });

  const pageType = PageType.ATTRACTION;
  const adminLinks = useMemo(() => {
    if (data?.contentPage) {
      const attractionId = data.contentPage.id;

      return getAttractionAdminLinks(activeLocale, adminUrl, attractionId, pageType);
    }
    return [];
  }, [activeLocale, adminUrl, data, pageType]);
  if (loading) return <DefaultPageLoading />;
  if (error || !data || !data.contentPage) {
    return null;
  }

  const attraction = constructAttraction(
    data,
    {
      commonNsT,
      commonCarNsT,
      quickFactsNsT,
      pageType,
    },
    marketplace === Marketplace.GUIDE_TO_ICELAND
  );

  const { title, metaImages } = attraction;
  const alternateCanonicalUrl = constructAlternateCanonical({
    asPath,
    marketplaceUrl,
  });

  return (
    <>
      <SEOContainer
        isIndexed
        images={metaImages}
        openGraphType={OpenGraphType.WEBSITE}
        alternateCanonicalUrl={alternateCanonicalUrl}
      />
      <ContentPageWrapper id="attractionContainer">
        <AdminGearLoader links={adminLinks} pageType={PageType.ATTRACTION} slug={slug} />
        {/* We need this on top as it's fixed positioned and we want help to browser to parse it and render earlier */}
        <LazyHydrateWrapper ssrOnly>
          <BookingWidgetFooterMobile
            tourLandingUrl={
              attraction.toursSearchUrl ? attraction.toursSearchUrl : attraction.tourLandingUrl!
            }
          >
            {attraction.toursSearchUrl ? (
              <Trans
                ns={Namespaces.commonNs}
                i18nKey="See tours around {attraction}"
                defaults="See related trips"
                values={{ attraction: attraction.name }}
              />
            ) : (
              <Trans ns={Namespaces.commonNs}>Book your trip now</Trans>
            )}
          </BookingWidgetFooterMobile>
        </LazyHydrateWrapper>
        <LazyHydrateWrapper ssrOnly>
          <BreadcrumbsContainer slug={slug} type={pageType} />
        </LazyHydrateWrapper>
        {attraction.map ? (
          <CoverMapWrapper>
            <CoverMap
              mapId="attractions-map"
              map={attraction.map}
              rightTopContent={<TemperatureWidget slug={slug} pageType={pageType} />}
              fallbackCover={
                <Cover
                  images={attraction.images}
                  rightTopContent={<TemperatureWidget slug={slug} pageType={pageType} />}
                />
              }
              isClustersEnabled
            />
          </CoverMapWrapper>
        ) : null}
        <Propositions productProps={attraction.props} />
        <LazyHydrateWrapper ssrOnly>
          <Row
            main={
              <ContentLayoutHeadingWrapper>
                <ArticleLayoutHeading title={title} subtitle={attraction.shortDescription} />
              </ContentLayoutHeadingWrapper>
            }
          />
        </LazyHydrateWrapper>
        <WidgetsRowWrapper>
          <WidgetsRow
            contextPatch={{
              slug,
              id: attraction.id,
              pageType,
            }}
            left={{
              before: (
                <LazyHydrateWrapper ssrOnly>
                  <AttractionLeftColumnContent attraction={attraction} />
                </LazyHydrateWrapper>
              ),
            }}
            main={{
              // eslint-disable-next-line react/no-unstable-nested-components
              wrapWidgets: children => (
                <>
                  <WrapOldHtml images={attraction.images}>{children}</WrapOldHtml>
                  <FAQ slug={slug} pageType={pageType.toUpperCase()} />
                </>
              ),
              widgets: attraction.content.main,
            }}
            right={{ widgets: attraction.content.right, shiftUp: true }}
          />
        </WidgetsRowWrapper>
        <WidgetsFullWidth widgets={attraction.bottom || []} />
        <LazyHydrateWrapper ssrOnly>
          <AttractionStructuredData attraction={attraction} />
        </LazyHydrateWrapper>
      </ContentPageWrapper>
    </>
  );
};

export default AttractionContainer;
