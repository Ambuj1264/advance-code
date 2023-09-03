import React from "react";
import { useRouter } from "next/router";
import { ApolloError } from "apollo-client";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTheme } from "emotion-theming";

import { SubscribeFormLoading } from "../Footer/FooterWrapper";

import TGDestinationContentRightSection from "./sidebar/TGDestinationContentRightSection";
import TGDSectionContent from "./TGDSectionContent";

import { getAdminLinks } from "components/features/TravelGuides/utils/travelGuideUtils";
import TGDestinationContent from "components/features/TravelGuides/TGDestinationContent";
import AdminGearLoader from "components/features/AdminGear/AdminGearLoader";
import LazyHydrateWrapper from "components/ui/LazyHydrateWrapper";
import ProductHeader, { Title } from "components/ui/ProductHeader";
import {
  ArticleRow,
  ContainerLeftColumn,
  ContentPageWrapper,
  RightColumn,
  MainColumn,
  TableOfContentHolder,
  LeftColumn,
} from "components/ui/ArticleLayout/ArticleLayout";
import TOCLoader from "components/ui/ArticleLayout/TOCLoader";
import { useIsMobile } from "hooks/useMediaQueryCustom";
import { getMapDataWithMapboxStaticImage } from "components/ui/Cover/CoverMap/Google/mapUtils";
import { typographyH2, typographyH4 } from "styles/typography";
import { column, mediaQuery, mqMax, mqMin } from "styles/base";
import { gutters, guttersPx, zIndex } from "styles/variables";
import { useTranslation } from "i18n";
import { Namespaces } from "shared/namespaces";
import CustomNextDynamic from "lib/CustomNextDynamic";
import DefaultPageLoading from "components/ui/Loading/DefaultLoadingPage";
import GTECommonBreadcrumbs from "components/ui/Breadcrumbs/GTECommonBreadcrumbs";
import ArticleWidgetTableOfContents from "components/ui/ArticleWidget/widgets/ArticleWidgetTableOfContents";
import GraphCmsSEOContainer from "components/ui/GraphCmsSEOContainer";
import { GraphCMSPageType, OpenGraphType } from "types/enums";

const LazySubscribeForm = CustomNextDynamic(
  () => import("components/ui/SubscriptionsForm/SubscribeForm"),
  {
    ssr: false,
    loading: () => <SubscribeFormLoading />,
  }
);

const StyledProductHeader = styled(ProductHeader)`
  ${Title} {
    z-index: ${zIndex.z1};
    margin-bottom: ${gutters.small / 2}px;
    ${typographyH4}
    ${mqMin.large} {
      margin: ${gutters.large / 2}px 0;
      ${typographyH2}
      line-height: 50px;
    }
  }
`;

const StyledArticleWidgetTableOfContents = styled(ArticleWidgetTableOfContents)(
  ({ theme }) => css`
    color: ${theme.colors.primary};
  `
);

const StyledArticleRow = styled(ArticleRow)([
  css`
    ${LeftColumn} {
      ${column({ small: 1, large: 3 / 12 })};
    }
    ${RightColumn} {
      ${column({ small: 1, large: 3 / 12 })};
      ${mediaQuery({
        display: ["block", "block", "block"],
        margin: [`0 ${guttersPx.small}`, `0 ${guttersPx.small}`, "0 auto"],
      })}
    }
    ${MainColumn} {
      ${column({
        small: 1,
        medium: 1,
        large: 6 / 12,
      })};
      ${mqMin.large} {
        padding: 0 ${gutters.large}px;
      }
      ${mqMax.large} {
        margin-bottom: 25px;
      }
    }
  `,
]);

const TGDestinationsContainer = ({
  metadataUri,
  destinationData,
  queryLoading,
  queryError,
}: {
  metadataUri?: string;
  destinationData?: TravelGuideTypes.ConstructedDestinationContent;
  queryLoading?: boolean;
  queryError?: ApolloError;
}) => {
  const theme: Theme = useTheme();
  const { asPath } = useRouter();
  const isMobile = useIsMobile();
  const { t: travelGuidesT } = useTranslation(Namespaces.travelGuidesNs);

  // TODO: handle loading case for client side nav (look at article on gti)
  if (queryLoading) return <DefaultPageLoading />;
  if (queryError && !destinationData) return <div>error</div>;
  if (!queryError && destinationData) {
    const pageTitle = travelGuidesT(`{destination} travel guide`, {
      destination: destinationData.title,
    });
    const { coverMapData, contentMapData } = getMapDataWithMapboxStaticImage(
      isMobile,
      destinationData.mapData,
      920,
      430
    );
    return (
      <>
        <TOCLoader
          tableOfContents={{
            items: destinationData.tableOfContents,
          }}
          skipOffset
        />
        <GraphCmsSEOContainer
          metadata={{
            metadataTitle: pageTitle,
            metadataDescription: destinationData.metaDescription,
            canonicalUri: asPath,
            hreflangs: [],
            images: destinationData.images,
          }}
          isIndexed
          openGraphType={OpenGraphType.ARTICLE}
          funnelType={GraphCMSPageType.TravelGuides}
          pagePlace={destinationData.place}
        />
        <ContentPageWrapper id="travelGuideContainer">
          <LazyHydrateWrapper ssrOnly>
            {/* TODO: add structured data */}
            {destinationData.breadCrumbs.length > 0 && (
              <GTECommonBreadcrumbs
                breadcrumbs={destinationData.breadCrumbs}
                hideLastBreadcrumb={false}
              />
            )}
            <StyledProductHeader title={pageTitle} />
          </LazyHydrateWrapper>
          <StyledArticleRow
            left={
              <LazyHydrateWrapper ssrOnly>
                <ContainerLeftColumn shouldDrawGradient>
                  <TableOfContentHolder>
                    <StyledArticleWidgetTableOfContents
                      items={destinationData.tableOfContents}
                      theme={theme}
                    />
                  </TableOfContentHolder>
                </ContainerLeftColumn>
              </LazyHydrateWrapper>
            }
            main={
              <TGDestinationContent
                images={destinationData.images}
                destinationData={destinationData}
                coverMapData={coverMapData}
                SectionContent={
                  <TGDSectionContent
                    sections={destinationData.sections}
                    place={destinationData.place}
                    attractions={destinationData.attractions}
                    map={contentMapData}
                    metadataUri={metadataUri}
                  />
                }
              />
            }
            right={
              <TGDestinationContentRightSection
                place={destinationData.place}
                metadataUri={metadataUri}
              />
            }
          />
          <LazySubscribeForm isGTE />
          <AdminGearLoader
            links={getAdminLinks(destinationData.id)}
            hideCommonLinks
            infoText={[`Travel guide ID: ${destinationData.id}`]}
          />
        </ContentPageWrapper>
      </>
    );
  }
  return null;
};

export default TGDestinationsContainer;
